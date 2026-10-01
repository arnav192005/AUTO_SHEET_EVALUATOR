"""
packages/common/auth.py

Password hashing and signed login tokens, built on the standard library only.

Tokens look like ``<base64url(json payload)>.<base64url(hmac-sha256)>`` and carry
the user id, role and an expiry timestamp. They are verified server-side on every
request, so the browser cannot change its own role.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time
from functools import lru_cache

from packages.common.config import get_settings

_PBKDF2_ITERATIONS = 240_000


# ── Passwords ─────────────────────────────────────────────────────────────────


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${_PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = stored.split("$")
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
    )
    return hmac.compare_digest(digest.hex(), digest_hex)


# ── Tokens ────────────────────────────────────────────────────────────────────


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64decode(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


@lru_cache(maxsize=1)
def _secret() -> bytes:
    """Signing secret: AUTH_SECRET if set, else a random one persisted to disk."""
    settings = get_settings()
    if settings.auth_secret:
        return settings.auth_secret.encode("utf-8")
    path = settings.auth_secret_file
    if path.exists():
        return path.read_text(encoding="utf-8").strip().encode("utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    value = secrets.token_urlsafe(48)
    path.write_text(value, encoding="utf-8")
    return value.encode("utf-8")


def create_token(user_id: int, role: str) -> tuple[str, int]:
    """Return (token, expires_at_epoch_seconds)."""
    expires = int(time.time()) + get_settings().auth_token_ttl_hours * 3600
    payload = _b64encode(json.dumps({"uid": user_id, "role": role, "exp": expires}).encode())
    signature = _b64encode(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{signature}", expires


def decode_token(token: str) -> dict | None:
    """Return the payload for a valid, unexpired token, else None."""
    try:
        payload, signature = token.split(".")
        expected = _b64encode(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            return None
        data = json.loads(_b64decode(payload))
    except (ValueError, json.JSONDecodeError):
        return None
    if not isinstance(data, dict) or data.get("exp", 0) < time.time():
        return None
    return data
