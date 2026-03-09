"""Unit tests for the classification pipeline stage.

Tests use mocked Groq responses — no API key required.
"""
import json
from unittest.mock import patch

MOCK_CLASSIFICATION = {
    "email_type": "support_request",
    "urgency": "high",
    "confidence": 0.92,
    "suggested_subject": "Re: Issue with my account",
}


@patch("pipeline.classify.chat_completion")
def test_classify_returns_expected_fields(mock_chat):
    mock_chat.return_value = json.dumps(MOCK_CLASSIFICATION)
    from pipeline.classify import classify

    result = classify("My account is broken and I need help urgently!")
    assert result["email_type"] == "support_request"
    assert result["urgency"] == "high"
    assert "confidence" in result
    assert "suggested_subject" in result


@patch("pipeline.classify.chat_completion")
def test_classify_confidence_range(mock_chat):
    mock_chat.return_value = json.dumps(MOCK_CLASSIFICATION)
    from pipeline.classify import classify

    result = classify("Some email text")
    assert 0.0 <= result["confidence"] <= 1.0


@patch("pipeline.classify.chat_completion")
def test_classify_low_confidence(mock_chat):
    low_conf = {**MOCK_CLASSIFICATION, "confidence": 0.45}
    mock_chat.return_value = json.dumps(low_conf)
    from pipeline.classify import classify

    result = classify("Ambiguous email")
    assert result["confidence"] < 0.75
