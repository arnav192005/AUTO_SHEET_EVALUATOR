from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel, Field
import io
import csv
from fastapi.responses import StreamingResponse

from db.session import get_db
from db.models import Exam, AnswerSheet, Question, EvaluationResult, ExtractedAnswer
from packages.common.enums import ExamStatus, SheetStatus, ReviewStatus

router = APIRouter(prefix="/api/v1/exams", tags=["Exams"])


class QuestionCreateRequest(BaseModel):
    question_number: int = Field(1, ge=1)
    question_text: str = Field(..., min_length=1)
    expected_answer: Optional[str] = None
    max_marks: float = Field(10.0, gt=0)
    rubric_hints: Optional[str] = None


class ExamCreateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    course_code: Optional[str] = None


@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    total_graded_query = select(func.count(AnswerSheet.id))
    total_graded = (await db.execute(total_graded_query)).scalar() or 0

    auto_approved_query = select(func.count(EvaluationResult.id)).where(
        EvaluationResult.review_status == ReviewStatus.AUTO_APPROVED
    )
    auto_approved = (await db.execute(auto_approved_query)).scalar() or 0

    needs_review_query = select(func.count(EvaluationResult.id)).where(
        EvaluationResult.review_status == ReviewStatus.NEEDS_REVIEW
    )
    needs_review = (await db.execute(needs_review_query)).scalar() or 0

    avg_query = select(
        func.avg((EvaluationResult.score / EvaluationResult.max_score) * 100)
    ).where(EvaluationResult.max_score > 0)

    avg_score = (await db.execute(avg_query)).scalar()
    avg_score_val = round(float(avg_score), 1) if avg_score is not None else 0.0

    return {
        "totalGraded": total_graded,
        "autoApproved": auto_approved,
        "needsReview": needs_review,
        "averageScore": avg_score_val
    }


@router.get("")
async def list_exams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exam).order_by(Exam.created_at.desc()))
    exams = result.scalars().all()
    out = []
    for exam in exams:
        q_count = (await db.execute(
            select(func.count(Question.id)).where(Question.exam_id == exam.id)
        )).scalar() or 0
        out.append({
            "id": exam.id,
            "title": exam.title,
            "courseCode": exam.course_code or "",
            "status": exam.status.name,
            "createdAt": exam.created_at.isoformat(),
            "questionCount": q_count
        })
    return out


@router.post("")
async def create_exam(req: ExamCreateRequest, db: AsyncSession = Depends(get_db)):
    exam = Exam(
        title=req.title,
        course_code=req.course_code,
        status=ExamStatus.ACCEPTING_UPLOADS
    )
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return {
        "id": exam.id,
        "title": exam.title,
        "courseCode": exam.course_code,
        "status": exam.status.name
    }


@router.get("/{exam_id}/questions")
async def get_exam_questions(exam_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Question).where(Question.exam_id == exam_id).order_by(Question.question_number)
    )
    questions = result.scalars().all()
    return [
        {
            "id": q.id,
            "examId": q.exam_id,
            "questionNumber": q.question_number,
            "questionText": q.question_text,
            "expectedAnswer": q.expected_answer or "",
            "maxMarks": q.max_marks,
            "rubricHints": q.rubric_hints or ""
        }
        for q in questions
    ]


@router.post("/{exam_id}/questions")
async def add_exam_question(
    exam_id: int,
    req: QuestionCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    # Check if question exists for this exam_id & question_number
    query = select(Question).where(
        Question.exam_id == exam_id,
        Question.question_number == req.question_number
    )
    existing_q = (await db.execute(query)).scalar_one_or_none()

    if existing_q:
        existing_q.question_text = req.question_text
        existing_q.expected_answer = req.expected_answer
        existing_q.max_marks = req.max_marks
        existing_q.rubric_hints = req.rubric_hints
        question_obj = existing_q
    else:
        question_obj = Question(
            exam_id=exam_id,
            question_number=req.question_number,
            question_text=req.question_text,
            expected_answer=req.expected_answer,
            max_marks=req.max_marks,
            rubric_hints=req.rubric_hints
        )
        db.add(question_obj)

    await db.commit()
    await db.refresh(question_obj)
    return {
        "message": "Question and Answer Key rubric saved successfully",
        "id": question_obj.id,
        "examId": question_obj.exam_id,
        "questionNumber": question_obj.question_number,
        "questionText": question_obj.question_text,
        "expectedAnswer": question_obj.expected_answer,
        "maxMarks": question_obj.max_marks
    }


@router.get("/recent")
async def get_recent_batches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exam).order_by(Exam.created_at.desc()).limit(5))
    exams = result.scalars().all()
    batches = []
    for exam in exams:
        sheet_count = (await db.execute(
            select(func.count(AnswerSheet.id)).where(AnswerSheet.exam_id == exam.id)
        )).scalar() or 0

        batches.append({
            "id": f"EXM-{exam.id:03d}",
            "rawId": exam.id,
            "subject": exam.title,
            "date": exam.created_at.strftime("%b %d, %Y"),
            "total": sheet_count,
            "status": exam.status.name.replace("_", " ").title(),
            "progress": 100 if exam.status == ExamStatus.GRADED else (100 if sheet_count > 0 else 0)
        })
    return batches


@router.get("/results")
async def get_my_results(db: AsyncSession = Depends(get_db)):
    query = (
        select(AnswerSheet)
        .options(selectinload(AnswerSheet.exam))
        .where(AnswerSheet.status == SheetStatus.EVALUATED)
        .order_by(AnswerSheet.created_at.desc())
    )
    result = await db.execute(query)
    sheets = result.scalars().all()

    results = []
    for sheet in sheets:
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
        max_score = (await db.execute(query_max)).scalar() or 10.0

        results.append({
            "id": f"T-{sheet.id:03d}",
            "rawId": sheet.id,
            "subject": sheet.exam.title if sheet.exam is not None else f"Exam {sheet.exam_id}",
            "studentRoll": sheet.student_roll or "N/A",
            "date": sheet.created_at.strftime("%b %d, %Y"),
            "score": round(total_score, 1),
            "total": round(max_score, 1),
            "status": sheet.status.name.replace("_", " ").title()
        })
    return results


@router.get("/{exam_id}/export")
async def export_exam_results(exam_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(AnswerSheet)
        .options(selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result))
        .where(AnswerSheet.exam_id == exam_id)
        .where(AnswerSheet.status == SheetStatus.EVALUATED)
    )
    result = await db.execute(query)
    sheets = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student Roll", "Status", "Score", "Max Score", "Review Status"])

    for sheet in sheets:
        score = sum(ans.evaluation_result.score for ans in sheet.extracted_answers if ans.evaluation_result)
        max_score = sum(ans.evaluation_result.max_score for ans in sheet.extracted_answers if ans.evaluation_result) or 10.0
        rev_status = sheet.extracted_answers[0].evaluation_result.review_status.name if (sheet.extracted_answers and sheet.extracted_answers[0].evaluation_result) else sheet.status.name
        writer.writerow([sheet.student_roll or "N/A", sheet.status.name, round(score, 2), round(max_score, 2), rev_status])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=exam_{exam_id}_results.csv"}
    )
