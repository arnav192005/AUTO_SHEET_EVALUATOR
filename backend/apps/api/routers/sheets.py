from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.session import get_db
from db.models import AnswerSheet, Exam
from packages.common.enums import SheetStatus
from packages.ocr.gemini_evaluator import evaluate_answer_sheet

router = APIRouter(prefix="/api/v1/sheets", tags=["Sheets"])

@router.post("/upload")
async def upload_answer_sheets(
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db)
):
    results = []
    for file in files:
        contents = await file.read()
        mime_type = file.content_type or "image/jpeg"
        
        evaluation = evaluate_answer_sheet(contents, mime_type)
        evaluation["fileName"] = file.filename
        results.append(evaluation)
        
    return {"message": "Files processed", "results": results}
