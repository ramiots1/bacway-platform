# app/main.py
import logging
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.agent import chat as run_chat
from app.config import get_settings
from app.schemas import ChatRequest, ChatResponse, HealthResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Bacway Agent",
    description="Chat backend for the Bacway Cat",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Standard error JSON for unexpected exceptions."""
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "statusCode": 500,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "path": str(request.url.path),
            "message": "Internal server error",
        },
    )


@app.get("/api/v1/agent/health", response_model=HealthResponse, tags=["agent"])
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/api/v1/agent/chat", response_model=ChatResponse, tags=["agent"])
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, body: ChatRequest) -> ChatResponse:
    """Run one chat turn. Rate-limited to 10 req/min per IP."""
    try:
        reply = await run_chat(body.messages)
        return ChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Agent error")
        raise HTTPException(status_code=503, detail=str(e))
