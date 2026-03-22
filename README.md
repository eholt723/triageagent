---
title: TriageAgent
emoji: 📬
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# TriageAgent

[![CI](https://github.com/eholt723/triageagent/actions/workflows/ci.yml/badge.svg)](https://github.com/eholt723/triageagent/actions/workflows/ci.yml)

AI-powered email triage and draft responder. Paste an email — a three-stage agentic pipeline classifies it, extracts key details, and drafts a professional reply. Each stage streams word-by-word to the browser in real time. The drafted reply is editable and can be approved and sent as a real email via Gmail.

## Pipeline

```
Email input → [Classify] → [Extract] → [Draft] → Human review → Send
```

| Stage | What it does | Output |
|---|---|---|
| Classify | Identifies email type, urgency (low/medium/high), confidence score | Structured JSON |
| Extract | Pulls out sender intent, main ask, action items, tone | Structured JSON |
| Draft | Writes a professional reply tailored to the above | Streamed text |

If confidence is below 0.75, the UI flags the result as uncertain and prompts careful review before sending.

## Architecture

```
     Email Input
          │
          ▼
  ┌───────────────┐      type · urgency · confidence (JSON)
  │   Classify    │ ────────────────────────────────────────▶ Browser
  └───────────────┘
          │
          ▼
  ┌───────────────┐      intent · action items · tone (JSON)
  │    Extract    │ ────────────────────────────────────────▶ Browser
  └───────────────┘
          │
          ▼
  ┌───────────────┐      professional reply (streamed text)
  │     Draft     │ ────────────────────────────────────────▶ Browser
  └───────────────┘
                                                                  │
                                                            Human review
                                                                  │
                                                                  ▼
                                                       ┌────────────────────┐
                                                       │   POST /api/send   │ ──▶ Gmail API
                                                       └────────────────────┘
```

| Layer | Responsibility |
|---|---|
| `POST /api/triage` | Runs all three pipeline stages sequentially; each yields SSE events as it completes |
| `classify.py` | Non-streaming Groq call; returns structured JSON: type, urgency, confidence |
| `extract.py` | Non-streaming Groq call; returns structured JSON: intent, main ask, action items, tone |
| `draft.py` | Streaming Groq call; yields text chunks word-by-word to the browser |
| Frontend SSE consumer | Reads the event stream, routes each event to the correct stage card by `stage` field |
| `POST /api/send` | Substitutes `[Your Name]`, sends the final reply via Gmail OAuth2 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | FastAPI, Python 3.11 |
| LLM | Groq — `llama-3.3-70b-versatile` |
| Validation | Pydantic v2 |
| Real-time | Server-Sent Events (SSE) via `sse-starlette` |
| Email | Gmail API, OAuth2 (`google-api-python-client`) |
| Retry | Tenacity |
| Hosting | Hugging Face Spaces (Docker) + GitHub Actions CD |

## Local Development

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example .env   # fill in your keys
cd backend && uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend proxies `/api` requests to `http://localhost:8000` during dev.

## Testing

```bash
# Unit tests (no API key needed — all mocked)
pytest tests/unit/ -v

# Integration tests (requires GROQ_API_KEY in .env)
pytest tests/integration/ -v
```

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key |
| `GMAIL_CLIENT_ID` | Gmail OAuth2 client ID |
| `GMAIL_CLIENT_SECRET` | Gmail OAuth2 client secret |
| `GMAIL_REFRESH_TOKEN` | Gmail OAuth2 refresh token |
| `GMAIL_SENDER` | Sender address (e.g. `triageagent.demo@gmail.com`) |

## Project Structure

```
triageagent/
├── backend/
│   ├── main.py                        # FastAPI app, explicit favicon route, SPA catch-all
│   ├── pipeline/
│   │   ├── classify.py                # Stage 1: email type, urgency, confidence (structured JSON)
│   │   ├── extract.py                 # Stage 2: intent, main ask, action items, tone (structured JSON)
│   │   └── draft.py                   # Stage 3: professional reply (streaming text)
│   ├── routes/
│   │   ├── triage.py                  # POST /api/triage — SSE endpoint, runs all three stages
│   │   └── email.py                   # POST /api/send — sends drafted reply via Gmail
│   ├── services/
│   │   ├── groq_client.py             # Groq singleton, .strip() on API key, Tenacity retries
│   │   ├── gmail.py                   # OAuth2 Gmail send using refresh token
│   │   └── sse.py                     # SSE event formatting helpers
│   └── models/
│       └── schemas.py                 # Pydantic v2 request/response models
├── frontend/
│   └── src/
│       ├── App.jsx                    # SSE stream consumer, routing, dark mode state
│       ├── main.jsx                   # React entry point
│       └── components/
│           ├── InputPanel.jsx         # Email textarea, sample email buttons, Reset button
│           ├── OutputPanel.jsx        # Renders all three stage cards in order
│           ├── ClassificationCard.jsx # Collapsible card: type, urgency, confidence
│           ├── ExtractedDetailsCard.jsx # Collapsible card: intent, action items, tone
│           ├── DraftedReplyCard.jsx   # Editable textarea, Approve & Send modal
│           └── AboutPage.jsx          # /about route: pipeline, stack, highlights
├── tests/
│   ├── unit/                          # Mocked Groq calls, no API key needed (6 tests)
│   │   ├── test_classify.py
│   │   └── test_extract.py
│   ├── integration/                   # Live Groq calls, requires GROQ_API_KEY
│   │   └── test_pipeline_integration.py
│   └── conftest.py                    # pytest fixtures
├── Dockerfile                         # Multi-stage: node:20-alpine Vite build → python:3.11-slim serve
├── pyproject.toml                     # pytest config: testpaths, pythonpath, dotenv
└── .github/workflows/
    ├── ci.yml                         # Unit tests on push/PR to main (no secrets needed)
    └── deploy.yml                     # Force-push to HF Space on push to main
```

## Design Decisions

- **Non-streaming calls for classify and extract, streaming only for draft.** The alternative was to stream all three stages. Classify and extract return structured JSON, which must be fully received and parsed before the next stage can run — streaming the response would require buffering the entire thing anyway and adds no UX benefit. Streaming is reserved for draft, where word-by-word output is genuinely useful for a 60-second demo.

- **FastAPI serves the compiled React build as static files.** The alternative was a separate static file server (nginx, CDN). Hugging Face Spaces exposes a single container on a single port. Serving the Vite build from FastAPI via `StaticFiles` keeps the deployment to one process with no sidecar, which is the only viable option on the free tier.

- **`X-Accel-Buffering: no` header on all SSE responses.** Hugging Face Spaces runs nginx as a reverse proxy that buffers upstream responses by default. Without this header, SSE events accumulate in the nginx buffer and arrive in bursts rather than word-by-word, which breaks the streaming UX entirely. This header is invisible in local dev but required in production.

## Future Improvements

- **Per-user OAuth2 flows** — currently all outbound email sends through a single shared Gmail account. Production would need each user to authorize their own account.
- **Email thread context** — each triage run is stateless. A production system would pass the full reply thread into the prompt so the draft accounts for prior conversation history.
- **Direct inbox integration** — users currently paste email text manually. A webhook or polling integration with Gmail/Outlook would remove that friction entirely.
- **Rate limiting** — the `/api/triage` endpoint has no per-IP limits. Required before handling real user traffic at scale.
- **Persistent session storage** — triage results are ephemeral. A production system would store drafts and classification history for audit trails and analytics.

## Deployment

Deploys automatically to Hugging Face Spaces on push to `main`. Requires these GitHub secrets:

- `HF_TOKEN` — Hugging Face write token
- `GROQ_API_KEY`
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`

Update the HF Space URL in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) before first deploy.
