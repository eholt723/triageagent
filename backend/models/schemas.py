from pydantic import BaseModel, Field


class ClassificationResult(BaseModel):
    email_type: str
    urgency: str  # low, medium, high
    confidence: float = Field(ge=0.0, le=1.0)
    suggested_subject: str


class ExtractionResult(BaseModel):
    sender_intent: str
    main_ask: str
    action_items: list[str]
    tone: str


class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body: str
