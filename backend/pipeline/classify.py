import json
from services.groq_client import chat_completion

SYSTEM_PROMPT = """You are an email classification expert. Analyze the provided email and return a JSON object with exactly these fields:
- email_type: one of "support_request", "sales_inquiry", "job_application", "billing_issue", "general_inquiry", "complaint", "partnership", "other"
- urgency: one of "low", "medium", "high"
- confidence: a float from 0.0 to 1.0 representing your classification confidence
- suggested_subject: a concise reply subject line starting with "Re:"

Return only valid JSON, no other text."""


def classify(email_text: str) -> dict:
    content = chat_completion(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Classify this email:\n\n{email_text}"},
        ],
        temperature=0.1,
    )
    return json.loads(content)
