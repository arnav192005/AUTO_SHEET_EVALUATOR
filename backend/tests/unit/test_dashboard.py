"""
tests/unit/test_dashboard.py

Unit tests for dashboard statistics calculation endpoint.
"""
from __future__ import annotations


def test_dashboard_stats_endpoint(api_client) -> None:
    """Dashboard stats endpoint must return all required metric keys."""
    response = api_client.get("/api/v1/exams/stats")
    assert response.status_code == 200
    data = response.json()
    assert "totalGraded" in data
    assert "autoApproved" in data
    assert "needsReview" in data
    assert "averageScore" in data
    assert isinstance(data["totalGraded"], int)
    assert isinstance(data["averageScore"], (int, float))


def test_recent_batches_endpoint(api_client) -> None:
    """Recent batches endpoint must return list of recent exam batches."""
    response = api_client.get("/api/v1/exams/recent")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
