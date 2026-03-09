import json
from services.groq_client import chat_completion

SYSTEM_PROMPT = """You are an expert at extracting key information from emails. Analyze the provided email and return a JSON object with exactly these fields:
- sender_intent: a single sentence describing what the sender wants to achieve
- main_ask: the primary request or question from the sender
- action_items: a list of strings, each describing a concrete action the recipient should take (empty list if none)
- tone: one of "professional", "urgent", "friendly", "frustrated", "neutral", "confused"

Return only valid JSON, no other text."""


def extract(email_text: str) -> dict:
    content = chat_completion(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract key details from this email:\n\n{email_text}"},
        ],
        temperature=0.1,
    )
    return json.loads(content)
