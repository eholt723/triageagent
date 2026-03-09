import json


def stage_event(stage: str, content: str, done: bool = False) -> str:
    payload = {"stage": stage, "content": content, "done": done}
    return f"data: {json.dumps(payload)}\n\n"


def error_event(message: str) -> str:
    payload = {"error": message}
    return f"data: {json.dumps(payload)}\n\n"
