"""
tests/unit/test_dashboard.py

Unit tests for dashboard statistics calculation endpoint.
"""
from __future__ import annotations


def test_dashboard_stats_endpoint(api_client, teacher_headers) -> None:
    """Dashboard stats endpoint must return all required metric keys."""
    response = api_client.get("/api/v1/exams/stats", headers=teacher_headers)
    assert response.status_code == 200
    data = response.json()
    for key in ("totalGraded", "autoApproved", "teacherReviewed", "needsReview", "averageScore"):
        assert key in data
    assert isinstance(data["totalGraded"], int)
    assert isinstance(data["averageScore"], (int, float))


def test_recent_batches_endpoint(api_client, teacher_headers) -> None:
    """Recent batches endpoint must return list of recent exam batches."""
    response = api_client.get("/api/v1/exams/recent", headers=teacher_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
