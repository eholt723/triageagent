import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from pipeline.classify import classify
from pipeline.extract import extract
from pipeline.draft import draft_stream
from services.sse import stage_event, error_event

router = APIRouter()


class TriageRequest(BaseModel):
    email_text: str


@router.post("/triage")
async def triage(request: TriageRequest):
    async def event_stream():
        try:
            # Stage 1: Classify
            loop = asyncio.get_running_loop()
            classification = await loop.run_in_executor(None, classify, request.email_text)
            yield stage_event("classify", classification, done=True)

            # Stage 2: Extract
            extraction = await loop.run_in_executor(None, extract, request.email_text)
            yield stage_event("extract", extraction, done=True)

            # Stage 3: Draft (streaming)
            stream = await loop.run_in_executor(None, draft_stream, request.email_text, classification, extraction)
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield stage_event("draft", delta, done=False)
            yield stage_event("draft", "", done=True)

        except Exception as e:
            yield error_event(str(e))

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
