"""
apps/api/dependencies.py

FastAPI dependency injection providers.

Usage in route handlers::

    @router.post("/...")
    async def my_route(
        db: AsyncSession = Depends(get_db),
        teacher: User = Depends(require_teacher),
    ):
        ...
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import Depends, Header, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User
from db.session import get_db as _session_get_db
from packages.common.auth import decode_token

# ---------------------------------------------------------------------------
# Database session
# ---------------------------------------------------------------------------


async def get_db() -> AsyncIterator[AsyncSession]:
    """
    Yield an async SQLAlchemy session scoped to a single request.

    The session is committed on success and rolled back on any unhandled error.
    Delegates to db.session.get_db() so engine config lives in one place.
    """
    async for session in _session_get_db():
        yield session


# ---------------------------------------------------------------------------
# Authentication (signed bearer tokens issued by /api/v1/auth/login)
# ---------------------------------------------------------------------------

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated. Please sign in again.",
    headers={"WWW-Authenticate": "Bearer"},
)


async def _user_from_token(token: str | None, db: AsyncSession) -> User:
    if not token:
        raise _UNAUTHORIZED
    payload = decode_token(token)
    if not payload:
        raise _UNAUTHORIZED
    user = await db.get(User, payload.get("uid"))
    if user is None or user.role != payload.get("role"):
        raise _UNAUTHORIZED
    return user


def _bearer(authorization: str | None) -> str | None:
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    return None


async def get_current_user(
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Any signed-in user (teacher or student)."""
    return await _user_from_token(_bearer(authorization), db)


async def get_current_user_for_file(
    authorization: str | None = Header(default=None),
    token: str | None = Query(default=None, description="Login token, for <img>/<iframe> URLs"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Like get_current_user, but also accepts ?token= because <img>/<iframe> can't send headers."""
    return await _user_from_token(_bearer(authorization) or token, db)


async def require_teacher(user: User = Depends(get_current_user)) -> User:
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teacher access required.")
    return user


async def require_teacher_for_file(user: User = Depends(get_current_user_for_file)) -> User:
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teacher access required.")
    return user
