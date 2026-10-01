"""
tests/unit/test_zz_clear_data.py

Named to run last: it wipes all data from the (temporary) test database.
"""
from __future__ import annotations


def test_clear_all_data_is_teacher_only_and_clears(api_client, teacher_headers, student_headers) -> None:
    assert api_client.delete("/api/v1/exams/data/clear", headers=student_headers).status_code == 403
    res = api_client.delete("/api/v1/exams/data/clear", headers=teacher_headers)
    assert res.status_code == 200
    assert api_client.get("/api/v1/exams", headers=teacher_headers).json() == []
