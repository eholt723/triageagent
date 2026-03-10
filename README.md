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

## Tech Stack

- **Frontend** — React + Vite + Tailwind CSS
- **Backend** — Python + FastAPI with SSE streaming
- **LLM** — Groq (`llama-3.3-70b-versatile`)
- **Email** — Gmail API with OAuth2
- **Deploy** — Hugging Face Spaces (Docker) + GitHub Actions CD

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
│   ├── main.py                  # FastAPI app entry point
│   ├── pipeline/                # classify.py, extract.py, draft.py
│   ├── routes/                  # triage.py (SSE), email.py (send)
│   ├── services/                # groq_client.py, gmail.py, sse.py
│   └── models/                  # Pydantic schemas
├── frontend/
│   └── src/
│       ├── App.jsx              # SSE stream consumer + state machine
│       └── components/          # InputPanel, OutputPanel, stage cards
├── tests/
│   ├── unit/                    # Mocked, no API key needed
│   └── integration/             # Live API calls, requires GROQ_API_KEY
├── Dockerfile                   # Multi-stage: Vite build + FastAPI serve
└── .github/workflows/deploy.yml # CD to Hugging Face Spaces
```

## Deployment

Deploys automatically to Hugging Face Spaces on push to `main`. Requires these GitHub secrets:

- `HF_TOKEN` — Hugging Face write token
- `GROQ_API_KEY`
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`

Update the HF Space URL in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) before first deploy.
