# app/schemas.py
from typing import List, Literal
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_length=1, max_length=40)


class ChatResponse(BaseModel):
    reply: str


class HealthResponse(BaseModel):
    status: str
    timestamp: str
