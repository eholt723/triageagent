from services.groq_client import stream_completion

SYSTEM_PROMPT = """You are a professional email assistant. Write a clear, helpful, and appropriately toned reply to the email below.
Use the provided classification and extracted details to tailor your response.
Be concise but thorough. Do not include a subject line — just the body of the reply."""


def draft_stream(email_text: str, classification: dict, extraction: dict):
    context = f"""Original email:
{email_text}

Classification:
- Type: {classification.get('email_type')}
- Urgency: {classification.get('urgency')}

Key details:
- Sender intent: {extraction.get('sender_intent')}
- Main ask: {extraction.get('main_ask')}
- Tone: {extraction.get('tone')}
- Action items: {', '.join(extraction.get('action_items', []))}

Write a professional reply:"""

    return stream_completion(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": context},
        ],
        temperature=0.7,
    )
