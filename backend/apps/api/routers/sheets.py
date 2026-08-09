from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from db.session import get_db
from db.models import AnswerSheet, Question, ExtractedAnswer, EvaluationResult, TeacherOverride, ConfidenceFlag
from packages.common.enums import SheetStatus, ReviewStatus, ConfidenceBand
from packages.ocr.gemini_evaluator import evaluate_answer_sheet

router = APIRouter(prefix="/api/v1/sheets", tags=["Sheets"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}


class ApproveScoreRequest(BaseModel):
    score: float
    teacher_id: Optional[str] = "teacher1"


class FlagIssueRequest(BaseModel):
    reason: Optional[str] = "Teacher flagged issue"


@router.post("/upload")
async def upload_answer_sheets(
    files: List[UploadFile] = File(...),
    exam_id: int = Form(1),
    student_roll: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided for upload."
        )

    # Validate file formats
    for file in files:
        ext = ("." + file.filename.split(".")[-1]).lower() if "." in file.filename else ""
        content_type = file.content_type or ""
        if ext not in ALLOWED_EXTENSIONS and content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type '{file.filename}'. Please upload a PDF, JPG, or PNG file."
            )

    # Look up defined question/rubric for exam_id
    q_result = await db.execute(
        select(Question).where(Question.exam_id == exam_id).order_by(Question.question_number)
    )
    questions = q_result.scalars().all()
    first_q = questions[0] if questions else None

    question_text = first_q.question_text if first_q else None
    expected_answer = first_q.expected_answer if first_q else None
    max_marks = first_q.max_marks if first_q else 10.0

    results = []
    created_sheet_id = None

    for file in files:
        contents = await file.read()
        mime_type = file.content_type or ("application/pdf" if file.filename.endswith(".pdf") else "image/jpeg")

        evaluation = evaluate_answer_sheet(
            image_bytes=contents,
            mime_type=mime_type,
            question_text=question_text,
            expected_answer=expected_answer,
            max_marks=max_marks
        )
        evaluation["fileName"] = file.filename
        evaluation["studentRoll"] = student_roll or "2024CS001"
        evaluation["examId"] = exam_id

        # Save record to SQLite
        sheet = AnswerSheet(
            exam_id=exam_id,
            student_roll=student_roll or "2024CS001",
            original_filename=file.filename,
            page_count=1,
            status=SheetStatus.EVALUATED
        )
        db.add(sheet)
        await db.flush()
        created_sheet_id = sheet.id

        extracted = ExtractedAnswer(
            answer_sheet_id=sheet.id,
            question_number=1,
            raw_text=evaluation.get("studentAnswer", ""),
            confidence=float(evaluation.get("aiConfidence", 90)) / 100.0 if evaluation.get("aiConfidence", 90) > 1 else float(evaluation.get("aiConfidence", 0.9))
        )
        db.add(extracted)
        await db.flush()

        ai_conf = evaluation.get("aiConfidence", 90)
        conf_float = float(ai_conf) / 100.0 if ai_conf > 1 else float(ai_conf)

        eval_res = EvaluationResult(
            extracted_answer_id=extracted.id,
            score=float(evaluation.get("score", 10.0)),
            max_score=float(evaluation.get("maxScore", max_marks)),
            reasoning=evaluation.get("llmRationale", evaluation.get("reasoning", "")),
            confidence=conf_float,
            confidence_band=ConfidenceBand.HIGH if conf_float >= 0.85 else ConfidenceBand.MEDIUM,
            review_status=ReviewStatus.AUTO_APPROVED if conf_float >= 0.85 else ReviewStatus.NEEDS_REVIEW
        )
        db.add(eval_res)
        await db.commit()

        evaluation["sheetId"] = sheet.id
        results.append(evaluation)

    return {
        "message": "Files processed and saved to database successfully",
        "sheet_id": created_sheet_id,
        "results": results
    }


@router.get("/{sheet_id}/review")
async def get_sheet_review(sheet_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(AnswerSheet)
        .options(
            selectinload(AnswerSheet.exam),
            selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result)
        )
        .where(AnswerSheet.id == sheet_id)
    )
    result = await db.execute(query)
    sheet = result.scalar_one_or_none()

    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Answer sheet with ID {sheet_id} not found."
        )

    extracted = sheet.extracted_answers[0] if sheet.extracted_answers else None
    eval_res = extracted.evaluation_result if extracted else None

    # Fetch question for expected answer
    q_result = await db.execute(
        select(Question).where(Question.exam_id == sheet.exam_id).order_by(Question.question_number)
    )
    first_q = q_result.scalars().first()
    expected_answer = first_q.expected_answer if first_q and first_q.expected_answer else "Standard expected answer from rubric."

    conf_pct = int(eval_res.confidence * 100) if eval_res and eval_res.confidence <= 1.0 else int(eval_res.confidence) if eval_res else 90

    return {
        "sheetId": sheet.id,
        "examId": sheet.exam_id,
        "examTitle": sheet.exam.title if sheet.exam else f"Exam #{sheet.exam_id}",
        "studentRoll": sheet.student_roll or "N/A",
        "fileName": sheet.original_filename,
        "studentAnswer": extracted.raw_text if extracted else "",
        "expectedAnswer": expected_answer,
        "score": eval_res.score if eval_res else 0.0,
        "maxScore": eval_res.max_score if eval_res else 10.0,
        "aiConfidence": conf_pct,
        "llmRationale": eval_res.reasoning if eval_res else "",
        "reasoning": eval_res.reasoning if eval_res else "",
        "missingConcepts": ["Review notation clarity."] if conf_pct < 85 else [],
        "reviewStatus": eval_res.review_status.name if (eval_res and hasattr(eval_res.review_status, "name")) else str(eval_res.review_status if eval_res else "NEEDS_REVIEW")
    }


@router.post("/{sheet_id}/approve")
async def approve_score(
    sheet_id: int,
    req: ApproveScoreRequest,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(AnswerSheet)
        .options(
            selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result)
        )
        .where(AnswerSheet.id == sheet_id)
    )
    result = await db.execute(query)
    sheet = result.scalar_one_or_none()

    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Answer sheet with ID {sheet_id} not found."
        )

    extracted = sheet.extracted_answers[0] if sheet.extracted_answers else None
    eval_res = extracted.evaluation_result if extracted else None

    if eval_res:
        old_score = eval_res.score
        eval_res.score = req.score
        eval_res.review_status = ReviewStatus.AUTO_APPROVED

        if abs(old_score - req.score) > 0.01:
            override = TeacherOverride(
                evaluation_result_id=eval_res.id,
                teacher_id=req.teacher_id or "teacher1",
                old_score=old_score,
                new_score=req.score,
                override_reason="Teacher manual score approval & adjustment."
            )
            db.add(override)

    sheet.status = SheetStatus.EVALUATED
    await db.commit()

    return {
        "message": f"Score approved and saved to database successfully! Final score: {req.score}",
        "sheet_id": sheet_id,
        "score": req.score,
        "reviewStatus": "APPROVED"
    }


@router.post("/{sheet_id}/flag")
async def flag_issue(
    sheet_id: int,
    req: FlagIssueRequest,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(AnswerSheet)
        .options(
            selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result)
        )
        .where(AnswerSheet.id == sheet_id)
    )
    result = await db.execute(query)
    sheet = result.scalar_one_or_none()

    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Answer sheet with ID {sheet_id} not found."
        )

    extracted = sheet.extracted_answers[0] if sheet.extracted_answers else None
    eval_res = extracted.evaluation_result if extracted else None

    if eval_res:
        eval_res.review_status = ReviewStatus.NEEDS_REVIEW
        flag = ConfidenceFlag(
            evaluation_result_id=eval_res.id,
            flag_type="teacher_flag",
            detail=req.reason or "Flagged by teacher for manual re-checking."
        )
        db.add(flag)

    await db.commit()

    return {
        "message": "Issue flagged successfully and saved to database.",
        "sheet_id": sheet_id,
        "reviewStatus": "FLAGGED"
    }
