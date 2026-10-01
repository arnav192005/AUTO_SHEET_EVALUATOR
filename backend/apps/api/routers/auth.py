from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.dependencies import get_current_user, get_db
from db.models import User
from packages.common.auth import create_token, hash_password, verify_password
from packages.common.config import get_settings
from packages.common.logging import get_logger

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])
logger = get_logger(__name__)

# Used when no account matches, so response time doesn't reveal which emails exist.
_DUMMY_HASH = hash_password("dummy-password-for-timing")


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=200)
    password: str = Field(..., min_length=1, max_length=200)
    role: str | None = Field(None, description="Optional: 'teacher' or 'student' tab the user chose")


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=3, max_length=200)
    password: str = Field(..., min_length=6, max_length=200)
    roll_number: str = Field(..., min_length=1, max_length=50)

    @field_validator("name", "email", "roll_number")
    @classmethod
    def strip_and_require(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be blank")
        return v

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: str) -> str:
        local, _, domain = v.partition("@")
        if not local or "." not in domain:
            raise ValueError("must be a valid email address")
        return v.lower()


def _user_out(user: User, token: str, expires: int) -> dict:
    return {
        "token": token,
        "expires": expires * 1000,  # ms, matches Date.now() in the browser
        "role": user.role,
        "name": user.name,
        "email": user.email,
        "rollNumber": user.roll_number,
    }


@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    email = req.email.strip().lower()
    user = (await db.execute(select(User).where(func.lower(User.email) == email))).scalar_one_or_none()
    if user is None:
        verify_password(req.password, _DUMMY_HASH)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")
    if req.role and req.role != user.role:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, f"This account is not a {req.role} account."
        )
    token, expires = create_token(user.id, user.role)
    return _user_out(user, token, expires)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Self-registration is for students only. Teacher accounts are created by the server admin."""
    existing = (await db.execute(select(User).where(func.lower(User.email) == req.email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists.")
    roll_taken = (
        await db.execute(select(User).where(User.roll_number == req.roll_number))
    ).scalar_one_or_none()
    if roll_taken:
        raise HTTPException(status.HTTP_409_CONFLICT, "This roll number is already registered.")

    user = User(
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password),
        role="student",
        roll_number=req.roll_number,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token, expires = create_token(user.id, user.role)
    return _user_out(user, token, expires)


@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return {"role": user.role, "name": user.name, "email": user.email, "rollNumber": user.roll_number}


async def ensure_bootstrap_teacher() -> None:
    """Create the teacher account from TEACHER_EMAIL / TEACHER_PASSWORD if it doesn't exist."""
    from db.session import AsyncSessionLocal

    settings = get_settings()
    email, password = settings.teacher_email, settings.teacher_password
    if not (email and password):
        if not settings.is_development:
            logger.warning("no_teacher_account_configured", hint="set TEACHER_EMAIL and TEACHER_PASSWORD")
            return
        email, password = "teacher@scribscore.com", "teacher123"
        logger.warning(
            "using_demo_teacher_account",
            email=email,
            hint="development only; set TEACHER_EMAIL and TEACHER_PASSWORD to change it",
        )

    async with AsyncSessionLocal() as db:
        found = (
            await db.execute(select(User).where(func.lower(User.email) == email.lower()))
        ).scalar_one_or_none()
        if found is None:
            db.add(User(
                email=email.lower(),
                name=settings.teacher_name,
                password_hash=hash_password(password),
                role="teacher",
            ))
            await db.commit()
