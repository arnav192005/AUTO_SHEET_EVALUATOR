import asyncio
import math
import re
from pathlib import Path
from typing import Literal

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from apps.api.dependencies import (
    get_current_user,
    require_teacher,
    require_teacher_for_file,
)
from db.models import (
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
from db.session import AsyncSessionLocal, get_db
from packages.common.config import get_settings
from packages.common.enums import ConfidenceBand, JobStatus, ReviewStatus, SheetStatus
from packages.common.logging import get_logger
from packages.ocr.gemini_evaluator import evaluate_answer_sheet
from packages.rag.chroma_service import chroma_service

logger = get_logger(__name__)
router = APIRouter(prefix="/api/v1/sheets", tags=["Sheets"])

_eval_semaphore = asyncio.Semaphore(2)

MAX_FILES_PER_UPLOAD = 50
REEVAL_FLAG = "student_reeval_request"

# extension -> (mime type, required leading bytes)
FILE_SIGNATURES: dict[str, tuple[str, tuple[bytes, ...]]] = {
    ".pdf": ("application/pdf", (b"%PDF-",)),
    ".png": ("image/png", (b"\x89PNG\r\n\x1a\n",)),
    ".jpg": ("image/jpeg", (b"\xff\xd8\xff",)),
    ".jpeg": ("image/jpeg", (b"\xff\xd8\xff",)),
}


# ── Helpers ───────────────────────────────────────────────────────────────────


def _mime_for(path: Path) -> str:
    entry = FILE_SIGNATURES.get(path.suffix.lower())
    return entry[0] if entry else "application/octet-stream"


def resolve_page_path(stored: str) -> Path | None:
    """Find a page file on disk.

    New rows store paths relative to UPLOAD_DIR. Older rows stored absolute
    paths from the machine that uploaded them, so fall back to the
    `sheet_N/<file>` tail inside the current UPLOAD_DIR.
    """
    upload_dir = get_settings().upload_dir
    p = Path(stored)
    candidates = [p] if p.is_absolute() else [upload_dir / p]
    parts = Path(stored.replace("\\", "/")).parts
    if len(parts) >= 2:
        candidates.append(upload_dir / parts[-2] / parts[-1])
    for c in candidates:
        if c.is_file():
            return c
    return None


def _short_error(exc: Exception) -> str:
    """A user-safe error summary (no raw upstream JSON)."""
    text = str(exc)
    lowered = text.lower()
    if "api key not valid" in lowered or "api_key_invalid" in lowered or "not configured" in lowered:
        return "Gemini API key is missing or invalid. Ask the administrator to set GEMINI_API_KEY."
    if "429" in text or "resource_exhausted" in lowered or "quota" in lowered:
        return "The AI service quota is exhausted. Try again later."
    first_line = text.splitlines()[0] if text else type(exc).__name__
    return first_line[:200]


def _confidence(value: object) -> float:
    try:
        c = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return 0.0
    if not math.isfinite(c):
        return 0.0
    if c > 1:
        c /= 100.0
    return min(max(c, 0.0), 1.0)


def _band(conf: float) -> ConfidenceBand:
    settings = get_settings()
    if conf >= settings.confidence_auto_approve:
        return ConfidenceBand.HIGH
    if conf >= settings.confidence_mandatory_review:
        return ConfidenceBand.MEDIUM
    return ConfidenceBand.LOW


def _finite(value: object, default: float) -> float:
    try:
        v = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default
    return v if math.isfinite(v) else default


# ── Background evaluation ─────────────────────────────────────────────────────


async def process_answer_sheet_task(sheet_id: int, exam_id: int, job_id: int) -> None:
    """
    Evaluate an answer sheet in the background.

    Every question is evaluated first and the results are written in one
    transaction, so a failure part-way through never leaves a half-graded sheet.
    """
    async with _eval_semaphore, AsyncSessionLocal() as db:
        job = await db.get(ProcessingJob, job_id)
        sheet = await db.get(AnswerSheet, sheet_id)
        if job is None or sheet is None:
            return
        job.status = JobStatus.RUNNING
        job.stage = "evaluating"
        sheet.status = SheetStatus.EVALUATING
        await db.commit()

        try:
            pages = (await db.execute(
                select(SheetPage).where(SheetPage.answer_sheet_id == sheet_id).order_by(SheetPage.page_number)
            )).scalars().all()
            files_data = []
            for p in pages:
                path = resolve_page_path(p.file_path) if p.file_path else None
                if path:
                    files_data.append({"bytes": path.read_bytes(), "mime_type": _mime_for(path)})
            if not files_data:
                raise ValueError("No readable files found for this answer sheet.")

            questions = (await db.execute(
                select(Question).where(Question.exam_id == exam_id).order_by(Question.question_number)
            )).scalars().all()
            if not questions:
                raise ValueError("This exam has no questions defined yet.")

            results = []
            for q in questions:
                reference_context = await asyncio.to_thread(
                    chroma_service.retrieve_context, exam_id, q.question_text
                )
                evaluation = await asyncio.to_thread(
                    evaluate_answer_sheet,
                    files_data=files_data,
                    question_text=q.question_text,
                    expected_answer=q.expected_answer,
                    max_marks=q.max_marks,
                    reference_context=reference_context or None,
                )
                results.append((q, evaluation))

            # Re-running a sheet replaces its previous results.
            await db.execute(delete(ExtractedAnswer).where(ExtractedAnswer.answer_sheet_id == sheet_id))

            auto_approve = get_settings().confidence_auto_approve
            for q, evaluation in results:
                conf = _confidence(evaluation.get("aiConfidence"))
                score = min(max(_finite(evaluation.get("score"), 0.0), 0.0), q.max_marks)
                missing = evaluation.get("missingConcepts") or []
                extracted = ExtractedAnswer(
                    answer_sheet_id=sheet_id,
                    question_number=q.question_number,
                    raw_text=str(evaluation.get("studentAnswer", "")),
                    confidence=conf,
                )
                extracted.evaluation_result = EvaluationResult(
                    score=score,
                    max_score=q.max_marks,
                    reasoning=str(evaluation.get("llmRationale") or evaluation.get("reasoning") or ""),
                    concept_scores=[
                        {"concept": str(c), "present": False, "partial_credit": 0.0, "evidence": None}
                        for c in missing if isinstance(c, str)
                    ],
                    confidence=conf,
                    confidence_band=_band(conf),
                    review_status=(
                        ReviewStatus.AUTO_APPROVED
                        if evaluation.get("reviewStatus") == "AUTO_APPROVED" and conf >= auto_approve
                        else ReviewStatus.NEEDS_REVIEW
                    ),
                )
                db.add(extracted)

            sheet.status = SheetStatus.EVALUATED
            job.status = JobStatus.COMPLETED
            job.stage = "done"
            job.error_message = None
            await db.commit()

        except Exception as e:
            logger.exception("sheet_evaluation_failed", sheet_id=sheet_id)
            await db.rollback()
            async with AsyncSessionLocal() as err_db:
                job = await err_db.get(ProcessingJob, job_id)
                sheet = await err_db.get(AnswerSheet, sheet_id)
                if job:
                    job.status = JobStatus.FAILED
                    job.error_message = _short_error(e)
                if sheet:
                    sheet.status = SheetStatus.FAILED
                await err_db.commit()


# ── Request models ────────────────────────────────────────────────────────────


class ApproveScoreRequest(BaseModel):
    score: float
    question_number: int = Field(1, ge=1)
    teacher_id: str | None = None  # ignored; the signed-in teacher is recorded

    @field_validator("score")
    @classmethod
    def finite_non_negative(cls, v: float) -> float:
        if not math.isfinite(v) or v < 0:
            raise ValueError("score must be a finite number ≥ 0")
        return v


class FlagIssueRequest(BaseModel):
    reason: str | None = Field("Teacher flagged issue", max_length=2000)
    question_number: int = Field(1, ge=1)


class ReevaluationRequest(BaseModel):
    reason: str = Field(..., min_length=1, max_length=2000)
    question_number: int | None = Field(None, ge=1, description="Omit to request every question")

    @field_validator("reason")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("please give a reason")
        return v


async def _evaluation_for(db: AsyncSession, sheet_id: int, question_number: int) -> EvaluationResult:
    eval_res = (await db.execute(
        select(EvaluationResult)
        .join(ExtractedAnswer)
        .where(ExtractedAnswer.answer_sheet_id == sheet_id)
        .where(ExtractedAnswer.question_number == question_number)
    )).scalars().first()
    if not eval_res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation for question {question_number} on sheet {sheet_id} not found.",
        )
    return eval_res


# ── Upload ────────────────────────────────────────────────────────────────────


async def _read_validated(file: UploadFile, max_bytes: int) -> tuple[str, bytes]:
    filename = Path(file.filename or "").name
    ext = Path(filename).suffix.lower()
    if ext not in FILE_SIGNATURES:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unsupported file type '{filename or 'unnamed'}'. Please upload a PDF, JPG, or PNG file.",
        )
    contents = await file.read(max_bytes + 1)
    if not contents:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"'{filename}' is empty.")
    if len(contents) > max_bytes:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            f"'{filename}' is larger than {max_bytes // (1024 * 1024)} MB.",
        )
    if not contents.startswith(FILE_SIGNATURES[ext][1]):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"'{filename}' is not a valid {ext[1:].upper()} file.",
        )
    return filename, contents


def _save_page(sheet_id: int, page_number: int, filename: str, contents: bytes) -> str:
    upload_dir = get_settings().upload_dir
    safe_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename)[:120] or "file"
    relative = Path(f"sheet_{sheet_id}") / f"page_{page_number}_{safe_name}"
    dest = upload_dir / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(contents)
    return relative.as_posix()


@router.post("/upload")
async def upload_answer_sheets(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    exam_id: int = Form(...),
    student_roll: str | None = Form(None),
    is_multi_page: bool = Form(False),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not files:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No files provided for upload.")
    if len(files) > MAX_FILES_PER_UPLOAD:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Upload at most {MAX_FILES_PER_UPLOAD} files at once.")

    if not await db.get(Exam, exam_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            f"Exam with ID {exam_id} not found. Please verify the exam exists before uploading answer sheets.",
        )

    if user.role == "teacher":
        roll = (student_roll or "").strip()
        if not roll:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Please enter the student roll number.")
    else:
        # Students always submit under their own roll number, as one sheet.
        roll = user.roll_number or ""
        if not roll:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Your account has no roll number.")
        if len(files) > 1:
            is_multi_page = True
    if len(roll) > 50:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Roll number is too long (max 50 characters).")

    max_bytes = get_settings().max_upload_mb * 1024 * 1024
    validated = [await _read_validated(f, max_bytes) for f in files]

    # One sheet with many pages, or one sheet per file. For a batch of separate
    # files the roll number is a prefix: 2024CS -> 2024CS001, 2024CS002, ...
    if is_multi_page or len(validated) == 1:
        groups = [(roll, validated)]
    else:
        groups = [(f"{roll}{i:03d}", [item]) for i, item in enumerate(validated, start=1)]

    created: list[tuple[int, int]] = []
    for sheet_roll, group in groups:
        sheet = AnswerSheet(
            exam_id=exam_id,
            student_roll=sheet_roll,
            original_filename=", ".join(name for name, _ in group)[:500],
            page_count=len(group),
            status=SheetStatus.UPLOADED,
        )
        db.add(sheet)
        await db.flush()
        job = ProcessingJob(answer_sheet_id=sheet.id, status=JobStatus.PENDING, stage="queued")
        db.add(job)
        for page_number, (name, contents) in enumerate(group, start=1):
            db.add(SheetPage(
                answer_sheet_id=sheet.id,
                page_number=page_number,
                file_path=_save_page(sheet.id, page_number, name, contents),
            ))
        await db.flush()
        created.append((sheet.id, job.id))

    await db.commit()
    for sheet_id, job_id in created:
        background_tasks.add_task(process_answer_sheet_task, sheet_id, exam_id, job_id)

    return {
        "message": "Files uploaded successfully. Evaluation is running in the background.",
        "sheet_ids": [s for s, _ in created],
        "job_ids": [j for _, j in created],
        "student_rolls": [r for r, _ in groups],
    }


# ── Listing & review ──────────────────────────────────────────────────────────


@router.get("/list")
async def list_graded_sheets(
    status: Literal["ALL", "AUTO_APPROVED", "NEEDS_REVIEW"] = "ALL",
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    """Graded answer sheets. Status options: ALL, AUTO_APPROVED, NEEDS_REVIEW."""
    query = (
        select(AnswerSheet)
        .join(ExtractedAnswer)
        .join(EvaluationResult)
        .options(
            selectinload(AnswerSheet.exam),
            selectinload(AnswerSheet.student),
            selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result),
        )
        .where(AnswerSheet.status == SheetStatus.EVALUATED)
        .distinct()
        .order_by(AnswerSheet.created_at.desc())
    )
    pending = [ReviewStatus.NEEDS_REVIEW, ReviewStatus.FLAGGED]
    if status == "AUTO_APPROVED":
        query = query.where(EvaluationResult.review_status == ReviewStatus.AUTO_APPROVED)
    elif status == "NEEDS_REVIEW":
        query = query.where(EvaluationResult.review_status.in_(pending))

    out = []
    for s in (await db.execute(query)).scalars().all():
        evals = [ea.evaluation_result for ea in s.extracted_answers if ea.evaluation_result]
        obtained = sum(e.score for e in evals)
        total = sum(e.max_score for e in evals)
        needs_review = any(e.review_status in pending for e in evals)
        out.append({
            "sheetId": s.id,
            "studentName": s.student.name if s.student else "Unknown",
            "studentRoll": s.student_roll or "N/A",
            "examName": s.exam.title if s.exam else "Unknown Exam",
            "examId": s.exam_id,
            "obtainedMarks": round(obtained, 2),
            "totalMarks": round(total, 2),
            "percentage": round(obtained / total * 100, 1) if total > 0 else 0,
            "evaluationDate": s.created_at.isoformat(),
            "status": s.status.name,
            "confidence": int(min((e.confidence for e in evals), default=0) * 100),
            "reviewStatus": "NEEDS_REVIEW" if needs_review else (evals[0].review_status.name if evals else "PENDING"),
        })
    return out


def _file_response(page: SheetPage | None, missing_detail: str) -> FileResponse:
    path = resolve_page_path(page.file_path) if page and page.file_path else None
    if path is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, missing_detail)
    media_type = _mime_for(path)
    return FileResponse(
        path=str(path),
        media_type=media_type,
        # Only known-safe types are shown inline; anything else is a download.
        content_disposition_type="inline" if media_type != "application/octet-stream" else "attachment",
        filename=path.name,
    )


@router.get("/{sheet_id}/file")
async def get_sheet_file(
    sheet_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher_for_file)
):
    page = (await db.execute(
        select(SheetPage).where(SheetPage.answer_sheet_id == sheet_id).order_by(SheetPage.page_number)
    )).scalars().first()
    return _file_response(page, f"No document file found for answer sheet {sheet_id}.")


@router.get("/{sheet_id}/pages/{page_number}/file")
async def get_sheet_page_file(
    sheet_id: int,
    page_number: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher_for_file),
):
    page = (await db.execute(
        select(SheetPage).where(SheetPage.answer_sheet_id == sheet_id, SheetPage.page_number == page_number)
    )).scalars().first()
    return _file_response(page, f"Page {page_number} not found for answer sheet {sheet_id}.")


@router.get("/reevaluations")
async def list_reevaluation_requests(
    db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    """Pending student re-evaluation requests (one row per evaluation, newest reason shown)."""
    rows = (await db.execute(
        select(ConfidenceFlag, ExtractedAnswer, AnswerSheet, Exam)
        .join(EvaluationResult, EvaluationResult.id == ConfidenceFlag.evaluation_result_id)
        .join(ExtractedAnswer, ExtractedAnswer.id == EvaluationResult.extracted_answer_id)
        .join(AnswerSheet, AnswerSheet.id == ExtractedAnswer.answer_sheet_id)
        .join(Exam, Exam.id == AnswerSheet.exam_id)
        .where(ConfidenceFlag.flag_type == REEVAL_FLAG)
        .order_by(ConfidenceFlag.created_at.desc())
    )).all()

    seen: set[int] = set()
    out = []
    for flag, ea, sheet, exam in rows:
        if flag.evaluation_result_id in seen:
            continue
        seen.add(flag.evaluation_result_id)
        out.append({
            "id": f"R-{flag.evaluation_result_id:03d}",
            "evalId": flag.evaluation_result_id,
            "sheetId": sheet.id,
            "questionNumber": ea.question_number,
            "student": sheet.student_roll or "N/A",
            "subject": exam.title,
            "testId": f"T-{sheet.id:03d}",
            "reason": flag.detail or "No reason provided",
            "status": "Pending",
            "date": flag.created_at.strftime("%b %d, %Y"),
        })
    return out


@router.get("/{sheet_id}/review")
async def get_sheet_review(
    sheet_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(require_teacher)
):
    options = (
        selectinload(AnswerSheet.exam),
        selectinload(AnswerSheet.pages),
        selectinload(AnswerSheet.extracted_answers).selectinload(ExtractedAnswer.evaluation_result),
    )
    if sheet_id == "next":
        query = (
            select(AnswerSheet)
            .join(ExtractedAnswer, AnswerSheet.id == ExtractedAnswer.answer_sheet_id)
            .join(EvaluationResult, ExtractedAnswer.id == EvaluationResult.extracted_answer_id)
            .options(*options)
            .where(EvaluationResult.review_status.in_([ReviewStatus.NEEDS_REVIEW, ReviewStatus.FLAGGED]))
            .order_by(AnswerSheet.created_at.asc())
            .limit(1)
        )
    else:
        try:
            sid = int(sheet_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid sheet_id") from None
        query = select(AnswerSheet).options(*options).where(AnswerSheet.id == sid)

    sheet = (await db.execute(query)).scalars().first()
    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No answer sheet is waiting for review." if sheet_id == "next"
            else f"Answer sheet with ID {sheet_id} not found.",
        )

    expected = dict((await db.execute(
        select(Question.question_number, Question.expected_answer).where(Question.exam_id == sheet.exam_id)
    )).all())

    evaluations = []
    for ea in sorted(sheet.extracted_answers, key=lambda a: a.question_number):
        ev = ea.evaluation_result
        if ev is None:
            continue
        evaluations.append({
            "questionNumber": ea.question_number,
            "rawText": ea.raw_text,
            "expectedAnswer": expected.get(ea.question_number) or "",
            "score": ev.score,
            "maxScore": ev.max_score,
            "aiConfidence": round(ev.confidence * 100),
            "llmRationale": ev.reasoning,
            "reasoning": ev.reasoning,
            "missingConcepts": [
                c.get("concept") for c in (ev.concept_scores or [])
                if isinstance(c, dict) and not c.get("present") and c.get("concept")
            ],
            "reviewStatus": ev.review_status.name,
        })

    pages = sorted(sheet.pages, key=lambda p: p.page_number)
    file_urls = [f"/api/v1/sheets/{sheet.id}/pages/{p.page_number}/file" for p in pages]
    file_types = [_mime_for(Path(p.file_path)) for p in pages]

    job = (await db.execute(
        select(ProcessingJob)
        .where(ProcessingJob.answer_sheet_id == sheet.id)
        .order_by(ProcessingJob.id.desc())
        .limit(1)
    )).scalars().first()

    return {
        "sheetId": sheet.id,
        "examId": sheet.exam_id,
        "examTitle": sheet.exam.title if sheet.exam else f"Exam #{sheet.exam_id}",
        "studentRoll": sheet.student_roll or "N/A",
        "fileName": sheet.original_filename,
        "evaluations": evaluations,
        "status": sheet.status.name,
        "jobStatus": job.status.name if job else None,
        "jobStage": job.stage if job else None,
        "jobError": _short_error(Exception(job.error_message)) if job and job.error_message else None,
        "fileUrls": file_urls,
        "fileTypes": file_types,
        "fileUrl": file_urls[0] if file_urls else None,
        "fileType": file_types[0] if file_types else None,
    }


# ── Teacher actions ───────────────────────────────────────────────────────────


@router.post("/{sheet_id}/approve")
async def approve_score(
    sheet_id: int,
    req: ApproveScoreRequest,
    db: AsyncSession = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    eval_res = await _evaluation_for(db, sheet_id, req.question_number)
    if req.score > eval_res.max_score:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            f"Score must be between 0 and {eval_res.max_score:g}.",
        )

    old_score = eval_res.score
    eval_res.score = req.score
    if abs(old_score - req.score) > 0.01:
        eval_res.review_status = ReviewStatus.OVERRIDDEN
        db.add(TeacherOverride(
            evaluation_result_id=eval_res.id,
            teacher_id=teacher.email,
            old_score=old_score,
            new_score=req.score,
            override_reason="Teacher manual score approval & adjustment.",
        ))
    else:
        eval_res.review_status = ReviewStatus.REVIEWED

    # Approving answers any pending re-evaluation request for this question.
    await db.execute(delete(ConfidenceFlag).where(
        ConfidenceFlag.evaluation_result_id == eval_res.id,
        ConfidenceFlag.flag_type == REEVAL_FLAG,
    ))
    await db.commit()

    return {
        "message": f"Score for Q{req.question_number} approved successfully! Final score: {req.score:g}",
        "sheet_id": sheet_id,
        "question_number": req.question_number,
        "score": req.score,
        "reviewStatus": "APPROVED",
    }


@router.post("/{sheet_id}/flag")
async def flag_issue(
    sheet_id: int,
    req: FlagIssueRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    eval_res = await _evaluation_for(db, sheet_id, req.question_number)
    eval_res.review_status = ReviewStatus.FLAGGED
    db.add(ConfidenceFlag(
        evaluation_result_id=eval_res.id,
        flag_type="teacher_flag",
        detail=(req.reason or "").strip() or "Flagged by teacher for manual re-checking.",
    ))
    await db.commit()
    return {
        "message": "Issue flagged successfully and saved to database.",
        "sheet_id": sheet_id,
        "question_number": req.question_number,
        "reviewStatus": "FLAGGED",
    }


@router.post("/{sheet_id}/reevaluate")
async def request_reevaluation(
    sheet_id: int,
    req: ReevaluationRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sheet = await db.get(AnswerSheet, sheet_id)
    if sheet is None or (user.role != "teacher" and sheet.student_roll != user.roll_number):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Answer sheet {sheet_id} not found.")

    query = (
        select(EvaluationResult)
        .join(ExtractedAnswer)
        .where(ExtractedAnswer.answer_sheet_id == sheet_id)
    )
    if req.question_number is not None:
        query = query.where(ExtractedAnswer.question_number == req.question_number)
    evals = (await db.execute(query)).scalars().all()
    if not evals:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This sheet has no graded answers to re-evaluate yet.")

    for eval_res in evals:
        eval_res.review_status = ReviewStatus.NEEDS_REVIEW
        existing = (await db.execute(select(ConfidenceFlag).where(
            ConfidenceFlag.evaluation_result_id == eval_res.id,
            ConfidenceFlag.flag_type == REEVAL_FLAG,
        ))).scalars().first()
        if existing:
            existing.detail = req.reason  # one open request per question; keep the latest reason
        else:
            db.add(ConfidenceFlag(evaluation_result_id=eval_res.id, flag_type=REEVAL_FLAG, detail=req.reason))

    await db.commit()
    return {
        "message": "Re-evaluation request submitted successfully.",
        "sheet_id": sheet_id,
        "question_number": req.question_number,
        "reviewStatus": "NEEDS_REVIEW",
    }


@router.delete("/reevaluations/{eval_id}")
async def dismiss_reevaluation(
    eval_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_teacher),
):
    result = await db.execute(delete(ConfidenceFlag).where(
        ConfidenceFlag.evaluation_result_id == eval_id,
        ConfidenceFlag.flag_type == REEVAL_FLAG,
    ))
    if result.rowcount == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Re-evaluation request not found.")

    # The teacher kept the original score, so the answer counts as reviewed.
    eval_res = await db.get(EvaluationResult, eval_id)
    if eval_res and eval_res.review_status == ReviewStatus.NEEDS_REVIEW:
        eval_res.review_status = ReviewStatus.REVIEWED
    await db.commit()
    return {"message": "Re-evaluation request dismissed successfully."}
