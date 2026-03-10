import os
from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential

_client = None


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"].strip())
    return _client


MODEL = "llama-3.3-70b-versatile"


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def chat_completion(messages: list[dict], **kwargs) -> str:
    client = get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        **kwargs,
    )
    return response.choices[0].message.content


def stream_completion(messages: list[dict], **kwargs):
    client = get_client()
    return client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True,
        **kwargs,
    )
