"""
tests/conftest.py

Shared pytest fixtures for the entire test suite.

Every test run uses a throw-away temp directory for the database, uploads and
vector store, and the Gemini evaluator is replaced by a fake, so tests never
touch real data or call external APIs.
"""
from __future__ import annotations

import asyncio
import os
import tempfile
import warnings
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Suppress starlette's cosmetic deprecation about httpx vs httpx2
warnings.filterwarnings("ignore", category=DeprecationWarning, module="starlette")
warnings.filterwarnings("ignore", message=".*httpx.*", category=DeprecationWarning)

_TMP = Path(tempfile.mkdtemp(prefix="ase_tests_"))

# Must be set before any app module is imported (settings/engine are created at import).
os.environ.update({
    "APP_ENV": "development",
    "ALLOWED_TEACHER_IDS": "teacher_test",
    "DATABASE_URL": f"sqlite+aiosqlite:///{(_TMP / 'test.db').as_posix()}",
    "UPLOAD_DIR": str(_TMP / "uploads"),
    "CHROMA_PERSIST_DIR": str(_TMP / "chroma"),
    "AUTH_SECRET": "test-secret-not-for-production",
    "TEACHER_EMAIL": "teacher@test.local",
    "TEACHER_PASSWORD": "teacher-pass-123",
    "GEMINI_API_KEY": "",
})

TEACHER = {"email": "teacher@test.local", "password": "teacher-pass-123"}

# Minimal valid file headers for upload tests.
JPEG_BYTES = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00"
PDF_BYTES = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"


def fake_evaluate(files_data, question_text=None, expected_answer=None, max_marks=10.0,
                  reference_context=None):
    """Deterministic stand-in for Gemini: 70% of the marks, needs review."""
    return {
        "studentAnswer": f"fake answer for: {question_text}",
        "score": round(max_marks * 0.7, 2),
        "maxScore": max_marks,
        "llmRationale": "fake rationale",
        "aiConfidence": 80,
        "missingConcepts": ["fake missing concept"],
        "reviewStatus": "NEEDS_REVIEW",
    }


@pytest.fixture(scope="session")
def api_client() -> TestClient:
    """Synchronous TestClient for the FastAPI app (session-scoped)."""
    from apps.api.main import app
    from apps.api.routers import sheets
    from db.models import Exam, Question
    from db.session import AsyncSessionLocal, create_all_tables

    sheets.evaluate_answer_sheet = fake_evaluate

    async def setup_db():
        await create_all_tables()
        async with AsyncSessionLocal() as session:
            exam = Exam(title="Test Exam", course_code="TEST101")
            session.add(exam)
            await session.flush()
            session.add(Question(
                exam_id=exam.id, question_number=1, question_text="What is 2+2?",
                expected_answer="4", max_marks=10.0,
            ))
            await session.commit()

    asyncio.run(setup_db())

    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="session")
def teacher_headers(api_client) -> dict[str, str]:
    res = api_client.post("/api/v1/auth/login", json=TEACHER)
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['token']}"}


@pytest.fixture(scope="session")
def student_headers(api_client) -> dict[str, str]:
    res = api_client.post("/api/v1/auth/register", json={
        "name": "Test Student", "email": "student@test.local",
        "password": "student-pass", "roll_number": "2024TEST001",
    })
    assert res.status_code == 201, res.text
    return {"Authorization": f"Bearer {res.json()['token']}"}


@pytest.fixture(scope="session")
def graded_sheet_id(api_client, teacher_headers) -> int:
    """Upload one sheet for exam 1 / roll 2024TEST001 and wait for grading."""
    files = {"files": ("sheet.jpg", JPEG_BYTES, "image/jpeg")}
    res = api_client.post(
        "/api/v1/sheets/upload", data={"exam_id": "1", "student_roll": "2024TEST001"},
        files=files, headers=teacher_headers,
    )
    assert res.status_code == 200, res.text
    return res.json()["sheet_ids"][0]
