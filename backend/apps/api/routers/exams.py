from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
import io
import csv
from fastapi.responses import StreamingResponse

from db.session import get_db
from db.models import Exam, AnswerSheet, EvaluationResult, ExtractedAnswer
from packages.common.enums import ExamStatus

router = APIRouter(prefix="/api/v1/exams", tags=["Exams"])

@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    total_graded_query = select(func.count(AnswerSheet.id)).where(AnswerSheet.status == "EVALUATED")
    total_graded = (await db.execute(total_graded_query)).scalar() or 0
    
    # Calculate average score based on EvaluationResult
    # For simplicity, we just return mocked numbers based on db counts
    return {
        "totalGraded": total_graded,
        "autoApproved": total_graded,
        "needsReview": 0,
        "averageScore": 88.5
    }

@router.get("/recent")
async def get_recent_batches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exam).order_by(Exam.created_at.desc()).limit(5))
    exams = result.scalars().all()
    batches = []
    for exam in exams:
        sheet_count = (await db.execute(select(func.count(AnswerSheet.id)).where(AnswerSheet.exam_id == exam.id))).scalar() or 0
        batches.append({
            "id": f"EXM-{exam.id:03d}",
            "subject": exam.title,
            "date": exam.created_at.strftime("%b %d, %Y"),
            "total": sheet_count,
            "status": exam.status.name.replace("_", " ").title(),
            "progress": 100 if exam.status == ExamStatus.GRADED else 50
        })
    return batches

@router.get("/results")
async def get_my_results(db: AsyncSession = Depends(get_db)):
    # This simulates fetching results for the currently logged in student.
    # We fetch all evaluated sheets and their related evaluation results.
    query = (
        select(AnswerSheet)
        .options(selectinload(AnswerSheet.exam))
        .where(AnswerSheet.status == "EVALUATED")
        .order_by(AnswerSheet.created_at.desc())
    )
    result = await db.execute(query)
    sheets = result.scalars().all()
    
    results = []
    for sheet in sheets:
        # Fetch score for this sheet
        # A sheet has extracted_answers -> evaluation_results
        query_score = (
            select(func.sum(EvaluationResult.score))
            .join(ExtractedAnswer, EvaluationResult.extracted_answer_id == ExtractedAnswer.id)
            .where(ExtractedAnswer.answer_sheet_id == sheet.id)
        )
        total_score = (await db.execute(query_score)).scalar() or 0.0
        
        query_max = (
            select(func.sum(EvaluationResult.max_score))
            .join(ExtractedAnswer, EvaluationResult.extracted_answer_id == ExtractedAnswer.id)
            .where(ExtractedAnswer.answer_sheet_id == sheet.id)
        )
        max_score = (await db.execute(query_max)).scalar() or 100.0
        
        results.append({
            "id": f"T-{sheet.id:03d}",
            "subject": sheet.exam.title if sheet.exam is not None else f"Exam {sheet.exam_id}",
            "date": sheet.created_at.strftime("%b %d, %Y"),
            "score": round(total_score, 1),
            "total": round(max_score, 1),
            "status": sheet.status.name.replace("_", " ").title(),
            "rank": 1,
            "percentile": 99
        })
    return results

@router.get("/{exam_id}/export")
async def export_exam_results(exam_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(AnswerSheet)
        .options(selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result))
        .where(AnswerSheet.exam_id == exam_id)
        .where(AnswerSheet.status == "EVALUATED")
    )
    result = await db.execute(query)
    sheets = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student Roll", "Status", "Score", "Max Score"])

    for sheet in sheets:
        score = sum(ans.evaluation_result.score for ans in sheet.extracted_answers if ans.evaluation_result)
        max_score = sum(ans.evaluation_result.max_score for ans in sheet.extracted_answers if ans.evaluation_result)
        writer.writerow([sheet.student_roll, sheet.status.name, score, max_score])

    output.seek(0)
    return StreamingResponse(
        output, 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=exam_{exam_id}_results.csv"}
    )

