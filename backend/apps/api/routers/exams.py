import asyncio
import csv
import io
import shutil
from collections import defaultdict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import case, delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.dependencies import get_current_user, require_teacher
from db.models import (
    AnswerKey,
    AnswerKeyChunk,
    AnswerSheet,
    ConfidenceFlag,
    EvaluationResult,
    Exam,
    ExtractedAnswer,
    ProcessingJob,
    Question,
    SheetPage,
    TeacherOverride,
    User,
)
from db.session import get_db
from packages.common.config import get_settings
from packages.common.enums import AnswerKeyStatus, ExamStatus, ReviewStatus, SheetStatus
from packages.common.logging import get_logger
from packages.rag.chroma_service import chroma_service

router = APIRouter(prefix="/api/v1/exams", tags=["Exams"])
logger = get_logger(__name__)

MAX_MARKS_LIMIT = 1000.0


def _not_blank(v: str | None) -> str | None:
    if v is None:
        return None
    v = v.strip()
    if not v:
        raise ValueError("must not be blank")
    return v


class QuestionCreateRequest(BaseModel):
    question_number: int = Field(1, ge=1, le=500)
    question_text: str = Field(..., min_length=1, max_length=10_000)
    expected_answer: str | None = Field(None, max_length=20_000)
    max_marks: float = Field(10.0, gt=0, le=MAX_MARKS_LIMIT)
    rubric_hints: str | None = Field(None, max_length=10_000)

    _strip_text = field_validator("question_text")(_not_blank)


class ExamCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    course_code: str | None = Field(None, max_length=50)

    _strip_title = field_validator("title")(_not_blank)

    @field_validator("course_code")
    @classmethod
    def strip_code(cls, v: str | None) -> str | None:
        return (v or "").strip() or None


class LMSSyncRequest(BaseModel):
    provider: str = Field(..., min_length=1, max_length=100)
    course_id: str = Field(..., min_length=1, max_length=100)


async def _get_exam_or_404(db: AsyncSession, exam_id: int) -> Exam:
    exam = await db.get(Exam, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail=f"Exam {exam_id} not found.")
    return exam


def _csv_safe(value: object) -> object:
    """Stop spreadsheet apps from executing cell values like =HYPERLINK(...)."""
    if isinstance(value, str) and value[:1] in ("=", "+", "-", "@", "\t", "\r"):
        return "'" + value
    return value


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    total_graded = (await db.execute(
        select(func.count(AnswerSheet.id)).where(AnswerSheet.status == SheetStatus.EVALUATED)
    )).scalar() or 0

    counts = dict((await db.execute(
        select(EvaluationResult.review_status, func.count(EvaluationResult.id))
        .group_by(EvaluationResult.review_status)
    )).all())

    avg_score = (await db.execute(
        select(func.avg((EvaluationResult.score / EvaluationResult.max_score) * 100))
        .where(EvaluationResult.max_score > 0)
    )).scalar()

    return {
        "totalGraded": total_graded,
        "autoApproved": counts.get(ReviewStatus.AUTO_APPROVED, 0),
        "teacherReviewed": counts.get(ReviewStatus.REVIEWED, 0) + counts.get(ReviewStatus.OVERRIDDEN, 0),
        "needsReview": counts.get(ReviewStatus.NEEDS_REVIEW, 0) + counts.get(ReviewStatus.FLAGGED, 0),
        "averageScore": round(float(avg_score), 1) if avg_score is not None else 0.0,
    }


def _question_count_subquery():
    return (
        select(Question.exam_id, func.count(Question.id).label("n"))
        .group_by(Question.exam_id)
        .subquery()
    )


@router.get("")
async def list_exams(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    qc = _question_count_subquery()
    rows = (await db.execute(
        select(Exam, func.coalesce(qc.c.n, 0))
        .outerjoin(qc, qc.c.exam_id == Exam.id)
        .order_by(Exam.created_at.desc())
    )).all()
    return [
        {
            "id": exam.id,
            "title": exam.title,
            "courseCode": exam.course_code or "",
            "status": exam.status.name,
            "createdAt": exam.created_at.isoformat(),
            "questionCount": q_count,
        }
        for exam, q_count in rows
    ]


@router.post("")
async def create_exam(
    req: ExamCreateRequest, db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    exam = Exam(title=req.title, course_code=req.course_code, status=ExamStatus.ACCEPTING_UPLOADS)
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return {"id": exam.id, "title": exam.title, "courseCode": exam.course_code, "status": exam.status.name}


@router.get("/{exam_id}/questions")
async def get_exam_questions(
    exam_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    await _get_exam_or_404(db, exam_id)
    result = await db.execute(
        select(Question).where(Question.exam_id == exam_id).order_by(Question.question_number)
    )
    return [
        {
            "id": q.id,
            "examId": q.exam_id,
            "questionNumber": q.question_number,
            "questionText": q.question_text,
            "expectedAnswer": q.expected_answer or "",
            "maxMarks": q.max_marks,
            "rubricHints": q.rubric_hints or "",
        }
        for q in result.scalars().all()
    ]


@router.post("/{exam_id}/questions")
async def add_exam_question(
    exam_id: int,
    req: QuestionCreateRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    await _get_exam_or_404(db, exam_id)
    existing_q = (await db.execute(
        select(Question).where(
            Question.exam_id == exam_id, Question.question_number == req.question_number
        )
    )).scalar_one_or_none()

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
            rubric_hints=req.rubric_hints,
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
        "maxMarks": question_obj.max_marks,
    }


@router.post("/{exam_id}/reference")
async def upload_reference_document(
    exam_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    await _get_exam_or_404(db, exam_id)

    max_bytes = get_settings().max_upload_mb * 1024 * 1024
    file_bytes = await file.read(max_bytes + 1)
    if len(file_bytes) > max_bytes:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            f"Reference document is larger than {get_settings().max_upload_mb} MB.")
    if not file_bytes.startswith(b"%PDF-"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Reference document must be a PDF file.")

    ak_obj = (await db.execute(select(AnswerKey).where(AnswerKey.exam_id == exam_id))).scalar_one_or_none()
    if ak_obj:
        ak_obj.file_path = file.filename
        ak_obj.version += 1
    else:
        ak_obj = AnswerKey(exam_id=exam_id, file_path=file.filename)
        db.add(ak_obj)
    ak_obj.status = AnswerKeyStatus.EMBEDDING
    await db.commit()

    try:
        # Replace the previous reference material, keeping it if the new PDF fails to index.
        chunks_indexed = await asyncio.to_thread(chroma_service.replace_document, exam_id, file_bytes)
    except Exception as exc:
        logger.exception("reference_index_failed", exam_id=exam_id)
        ak_obj.status = AnswerKeyStatus.FAILED
        await db.commit()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to index the reference document.") from exc

    if chunks_indexed == 0:
        ak_obj.status = AnswerKeyStatus.FAILED
        await db.commit()
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            "No text could be extracted from this PDF (is it a scanned image?).",
        )

    ak_obj.status = AnswerKeyStatus.READY
    await db.commit()
    return {
        "message": f"Successfully indexed {chunks_indexed} chunks for {file.filename}",
        "chunks_indexed": chunks_indexed,
    }


@router.post("/{exam_id}/lms-sync")
async def sync_to_lms(
    exam_id: int,
    req: LMSSyncRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    await _get_exam_or_404(db, exam_id)
    evaluated_count = (await db.execute(
        select(func.count(AnswerSheet.id)).where(
            AnswerSheet.exam_id == exam_id, AnswerSheet.status == SheetStatus.EVALUATED
        )
    )).scalar() or 0

    # No LMS integration is configured yet, so say so instead of claiming success.
    return {
        "message": (
            f"{req.provider} sync is not connected yet — nothing was sent. "
            f"{evaluated_count} evaluated grade(s) are ready; use CSV export for now."
        ),
        "synced_count": 0,
        "ready_count": evaluated_count,
        "simulated": True,
    }


@router.get("/recent")
async def get_recent_batches(db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)):
    sc = (
        select(AnswerSheet.exam_id, func.count(AnswerSheet.id).label("n"))
        .group_by(AnswerSheet.exam_id)
        .subquery()
    )
    rows = (await db.execute(
        select(Exam, func.coalesce(sc.c.n, 0))
        .outerjoin(sc, sc.c.exam_id == Exam.id)
        .order_by(Exam.created_at.desc())
        .limit(5)
    )).all()
    return [
        {
            "id": f"EXM-{exam.id:03d}",
            "rawId": exam.id,
            "subject": exam.title,
            "date": exam.created_at.strftime("%b %d, %Y"),
            "total": sheet_count,
            "status": exam.status.name.replace("_", " ").title(),
            "progress": 100 if exam.status == ExamStatus.GRADED or sheet_count > 0 else 0,
        }
        for exam, sheet_count in rows
    ]


@router.get("/analytics")
async def get_exam_analytics(db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)):
    """Detailed score analytics across all evaluated sheets."""
    pct = (EvaluationResult.score / EvaluationResult.max_score) * 100
    stats_res = (await db.execute(
        select(
            func.avg(pct).label("avg"),
            func.count(EvaluationResult.id).label("count"),
        ).where(EvaluationResult.max_score > 0)
    )).first()

    exam_res = (await db.execute(
        select(Exam.title, func.avg(pct).label("avg"))
        .join(AnswerSheet, Exam.id == AnswerSheet.exam_id)
        .join(ExtractedAnswer, AnswerSheet.id == ExtractedAnswer.answer_sheet_id)
        .join(EvaluationResult, ExtractedAnswer.id == EvaluationResult.extracted_answer_id)
        .where(AnswerSheet.status == SheetStatus.EVALUATED, EvaluationResult.max_score > 0)
        .group_by(Exam.id)
    )).all()

    detail_res = (await db.execute(
        select(
            AnswerSheet.student_roll,
            Exam.title.label("exam_title"),
            func.sum(EvaluationResult.score).label("total_score"),
            func.sum(EvaluationResult.max_score).label("max_score"),
            AnswerSheet.created_at,
            AnswerSheet.status,
        )
        .join(Exam, AnswerSheet.exam_id == Exam.id)
        .join(ExtractedAnswer, AnswerSheet.id == ExtractedAnswer.answer_sheet_id)
        .join(EvaluationResult, ExtractedAnswer.id == EvaluationResult.extracted_answer_id)
        .where(AnswerSheet.status == SheetStatus.EVALUATED)
        .group_by(AnswerSheet.id)
        .order_by(AnswerSheet.created_at.desc())
    )).all()

    def pct_of(score: float | None, total: float | None) -> float:
        return round(float(score or 0) / float(total) * 100, 1) if total else 0.0

    # Highest/lowest are per-student sheet percentages, so exams with different totals compare fairly.
    sheet_pcts = [pct_of(r.total_score, r.max_score) for r in detail_res if r.max_score]

    return {
        "overall": {
            "averageScore": round(float(stats_res.avg or 0), 1) if stats_res else 0,
            "totalEvaluated": stats_res.count if stats_res else 0,
            "highestScore": max(sheet_pcts, default=0),
            "lowestScore": min(sheet_pcts, default=0),
        },
        "byExam": [{"exam": r.title, "avg": round(float(r.avg or 0), 1)} for r in exam_res],
        "details": [
            {
                "student": r.student_roll or "N/A",
                "exam": r.exam_title,
                "score": round(float(r.total_score or 0), 2),
                "total": round(float(r.max_score or 0), 2),
                "percentage": pct_of(r.total_score, r.max_score),
                "date": r.created_at.isoformat(),
                "status": r.status.name,
            }
            for r in detail_res
        ],
    }


@router.get("/results")
async def get_my_results(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Teachers see every sheet; students only see sheets filed under their own roll number."""
    query = (
        select(AnswerSheet, Exam.title)
        .outerjoin(Exam, Exam.id == AnswerSheet.exam_id)
        .order_by(AnswerSheet.created_at.desc())
    )
    if user.role != "teacher":
        # Without a roll number, `== None` would become IS NULL and match unassigned sheets.
        if not user.roll_number:
            return []
        query = query.where(AnswerSheet.student_roll == user.roll_number)
    sheets = (await db.execute(query)).all()

    # One aggregate query for all evaluated sheets (instead of 3 queries per sheet).
    exam_ids = {s.exam_id for s, _ in sheets}
    totals: dict[int, tuple[float, float]] = {}
    scores_by_exam: dict[int, list[float]] = defaultdict(list)
    if exam_ids:
        rows = (await db.execute(
            select(
                AnswerSheet.id,
                AnswerSheet.exam_id,
                func.sum(EvaluationResult.score),
                func.sum(EvaluationResult.max_score),
            )
            .join(ExtractedAnswer, ExtractedAnswer.answer_sheet_id == AnswerSheet.id)
            .join(EvaluationResult, EvaluationResult.extracted_answer_id == ExtractedAnswer.id)
            .where(AnswerSheet.exam_id.in_(exam_ids), AnswerSheet.status == SheetStatus.EVALUATED)
            .group_by(AnswerSheet.id)
        )).all()
        for sheet_id, exam_id, score, max_score in rows:
            totals[sheet_id] = (float(score or 0), float(max_score or 0))
            scores_by_exam[exam_id].append(float(score or 0))

    results = []
    for sheet, exam_title in sheets:
        evaluated = sheet.status == SheetStatus.EVALUATED and sheet.id in totals
        rank = percentile = None
        score = total = "Pending"
        if evaluated:
            s, m = totals[sheet.id]
            score, total = round(s, 1), round(m, 1)
            peers = scores_by_exam[sheet.exam_id]
            rank = 1 + sum(1 for p in peers if p > s)  # ties share a rank
            percentile = round(sum(1 for p in peers if p <= s) / len(peers) * 100)
        results.append({
            "id": f"T-{sheet.id:03d}",
            "rawId": sheet.id,
            "subject": exam_title or f"Exam {sheet.exam_id}",
            "studentRoll": sheet.student_roll or "N/A",
            "date": sheet.created_at.strftime("%b %d, %Y"),
            "score": score,
            "total": total,
            "status": sheet.status.name.replace("_", " ").title(),
            "rank": rank,
            "percentile": percentile,
        })
    return results


@router.get("/{exam_id}/export")
async def export_exam_results(
    exam_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    exam = await _get_exam_or_404(db, exam_id)
    rows = (await db.execute(
        select(
            AnswerSheet.student_roll,
            AnswerSheet.status,
            func.sum(EvaluationResult.score),
            func.sum(EvaluationResult.max_score),
            func.sum(case(
                (EvaluationResult.review_status.in_([ReviewStatus.NEEDS_REVIEW, ReviewStatus.FLAGGED]), 1),
                else_=0,
            )),
        )
        .join(ExtractedAnswer, ExtractedAnswer.answer_sheet_id == AnswerSheet.id)
        .join(EvaluationResult, EvaluationResult.extracted_answer_id == ExtractedAnswer.id)
        .where(AnswerSheet.exam_id == exam_id, AnswerSheet.status == SheetStatus.EVALUATED)
        .group_by(AnswerSheet.id)
        .order_by(AnswerSheet.student_roll)
    )).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student Roll", "Status", "Score", "Max Score", "Review Status"])
    for roll, sheet_status, score, max_score, pending in rows:
        writer.writerow([
            _csv_safe(roll or "N/A"),
            sheet_status.name,
            round(float(score or 0), 2),
            round(float(max_score or 0), 2),
            "NEEDS_REVIEW" if pending else "APPROVED",
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="exam_{exam.id}_results.csv"'},
    )


@router.delete("/data/clear")
async def clear_all_data(db: AsyncSession = Depends(get_db), user: User = Depends(require_teacher)):
    """Clears all dynamic data (exams, sheets, results, uploaded files, vectors). Teachers only."""
    for model in (TeacherOverride, ConfidenceFlag, EvaluationResult, ExtractedAnswer, SheetPage,
                  ProcessingJob, AnswerSheet, AnswerKeyChunk, AnswerKey, Question, Exam):
        await db.execute(delete(model))
    await db.commit()

    # SQLite reuses IDs, so stale vectors/files would leak into the next "exam 1".
    chroma_service.clear_all()
    upload_dir = get_settings().upload_dir
    if upload_dir.exists():
        for child in upload_dir.iterdir():
            if child.is_dir() and child.name.startswith("sheet_"):
                shutil.rmtree(child, ignore_errors=True)

    logger.warning("all_data_cleared", by=user.email)
    return {"message": "All evaluation data deleted successfully"}
