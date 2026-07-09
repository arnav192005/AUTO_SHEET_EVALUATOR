import asyncio
from datetime import datetime
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.session import create_all_tables, AsyncSessionLocal
from db.models import Exam, Student, AnswerSheet, EvaluationResult, ExtractedAnswer
from packages.common.enums import ExamStatus, SheetStatus, ReviewStatus, ConfidenceBand

async def seed_db():
    print("Creating tables...")
    await create_all_tables()
    
    print("Seeding data...")
    async with AsyncSessionLocal() as session:
        # Create an Exam
        exam1 = Exam(
            title="Computer Science 101",
            course_code="CS101",
            status=ExamStatus.PROCESSING
        )
        exam2 = Exam(
            title="Advanced Mathematics",
            course_code="MATH201",
            status=ExamStatus.GRADED
        )
        session.add_all([exam1, exam2])
        await session.commit()

        # Create a Student
        student1 = Student(roll_number="2021CS001", name="Arnav")
        session.add(student1)
        await session.commit()

        # Create Answer Sheets
        sheet1 = AnswerSheet(
            exam_id=exam1.id,
            student_id=student1.id,
            student_roll=student1.roll_number,
            original_filename="cs101_arnav.pdf",
            status=SheetStatus.EVALUATED,
            page_count=3
        )
        sheet2 = AnswerSheet(
            exam_id=exam2.id,
            student_id=student1.id,
            student_roll=student1.roll_number,
            original_filename="math201_arnav.pdf",
            status=SheetStatus.EVALUATED,
            page_count=5
        )
        session.add_all([sheet1, sheet2])
        await session.commit()
        
        # Create ExtractedAnswer and EvaluationResult to simulate scores
        ans1 = ExtractedAnswer(answer_sheet_id=sheet1.id, question_number=1, raw_text="...", confidence=0.9)
        ans2 = ExtractedAnswer(answer_sheet_id=sheet2.id, question_number=1, raw_text="...", confidence=0.85)
        session.add_all([ans1, ans2])
        await session.commit()
        
        eval1 = EvaluationResult(
            extracted_answer_id=ans1.id,
            score=92.0, max_score=100.0,
            reasoning="Excellent answer.",
            confidence=0.95, confidence_band=ConfidenceBand.HIGH,
            review_status=ReviewStatus.AUTO_APPROVED,
            answer_key_version=1
        )
        eval2 = EvaluationResult(
            extracted_answer_id=ans2.id,
            score=85.0, max_score=100.0,
            reasoning="Good, but some steps missing.",
            confidence=0.88, confidence_band=ConfidenceBand.MEDIUM,
            review_status=ReviewStatus.REVIEWED,
            answer_key_version=1
        )
        session.add_all([eval1, eval2])
        await session.commit()

    print("Seed complete.")

if __name__ == "__main__":
    asyncio.run(seed_db())
