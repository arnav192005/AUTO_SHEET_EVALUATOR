"""
scripts/seed_db.py

Populate the development database with realistic fixture data.

Run with:
    uv run python scripts/seed_db.py

Idempotent: checks whether seed data already exists before inserting,
so it's safe to run multiple times.
"""
from __future__ import annotations

import asyncio
import os
import sys

# Ensure repo root is on sys.path when run directly
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import AsyncSessionLocal, create_all_tables
from db.models import (
    AnswerKey,
    AnswerSheet,
    EvaluationResult,
    Exam,
    ExtractedAnswer,
    Question,
    Student,
)
from packages.common.enums import AnswerKeyStatus, ConfidenceBand, ExamStatus, ReviewStatus, SheetStatus


# ---------------------------------------------------------------------------
# Fixture definitions
# ---------------------------------------------------------------------------

EXAM_TITLE = "CS301 Mid-Term 2024"

QUESTIONS = [
    {
        "question_number": 1,
        "question_text": "Explain the difference between BFS and DFS graph traversal algorithms.",
        "expected_answer": "BFS uses a Queue (FIFO) and explores graph level-by-level, finding shortest paths in unweighted graphs. DFS uses a Stack (LIFO) or recursion and explores paths as deep as possible before backtracking.",
        "max_marks": 10.0,
        "rubric_hints": "Award marks for: correct definitions (2), differences in data structure used (2), time/space complexity comparison (3), use-case examples (3).",
    },
    {
        "question_number": 2,
        "question_text": "What is the time complexity of merge sort? Justify your answer.",
        "expected_answer": "Merge sort has O(n log n) time complexity in all cases. The array is divided log n times and merging n elements takes O(n) work at each level.",
        "max_marks": 5.0,
        "rubric_hints": "O(n log n) (2 marks), divide step explanation (1.5), merge step explanation (1.5).",
    },
    {
        "question_number": 3,
        "question_text": "Define a binary search tree (BST) and describe the search operation.",
        "expected_answer": "A BST is a binary tree where left child < root < right child. Search recursively compares target with current node, moving left if target is smaller or right if target is larger.",
        "max_marks": 5.0,
        "rubric_hints": "BST property definition (2), search algorithm in words or pseudocode (2), complexity O(h) or O(log n) average (1).",
    },
]

STUDENTS = [
    {"roll_number": "2021CS001", "name": "Priya Sharma", "email": "priya@example.edu"},
    {"roll_number": "2021CS002", "name": "Ravi Kumar", "email": "ravi@example.edu"},
    {"roll_number": "2021CS003", "name": "Anika Patel", "email": "anika@example.edu"},
]

SHEETS = [
    {
        "student_roll": "2021CS001",
        "original_filename": "roll_2021CS001_midterm.jpg",
        "page_count": 2,
        "status": SheetStatus.EVALUATED,
        "student_answer": "BFS uses a queue and explores nodes level by level. DFS uses a stack or recursion to explore paths deeply. Time complexity for both is O(V + E).",
        "score": 9.5,
        "max_score": 10.0,
        "reasoning": "Excellent explanation of data structures (Queue vs Stack) and correct time complexity O(V+E).",
        "review_status": ReviewStatus.AUTO_APPROVED,
        "confidence": 0.95,
    },
    {
        "student_roll": "2021CS002",
        "original_filename": "roll_2021CS002_midterm.pdf",
        "page_count": 3,
        "status": SheetStatus.EVALUATED,
        "student_answer": "Merge sort divides array into two halves, recursively sorts them, and merges them. Time complexity is O(n log n) because splitting takes log n levels.",
        "score": 4.5,
        "max_score": 5.0,
        "reasoning": "Correct time complexity O(n log n) and divide-and-conquer steps outlined cleanly.",
        "review_status": ReviewStatus.AUTO_APPROVED,
        "confidence": 0.90,
    },
    {
        "student_roll": "2021CS003",
        "original_filename": "roll_2021CS003_midterm.jpg",
        "page_count": 2,
        "status": SheetStatus.EVALUATED,
        "student_answer": "A BST is a tree where left node is smaller than right node. Search operation moves left or right depending on target value.",
        "score": 3.0,
        "max_score": 5.0,
        "reasoning": "Mentions BST sorting property partially but omits recursion details and time complexity analysis.",
        "review_status": ReviewStatus.NEEDS_REVIEW,
        "confidence": 0.72,
    },
]


# ---------------------------------------------------------------------------
# Seed functions
# ---------------------------------------------------------------------------


async def seed(session: AsyncSession) -> None:
    # ── 1. Exam ───────────────────────────────────────────────────────────────
    existing_exam = (
        await session.execute(select(Exam).where(Exam.title == EXAM_TITLE))
    ).scalar_one_or_none()

    if existing_exam:
        print(f"  [skip] Exam '{EXAM_TITLE}' already exists (id={existing_exam.id})")
        exam = existing_exam
    else:
        exam = Exam(
            title=EXAM_TITLE,
            course_code="CS301",
            status=ExamStatus.ACCEPTING_UPLOADS,
        )
        session.add(exam)
        await session.flush()  # get exam.id
        print(f"  [create] Exam '{exam.title}' -> id={exam.id}")

    # ── 2. Questions ──────────────────────────────────────────────────────────
    existing_q_count = (
        await session.execute(
            select(Question).where(Question.exam_id == exam.id)
        )
    ).scalars().all()

    if existing_q_count:
        print(f"  [skip] {len(existing_q_count)} questions already exist for exam {exam.id}")
    else:
        for q_data in QUESTIONS:
            q = Question(exam_id=exam.id, **q_data)
            session.add(q)
        await session.flush()
        print(f"  [create] {len(QUESTIONS)} questions for exam {exam.id}")

    # ── 3. Answer Key stub ────────────────────────────────────────────────────
    existing_ak = (
        await session.execute(select(AnswerKey).where(AnswerKey.exam_id == exam.id))
    ).scalar_one_or_none()

    if existing_ak:
        print(f"  [skip] AnswerKey already exists for exam {exam.id}")
    else:
        ak = AnswerKey(
            exam_id=exam.id,
            status=AnswerKeyStatus.UPLOADED,
            version=1,
            file_path="./data/uploads/answer_key_cs301_midterm.pdf",
        )
        session.add(ak)
        await session.flush()
        print(f"  [create] AnswerKey (stub) -> id={ak.id}")

    # ── 4. Students ───────────────────────────────────────────────────────────
    student_map: dict[str, Student] = {}
    for s_data in STUDENTS:
        existing_s = (
            await session.execute(
                select(Student).where(Student.roll_number == s_data["roll_number"])
            )
        ).scalar_one_or_none()
        if existing_s:
            print(f"  [skip] Student '{s_data['roll_number']}' already exists")
            student_map[s_data["roll_number"]] = existing_s
        else:
            s = Student(**s_data)
            session.add(s)
            await session.flush()
            student_map[s_data["roll_number"]] = s
            print(f"  [create] Student '{s.roll_number}' -> id={s.id}")

    # ── 5. Answer Sheets & Evaluations ────────────────────────────────────────
    for sheet_data in SHEETS:
        existing_sheet = (
            await session.execute(
                select(AnswerSheet).where(
                    AnswerSheet.exam_id == exam.id,
                    AnswerSheet.student_roll == sheet_data["student_roll"],
                )
            )
        ).scalar_one_or_none()

        if existing_sheet:
            print(f"  [skip] AnswerSheet for '{sheet_data['student_roll']}' already exists")
        else:
            roll = sheet_data["student_roll"]
            sheet = AnswerSheet(
                exam_id=exam.id,
                student_id=student_map[roll].id,
                student_roll=roll,
                original_filename=sheet_data["original_filename"],
                page_count=sheet_data["page_count"],
                status=sheet_data["status"],
            )
            session.add(sheet)
            await session.flush()

            extracted = ExtractedAnswer(
                answer_sheet_id=sheet.id,
                question_number=1,
                raw_text=sheet_data["student_answer"],
                confidence=sheet_data["confidence"],
            )
            session.add(extracted)
            await session.flush()

            eval_res = EvaluationResult(
                extracted_answer_id=extracted.id,
                score=sheet_data["score"],
                max_score=sheet_data["max_score"],
                reasoning=sheet_data["reasoning"],
                confidence=sheet_data["confidence"],
                confidence_band=ConfidenceBand.HIGH if sheet_data["confidence"] > 0.85 else ConfidenceBand.MEDIUM,
                review_status=sheet_data["review_status"],
            )
            session.add(eval_res)
            print(
                f"  [create] AnswerSheet '{sheet_data['original_filename']}' -> id={sheet.id}"
            )

    await session.commit()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


async def main() -> None:
    print("[seed] Seeding development database ...")
    # Ensure tables exist (safe no-op if already created by Alembic)
    await create_all_tables()

    async with AsyncSessionLocal() as session:
        await seed(session)

    print("[seed] Done. Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())

