import os
import json
from google import genai
from google.genai import types

def evaluate_answer_sheet(image_bytes: bytes, mime_type: str = "image/jpeg"):
    prompt = """
    You are an expert AI evaluator for handwritten exams.
    Please examine the provided image of a student's answer sheet.
    Extract the handwritten text, determine the expected correct answer, provide a detailed rationale, 
    and give a score out of 10. Also provide an AI confidence score (0-100).
    
    Return EXACTLY a JSON object with these keys:
    - studentAnswer (string): The extracted text from the image.
    - expectedAnswer (string): What the correct answer should be for this question.
    - llmRationale (string): Why the student got this score.
    - score (float): The score out of 10.
    - aiConfidence (int): Confidence level from 0 to 100.
    """
    
    try:
        from packages.common.config import get_settings
        settings = get_settings()
        # Initialize client inside try block to catch missing API key errors
        client = genai.Client(api_key=settings.gemini_api_key)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Error evaluating image: {e}")
        return {
            "studentAnswer": "OCR Extraction Failed.",
            "expectedAnswer": "N/A",
            "llmRationale": f"An error occurred while evaluating the image: {str(e)}",
            "score": 0.0,
            "aiConfidence": 0
        }
