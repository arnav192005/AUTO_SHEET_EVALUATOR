import json

from google import genai
from google.genai import types

from packages.common.logging import get_logger

logger = get_logger(__name__)

_PLACEHOLDER_PREFIXES = ("your", "YOUR", "<", "changeme")


def gemini_key_configured() -> bool:
    """True only for a real-looking key (not empty and not a .env.example placeholder)."""
    from packages.common.config import get_settings

    key = (get_settings().gemini_api_key or "").strip()
    return bool(key) and not key.startswith(_PLACEHOLDER_PREFIXES)


def evaluate_answer_sheet(
    files_data: list[dict], 
    question_text: str | None = None,
    expected_answer: str | None = None,
    max_marks: float = 10.0,
    reference_context: str | None = None
) -> dict:
    """
    Evaluates a student's answer sheet image(s) or PDF(s) using Gemini AI (or fallback logic).
    Uses teacher's defined question and ground truth expected answer if available.
    files_data should be a list of dictionaries with 'bytes' and 'mime_type' keys.
    """
    question_context = f"\nQuestion: {question_text}" if question_text else ""
    rubric_context = f"\nGround Truth Expected Answer (DO NOT INVENT UNRELATED ANSWER): {expected_answer}" if expected_answer else ""
    ref_context = f"\n\n<Textbook Reference Context>\n{reference_context}\n</Textbook Reference Context>\nUse this context to award partial credit for equivalent methods or wording." if reference_context else ""

    prompt = f"""
    You are an expert AI evaluator for handwritten exam answer sheets.
    Examine the provided image(s) or document(s) of a student's answer sheet.{question_context}{rubric_context}{ref_context}
    Maximum score for this question: {max_marks}.

    Task:
    1. Extract all readable student handwritten text.
    2. Use the provided Ground Truth Expected Answer if present; otherwise deduce the correct answer.
    3. Evaluate the student's solution step-by-step and calculate a score out of {max_marks}.
    4. Provide clear reasoning and list any missing concepts or mistakes.
    5. Rate your overall AI confidence score from 0 to 100.

    Return EXACTLY a JSON object with these keys:
    - studentAnswer (string): Extracted student text.
    - expectedAnswer (string): Ground truth correct answer.
    - llmRationale (string): Detailed explanation of the awarded score.
    - reasoning (string): Summary of evaluation reasoning.
    - score (float): Awarded score out of {max_marks}.
    - maxScore (float): Maximum score ({max_marks}).
    - aiConfidence (int): Confidence score between 0 and 100.
    - missingConcepts (array of strings): Key missing points or mistakes.
    - reviewStatus (string): "AUTO_APPROVED" if aiConfidence >= 85 else "NEEDS_REVIEW".
    """

    from packages.common.config import get_settings
    settings = get_settings()

    try:
        api_key = settings.gemini_api_key

        if not gemini_key_configured():
            raise ValueError("Gemini API key is not configured (set GEMINI_API_KEY).")

        client = genai.Client(api_key=api_key)

        parts = [types.Part.from_bytes(data=f["bytes"], mime_type=f["mime_type"]) for f in files_data]

        models_to_try = [
            "gemini-3.5-flash-lite",
            "gemini-3.6-flash",
            "gemini-flash-latest",
            "gemini-2.5-flash",
        ]

        response = None
        last_model_err = None
        for candidate_model in models_to_try:
            try:
                response = client.models.generate_content(
                    model=candidate_model,
                    contents=[*parts, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                    )
                )
                if response and response.text:
                    break
            except Exception as model_err:
                logger.warning("gemini_model_failed", model=candidate_model, error=str(model_err)[:300])
                last_model_err = model_err
                # A bad key fails the same way on every model; don't burn more calls.
                if "API_KEY_INVALID" in str(model_err) or "PERMISSION_DENIED" in str(model_err):
                    break

        if not response or not response.text:
            if last_model_err:
                raise last_model_err
            raise ValueError("No response received from any Gemini model.")

        response_text = response.text or "{}"
        data = json.loads(response_text)
        # Gemini sometimes wraps the object in a list.
        if isinstance(data, list):
            data = next((d for d in data if isinstance(d, dict)), None)
        if not isinstance(data, dict) or "score" not in data:
            raise ValueError("Gemini returned an unexpected response format.")
        data["score"] = min(max(float(data["score"]), 0.0), float(max_marks))

        # Fill defaults for schema consistency
        data.setdefault("expectedAnswer", expected_answer or "Expected answer based on standard rubric.")
        data.setdefault("maxScore", max_marks)
        data.setdefault("reasoning", data.get("llmRationale", "Evaluation complete."))
        data.setdefault("missingConcepts", [])
        data.setdefault("reviewStatus", "NEEDS_REVIEW")
        return data

    except Exception as e:
        # Never invent a grade. Failures propagate so the job is marked FAILED
        # and the sheet goes to a teacher instead of receiving full marks.
        logger.error("gemini_evaluation_failed", error=str(e)[:300])
        raise
