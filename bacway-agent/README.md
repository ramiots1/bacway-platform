# Bacway Agent (Python)

FastAPI service for the Bacway Cat chatbot. Standalone — talks to Gemini, fetches contributor data over HTTP from the main `bacway-backend`.

## What it exposes

- `GET /api/v1/agent/health` — liveness check
- `POST /api/v1/agent/chat` — chat with the cat (rate-limited 10/min per IP)

## What you need before starting

1. **Python 3.10 or newer.** Check: `python3 --version`. If you don't have it, install from https://www.python.org/downloads/ (Windows) or `brew install python` (Mac) or your distro's package manager (Linux).
2. **A Gemini API key.** Free at https://aistudio.google.com/apikey — takes 30 seconds, no credit card.
3. **The main bacway-backend** running somewhere (your existing one at https://bacway-backend1.onrender.com is fine).

## Setup from scratch

```bash
# 1. Clone or copy this folder, then enter it
cd bacway-agent

# 2. Create a virtual environment (keeps deps isolated from system Python)
python3 -m venv .venv

# 3. Activate it
#    macOS/Linux:
source .venv/bin/activate
#    Windows (PowerShell):
.venv\Scripts\Activate.ps1
#    Windows (CMD):
.venv\Scripts\activate.bat

# 4. Install dependencies
pip install -r requirements.txt

# 5. Set up env vars
cp .env.example .env
# Open .env and paste your real GEMINI_API_KEY + BACWAY_BACKEND_URL

# 6. Run the server
uvicorn app.main:app --reload --port 8000
```

You should see:

```
INFO:     Will watch for changes in these directories: [...]
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

## Test it

Open another terminal (leave the server running in the first one):

```bash
# Health check
curl http://localhost:8000/api/v1/agent/health
# → {"status":"ok","timestamp":"2026-..."}

# Send a real message
curl -X POST http://localhost:8000/api/v1/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"got any math resources?"}]}'

# Verify off-topic refusal
curl -X POST http://localhost:8000/api/v1/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"what is the weather today?"}]}'
```

If the second curl returns real folder names from your DB, the full chain works.

Also open `http://localhost:8000/docs` in your browser — FastAPI generates an interactive Swagger UI for free, so you can test endpoints visually.

## Project structure

```
bacway-agent/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, routes, CORS, errors
│   ├── config.py            # env settings (pydantic-settings)
│   ├── schemas.py           # request/response models
│   ├── prompt.py            # system prompt — EDIT THIS to tune behavior
│   ├── agent.py             # Gemini orchestration + tool loop
│   └── tools.py             # search_contributors, search_resources (HTTP-cached)
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Env vars

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | yes | https://aistudio.google.com/apikey |
| `BACWAY_BACKEND_URL` | yes | Base URL of main backend, e.g. `https://bacway-backend1.onrender.com/api/v1` |
| `CORS_ORIGINS` | yes | Comma-separated, e.g. `http://localhost:3000,https://bacway.vercel.app` |
| `PORT` | no | Defaults to 8000 (only used when deployed) |

## How it works

1. Frontend POSTs `{ messages: [...] }` to `/api/v1/agent/chat`.
2. Agent calls Gemini with the system prompt, history, and two tool declarations.
3. Gemini decides whether to call a tool — e.g. `search_resources(speciality="MATHS")`.
4. Tool calls the main backend at `GET /admin/contributions?status=ACCEPTED` (cached 60s in-memory), filters in Python.
5. Result is sent back to Gemini, which writes the final answer.
6. Up to 3 tool rounds before forcing a text reply.

## Deploying to Render

1. Push this folder to a Git repo.
2. New Web Service → connect repo.
3. **Runtime:** Python 3
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. **Env vars:** copy from `.env.example`, fill in real values.
7. **Health check path:** `/api/v1/agent/health`

Free Render instances sleep after 15 minutes idle — first request after sleep takes ~30s to wake. Upgrade to paid ($7/mo) or set up an uptime monitor to keep it warm.

## Hooking up the frontend

The `AgentWidget.tsx` I built earlier still works. In `bacway-front/.env.local`:

```dotenv
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000/api/v1/agent/chat
```

Or in production:

```dotenv
NEXT_PUBLIC_AGENT_API_URL=https://your-agent-on-render.com/api/v1/agent/chat
```

## Tuning the cat

`app/prompt.py` is the single most important file. If the cat answers off-topic questions, refuses too much, or formats weirdly — edit the prompt. With `--reload`, uvicorn picks up changes automatically; just resend a message.

## Common errors

- **`GEMINI_API_KEY` field required** → you didn't create `.env` or it's missing the key. Restart uvicorn after editing `.env`.
- **`ModuleNotFoundError: No module named 'app'`** → run from the project root, not from inside `app/`. Command should be `uvicorn app.main:app`, not `uvicorn main:app`.
- **CORS errors in browser** → add your frontend origin to `CORS_ORIGINS` in `.env` and restart.
- **`failed to fetch contributors from backend`** in logs → check `BACWAY_BACKEND_URL`. Try hitting it in your browser to confirm it's reachable.
- **Replies are empty / generic, no real folder names** → the main backend returned no `ACCEPTED` contributors, or `BACWAY_BACKEND_URL` is wrong. Curl the backend directly to verify.
