"""
tests/unit/test_health.py

Smoke tests for the /health endpoint.
"""
from __future__ import annotations


def test_health_returns_ok(api_client) -> None:  # type: ignore[no-untyped-def]
    for path in ("/health", "/api/v1/health"):
        response = api_client.get(path)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "environment" in data
        assert "version" in data


def test_health_has_process_time_and_security_headers(api_client) -> None:  # type: ignore[no-untyped-def]
    response = api_client.get("/health")
    assert "x-process-time-ms" in response.headers
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "SAMEORIGIN"


def test_teachers_endpoint_requires_teacher(api_client, teacher_headers) -> None:  # type: ignore[no-untyped-def]
    assert api_client.get("/api/v1/teachers").status_code == 401
    response = api_client.get("/api/v1/teachers", headers=teacher_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
