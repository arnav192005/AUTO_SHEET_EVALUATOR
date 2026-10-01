"""
tests/unit/test_upload.py

Unit and integration tests for the answer sheet upload endpoint.
"""
from __future__ import annotations

import pytest

from tests.conftest import JPEG_BYTES, PDF_BYTES


def _upload(client, headers, files, data=None):
    return client.post("/api/v1/sheets/upload", data=data or {"exam_id": "1", "student_roll": "R1"},
                       files=files, headers=headers)


def test_upload_requires_login(api_client) -> None:
    res = _upload(api_client, {}, {"files": ("a.jpg", JPEG_BYTES, "image/jpeg")})
    assert res.status_code == 401


def test_upload_validation_rejects_unsupported_file(api_client, teacher_headers) -> None:
    """Uploading unsupported file extension like .txt must return 400 Bad Request."""
    res = _upload(api_client, teacher_headers, {"files": ("test.txt", b"Dummy text", "text/plain")})
    assert res.status_code == 400
    assert "Unsupported file type" in res.json()["detail"]


@pytest.mark.parametrize("name,content,ctype", [
    ("evil.html", b"<script>alert(1)</script>", "image/png"),   # spoofed content type
    ("tool.exe", b"MZ\x90\x00", "application/pdf"),
    ("fake.pdf", b"just some text", "application/pdf"),          # wrong file signature
    ("empty.pdf", b"", "application/pdf"),
])
def test_upload_rejects_disguised_or_empty_files(api_client, teacher_headers, name, content, ctype) -> None:
    res = _upload(api_client, teacher_headers, {"files": (name, content, ctype)})
    assert res.status_code == 400, res.text


def test_upload_requires_roll_number(api_client, teacher_headers) -> None:
    res = _upload(api_client, teacher_headers, {"files": ("a.jpg", JPEG_BYTES, "image/jpeg")},
                  data={"exam_id": "1"})
    assert res.status_code == 400


def test_upload_valid_image_returns_success(api_client, teacher_headers) -> None:
    """Uploading valid image/jpeg sheet returns 200 OK and sheet IDs."""
    res = _upload(api_client, teacher_headers,
                  {"files": ("sample_student_sheet.jpg", JPEG_BYTES, "image/jpeg")},
                  data={"exam_id": "1", "student_roll": "2024TEST009"})
    assert res.status_code == 200
    body = res.json()
    assert len(body["sheet_ids"]) == 1
    assert len(body["job_ids"]) == 1
    assert body["student_rolls"] == ["2024TEST009"]


def test_batch_upload_uses_roll_prefix(api_client, teacher_headers) -> None:
    files = [("files", (f"s{i}.pdf", PDF_BYTES, "application/pdf")) for i in range(3)]
    res = _upload(api_client, teacher_headers, files, data={"exam_id": "1", "student_roll": "2024BX"})
    assert res.status_code == 200
    assert res.json()["student_rolls"] == ["2024BX001", "2024BX002", "2024BX003"]


def test_one_job_per_sheet(api_client, teacher_headers) -> None:
    res = _upload(api_client, teacher_headers, {"files": ("one.jpg", JPEG_BYTES, "image/jpeg")},
                  data={"exam_id": "1", "student_roll": "2024JOB1"})
    sheet_id = res.json()["sheet_ids"][0]
    import asyncio

    from sqlalchemy import func, select

    from db.models import ProcessingJob
    from db.session import AsyncSessionLocal

    async def count():
        async with AsyncSessionLocal() as db:
            return (await db.execute(select(func.count(ProcessingJob.id))
                                     .where(ProcessingJob.answer_sheet_id == sheet_id))).scalar()

    assert asyncio.run(count()) == 1
