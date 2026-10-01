"""
tests/unit/test_config.py

Unit tests for packages/common/config.py
"""
from __future__ import annotations

import pytest

from packages.common.config import get_settings


@pytest.fixture(autouse=True)
def _fresh_settings():
    """Each test gets fresh settings, and the cached ones are restored afterwards."""
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_settings_defaults() -> None:
    """Settings load with sensible defaults even without a .env file."""
    settings = get_settings()
    assert settings.app_env in ("development", "production")
    assert settings.confidence_auto_approve == pytest.approx(0.85)
    assert settings.confidence_mandatory_review == pytest.approx(0.65)
    assert settings.api_port == 8000


def test_teacher_id_parsing(monkeypatch) -> None:
    """Comma-separated teacher IDs from env are parsed into a list."""
    monkeypatch.setenv("ALLOWED_TEACHER_IDS", "teacher_ravi, teacher_priya , teacher_amit")
    ids = get_settings().allowed_teacher_ids
    assert ids == ["teacher_ravi", "teacher_priya", "teacher_amit"]


def test_cors_origins_parsing(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "https://a.example, https://b.example")
    assert get_settings().cors_origins == ["https://a.example", "https://b.example"]


def test_is_development_flag(monkeypatch) -> None:
    monkeypatch.setenv("APP_ENV", "development")
    assert get_settings().is_development is True

    get_settings.cache_clear()
    monkeypatch.setenv("APP_ENV", "production")
    assert get_settings().is_development is False
