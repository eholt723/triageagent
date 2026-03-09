"""Integration tests for the full triage pipeline.

These tests make real Groq API calls — requires GROQ_API_KEY in environment.
Run with: pytest tests/integration/ -v

Skip in CI unless GROQ_API_KEY is set.
"""
import os
import pytest

pytestmark = pytest.mark.skipif(
    not os.getenv("GROQ_API_KEY"),
    reason="GROQ_API_KEY not set — skipping integration tests",
)


def test_classify_real_support_email():
    from pipeline.classify import classify

    result = classify(
        "Hi, I can't log into my account and my subscription is being charged. "
        "This is urgent, please help immediately."
    )
    assert result["email_type"] in {
        "support_request", "billing_issue", "complaint"
    }
    assert result["urgency"] in {"low", "medium", "high"}
    assert 0.0 <= result["confidence"] <= 1.0
    assert result["suggested_subject"].startswith("Re:")


def test_extract_real_email():
    from pipeline.extract import extract

    result = extract(
        "Hello, I'm interested in your enterprise plan. "
        "Could you send pricing and schedule a demo for next week?"
    )
    assert result["sender_intent"]
    assert result["main_ask"]
    assert isinstance(result["action_items"], list)
    assert result["tone"] in {
        "professional", "urgent", "friendly", "frustrated", "neutral", "confused"
    }


def test_full_pipeline_classify_then_extract():
    from pipeline.classify import classify
    from pipeline.extract import extract

    email = (
        "Dear support team,\n\n"
        "I've been billed twice this month for my subscription. "
        "Please refund the duplicate charge as soon as possible.\n\n"
        "Thanks, Jane"
    )
    classification = classify(email)
    extraction = extract(email)

    assert classification["email_type"]
    assert extraction["main_ask"]
    # billing issue should be flagged medium or high urgency
    assert classification["urgency"] in {"medium", "high"}
