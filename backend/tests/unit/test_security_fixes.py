"""
tests/unit/test_security_fixes.py

Regression tests for the issues found in the full-stack audit.
"""
from __future__ import annotations

import pytest

from tests.conftest import JPEG_BYTES


# ── Authentication & authorization ───────────────────────────────────────────


@pytest.mark.parametrize("method,path", [
    ("GET", "/api/v1/exams/stats"),
    ("GET", "/api/v1/exams/analytics"),
    ("GET", "/api/v1/exams/results"),
    ("GET", "/api/v1/sheets/list"),
    ("GET", "/api/v1/sheets/reevaluations"),
    ("GET", "/api/v1/sheets/1/review"),
    ("GET", "/api/v1/sheets/1/file"),
    ("POST", "/api/v1/exams"),
    ("POST", "/api/v1/sheets/1/approve"),
    ("DELETE", "/api/v1/exams/data/clear"),
])
def test_endpoints_require_login(api_client, method, path) -> None:
    assert api_client.request(method, path, json={}).status_code == 401


def test_invalid_and_tampered_tokens_rejected(api_client, teacher_headers) -> None:
    token = teacher_headers["Authorization"].split()[1]
    payload, sig = token.split(".")
    for bad in ("garbage", f"{payload}.{sig[:-2]}xx", f"{payload[:-2]}xx.{sig}"):
        res = api_client.get("/api/v1/exams/stats", headers={"Authorization": f"Bearer {bad}"})
        assert res.status_code == 401


@pytest.mark.parametrize("method,path", [
    ("GET", "/api/v1/exams/stats"),
    ("GET", "/api/v1/sheets/list"),
    ("GET", "/api/v1/sheets/1/review"),
    ("POST", "/api/v1/sheets/1/approve"),
    ("POST", "/api/v1/exams"),
    ("DELETE", "/api/v1/exams/data/clear"),
])
def test_students_cannot_use_teacher_endpoints(api_client, student_headers, method, path) -> None:
    res = api_client.request(method, path, json={"score": 1, "title": "x"}, headers=student_headers)
    assert res.status_code == 403


def test_wrong_password_and_unknown_user(api_client) -> None:
    assert api_client.post("/api/v1/auth/login", json={
        "email": "teacher@test.local", "password": "wrong"}).status_code == 401
    assert api_client.post("/api/v1/auth/login", json={
        "email": "nobody@test.local", "password": "whatever"}).status_code == 401


def test_register_creates_student_never_teacher(api_client) -> None:
    res = api_client.post("/api/v1/auth/register", json={
        "name": "Mallory", "email": "mallory@test.local", "password": "abcdef",
        "roll_number": "2024MAL001", "role": "teacher",
    })
    assert res.status_code == 201
    assert res.json()["role"] == "student"
    dup = api_client.post("/api/v1/auth/register", json={
        "name": "Mallory", "email": "MALLORY@test.local", "password": "abcdef", "roll_number": "X9",
    })
    assert dup.status_code == 409


def test_password_is_not_stored_in_plaintext() -> None:
    from packages.common.auth import hash_password, verify_password

    stored = hash_password("s3cret!")
    assert "s3cret!" not in stored
    assert verify_password("s3cret!", stored)
    assert not verify_password("wrong", stored)


def test_students_only_see_their_own_results(api_client, teacher_headers, student_headers,
                                              graded_sheet_id) -> None:
    other = api_client.post(
        "/api/v1/sheets/upload", data={"exam_id": "1", "student_roll": "SOMEONE_ELSE"},
        files={"files": ("x.jpg", JPEG_BYTES, "image/jpeg")}, headers=teacher_headers,
    )
    assert other.status_code == 200

    mine = api_client.get("/api/v1/exams/results", headers=student_headers).json()
    assert mine, "student should see their own graded sheet"
    assert {r["studentRoll"] for r in mine} == {"2024TEST001"}

    everyone = api_client.get("/api/v1/exams/results", headers=teacher_headers).json()
    assert "SOMEONE_ELSE" in {r["studentRoll"] for r in everyone}


def test_student_upload_is_filed_under_own_roll(api_client, student_headers) -> None:
    res = api_client.post(
        "/api/v1/sheets/upload", data={"exam_id": "1", "student_roll": "IMPERSONATED"},
        files={"files": ("mine.jpg", JPEG_BYTES, "image/jpeg")}, headers=student_headers,
    )
    assert res.status_code == 200
    assert res.json()["student_rolls"] == ["2024TEST001"]


# ── Grading correctness ──────────────────────────────────────────────────────


def test_evaluator_failure_never_awards_marks(api_client, teacher_headers, monkeypatch) -> None:
    from apps.api.routers import sheets

    def boom(**_kwargs):
        raise RuntimeError("400 INVALID_ARGUMENT: API key not valid")

    monkeypatch.setattr(sheets, "evaluate_answer_sheet", boom)
    res = api_client.post(
        "/api/v1/sheets/upload", data={"exam_id": "1", "student_roll": "2024FAIL01"},
        files={"files": ("f.jpg", JPEG_BYTES, "image/jpeg")}, headers=teacher_headers,
    )
    sheet_id = res.json()["sheet_ids"][0]
    review = api_client.get(f"/api/v1/sheets/{sheet_id}/review", headers=teacher_headers).json()
    assert review["status"] == "FAILED"
    assert review["jobStatus"] == "FAILED"
    assert review["evaluations"] == []
    assert "API key" in review["jobError"]
    assert "{" not in review["jobError"]  # no raw upstream JSON


def test_gemini_placeholder_key_is_not_configured(monkeypatch) -> None:
    from packages.common.config import get_settings
    from packages.ocr.gemini_evaluator import evaluate_answer_sheet, gemini_key_configured

    for placeholder in ("", "your_gemini_api_key_here", "YOUR_GEMINI_API_KEY"):
        monkeypatch.setenv("GEMINI_API_KEY", placeholder)
        get_settings.cache_clear()
        assert gemini_key_configured() is False
        with pytest.raises(ValueError):
            evaluate_answer_sheet(files_data=[{"bytes": b"x", "mime_type": "image/png"}])
    get_settings.cache_clear()


@pytest.mark.parametrize("score", [-5, 999, 1e308])
def test_approve_rejects_out_of_range_scores(api_client, teacher_headers, graded_sheet_id, score) -> None:
    res = api_client.post(f"/api/v1/sheets/{graded_sheet_id}/approve",
                          json={"score": score}, headers=teacher_headers)
    assert res.status_code == 422
    # dashboards keep working
    for path in ("/api/v1/sheets/list", "/api/v1/exams/stats", "/api/v1/exams/analytics"):
        assert api_client.get(path, headers=teacher_headers).status_code == 200


def test_approve_rejects_nan(api_client, teacher_headers, graded_sheet_id) -> None:
    res = api_client.post(f"/api/v1/sheets/{graded_sheet_id}/approve",
                          content='{"score": NaN}', headers={**teacher_headers, "Content-Type": "application/json"})
    assert res.status_code == 422


def test_duplicate_reevaluation_requests_do_not_break_list(api_client, teacher_headers, student_headers,
                                                             graded_sheet_id) -> None:
    for reason in ("first", "second"):
        res = api_client.post(f"/api/v1/sheets/{graded_sheet_id}/reevaluate",
                              json={"reason": reason}, headers=student_headers)
        assert res.status_code == 200

    listing = api_client.get("/api/v1/sheets/reevaluations", headers=teacher_headers)
    assert listing.status_code == 200
    mine = [r for r in listing.json() if r["sheetId"] == graded_sheet_id]
    assert len(mine) == 1 and mine[0]["reason"] == "second"

    dismissed = api_client.delete(f"/api/v1/sheets/reevaluations/{mine[0]['evalId']}", headers=teacher_headers)
    assert dismissed.status_code == 200


def test_student_cannot_reevaluate_someone_elses_sheet(api_client, teacher_headers, student_headers) -> None:
    res = api_client.post(
        "/api/v1/sheets/upload", data={"exam_id": "1", "student_roll": "NOT_ME"},
        files={"files": ("n.jpg", JPEG_BYTES, "image/jpeg")}, headers=teacher_headers,
    )
    sheet_id = res.json()["sheet_ids"][0]
    res = api_client.post(f"/api/v1/sheets/{sheet_id}/reevaluate", json={"reason": "x"}, headers=student_headers)
    assert res.status_code == 404


def test_top_scorer_percentile_is_100(api_client, teacher_headers, graded_sheet_id) -> None:
    results = api_client.get("/api/v1/exams/results", headers=teacher_headers).json()
    graded = [r for r in results if r["status"] == "Evaluated"]
    best = max(graded, key=lambda r: r["score"])
    assert best["rank"] == 1
    assert best["percentile"] == 100


# ── Input validation ─────────────────────────────────────────────────────────


def test_question_for_missing_exam_is_404(api_client, teacher_headers) -> None:
    res = api_client.post("/api/v1/exams/999/questions",
                          json={"question_number": 1, "question_text": "q", "max_marks": 5},
                          headers=teacher_headers)
    assert res.status_code == 404


@pytest.mark.parametrize("body", [
    {"title": "   "},
    {"title": "A" * 201},
])
def test_exam_title_validation(api_client, teacher_headers, body) -> None:
    assert api_client.post("/api/v1/exams", json=body, headers=teacher_headers).status_code == 422


@pytest.mark.parametrize("body", [
    {"question_number": 1, "question_text": "   ", "max_marks": 5},
    {"question_number": 1, "question_text": "q", "max_marks": 1e308},
])
def test_question_validation(api_client, teacher_headers, body) -> None:
    assert api_client.post("/api/v1/exams/1/questions", json=body, headers=teacher_headers).status_code == 422


def test_unknown_status_filter_rejected(api_client, teacher_headers) -> None:
    assert api_client.get("/api/v1/sheets/list?status=bogus", headers=teacher_headers).status_code == 422


def test_export_missing_exam_is_404_and_csv_is_escaped(api_client, teacher_headers) -> None:
    assert api_client.get("/api/v1/exams/999/export", headers=teacher_headers).status_code == 404
    from apps.api.routers.exams import _csv_safe

    assert _csv_safe('=HYPERLINK("http://evil","x")').startswith("'")
    assert _csv_safe("2024CS001") == "2024CS001"


def test_reference_upload_requires_pdf(api_client, teacher_headers) -> None:
    res = api_client.post("/api/v1/exams/1/reference",
                          files={"file": ("notes.txt", b"hello", "text/plain")}, headers=teacher_headers)
    assert res.status_code == 400


def test_lms_sync_does_not_claim_success(api_client, teacher_headers) -> None:
    res = api_client.post("/api/v1/exams/1/lms-sync", json={"provider": "Canvas", "course_id": "1"},
                          headers=teacher_headers)
    assert res.status_code == 200
    assert res.json()["synced_count"] == 0
    assert res.json()["simulated"] is True


def test_file_endpoint_accepts_token_query_param(api_client, teacher_headers, graded_sheet_id) -> None:
    token = teacher_headers["Authorization"].split()[1]
    res = api_client.get(f"/api/v1/sheets/{graded_sheet_id}/pages/1/file?token={token}")
    assert res.status_code == 200
    assert res.headers["content-type"] == "image/jpeg"


def test_legacy_absolute_paths_still_resolve(tmp_path, monkeypatch) -> None:
    from apps.api.routers.sheets import resolve_page_path
    from packages.common.config import get_settings

    upload = tmp_path / "uploads"
    (upload / "sheet_7").mkdir(parents=True)
    (upload / "sheet_7" / "page_1_a.pdf").write_bytes(b"%PDF-")
    monkeypatch.setenv("UPLOAD_DIR", str(upload))
    get_settings.cache_clear()
    try:
        legacy = r"D:\OLD\MACHINE\backend\data\uploads\sheet_7\page_1_a.pdf"
        assert resolve_page_path(legacy) == upload / "sheet_7" / "page_1_a.pdf"
        assert resolve_page_path("sheet_7/page_1_a.pdf") == upload / "sheet_7" / "page_1_a.pdf"
    finally:
        get_settings.cache_clear()
