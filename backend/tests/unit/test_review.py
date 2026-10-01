"""
tests/unit/test_review.py

Unit tests for review score approval and issue flagging endpoints.
"""
from __future__ import annotations


def test_approve_score_and_flag_issue(api_client, teacher_headers, graded_sheet_id) -> None:
    """Test approval of score and flagging an issue for a sheet."""
    sheet_id = graded_sheet_id

    review_res = api_client.get(f"/api/v1/sheets/{sheet_id}/review", headers=teacher_headers)
    assert review_res.status_code == 200
    body = review_res.json()
    assert body["sheetId"] == sheet_id
    assert body["status"] == "EVALUATED"
    ev = body["evaluations"][0]
    assert ev["score"] == 7.0  # from the fake evaluator, not "full marks"
    assert ev["expectedAnswer"] == "4"
    assert ev["missingConcepts"] == ["fake missing concept"]

    approve_res = api_client.post(
        f"/api/v1/sheets/{sheet_id}/approve", json={"score": 8.5}, headers=teacher_headers
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["score"] == 8.5
    assert approve_res.json()["reviewStatus"] == "APPROVED"

    flag_res = api_client.post(
        f"/api/v1/sheets/{sheet_id}/flag",
        json={"reason": "Handwriting difficult to decipher"},
        headers=teacher_headers,
    )
    assert flag_res.status_code == 200
    assert flag_res.json()["reviewStatus"] == "FLAGGED"
