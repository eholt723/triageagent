import pytest
from unittest.mock import patch
import json

MOCK_EXTRACTION = {
    "sender_intent": "The sender wants to reset their password.",
    "main_ask": "Please help me reset my account password.",
    "action_items": ["Reset user password", "Send confirmation email"],
    "tone": "frustrated",
}


@patch("pipeline.extract.chat_completion")
def test_extract_returns_expected_fields(mock_chat):
    mock_chat.return_value = json.dumps(MOCK_EXTRACTION)
    from pipeline.extract import extract

    result = extract("I need to reset my password, I've tried everything!")
    assert "sender_intent" in result
    assert "main_ask" in result
    assert "action_items" in result
    assert "tone" in result


@patch("pipeline.extract.chat_completion")
def test_extract_action_items_is_list(mock_chat):
    mock_chat.return_value = json.dumps(MOCK_EXTRACTION)
    from pipeline.extract import extract

    result = extract("Some email")
    assert isinstance(result["action_items"], list)


@patch("pipeline.extract.chat_completion")
def test_extract_empty_action_items(mock_chat):
    no_actions = {**MOCK_EXTRACTION, "action_items": []}
    mock_chat.return_value = json.dumps(no_actions)
    from pipeline.extract import extract

    result = extract("Just a quick hello email")
    assert result["action_items"] == []
