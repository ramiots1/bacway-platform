# app/agent.py
import json
import logging
import re
from typing import List

from groq import AsyncGroq

from app.config import get_settings
from app.prompt import SYSTEM_PROMPT
from app.schemas import ChatMessage
from app.tools import execute_tool

logger = logging.getLogger(__name__)

# OpenAI's open-weight GPT-OSS 120B — currently Groq's most intelligent
# production model, with the best tool-calling reliability and strong
# multilingual support (Arabic, French, English all solid).
#
# Alternatives if you ever need to swap:
#   - "llama-3.3-70b-versatile"     — Meta Llama, fast, decent tools
#   - "openai/gpt-oss-20b"          — smaller GPT-OSS, much faster
#   - "qwen/qwen3-32b"              — best Arabic comprehension, slower
MODEL_NAME = "openai/gpt-oss-120b"
MAX_TOOL_ROUNDS = 3

# Tool schemas in OpenAI/Groq format
_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_contributors",
            "description": (
                "Search Bacway contributors (top BAC alumni). Use when the user "
                "asks about people, mentors, or contacts, especially for a "
                "specific speciality, or when a name is mentioned."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "speciality": {
                        "type": "string",
                        "enum": [
                            "MATHS", "SCIENCE", "MATH_TECH",
                            "GESTION", "LETTRE", "LANGUES",
                        ],
                        "description": "Filter by BAC speciality.",
                    },
                    "min_grade": {
                        "type": "number",
                        "description": "Minimum BAC grade (0-20).",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max results (default 5, capped at 10).",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_resources",
            "description": (
                "Search Bacway resource folders (study materials, summaries, "
                "drives). Use when the user asks about materials, notes, or "
                "content for a subject."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "speciality": {
                        "type": "string",
                        "enum": [
                            "MATHS", "SCIENCE", "MATH_TECH",
                            "GESTION", "LETTRE", "LANGUES",
                        ],
                        "description": "Filter by BAC speciality of the contributor.",
                    },
                    "query": {
                        "type": "string",
                        "description": "Free-text search over folder name and description.",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max results (default 5, capped at 10).",
                    },
                },
            },
        },
    },
]


# ─── Leaked-tool-call stripper ────────────────────────────────────────────────
# Some models occasionally emit fake tool-call syntax as plain text instead of
# the real tool-calling mechanism. We strip those patterns so the user never
# sees raw <function=...> markup, no matter what the model does.

_LEAK_PATTERNS = [
    re.compile(r"<function\s*=\s*\w+\s*>.*?</function>", re.DOTALL | re.IGNORECASE),
    re.compile(r"<tool[^>]*>.*?</tool>", re.DOTALL | re.IGNORECASE),
    re.compile(r"<tool_call[^>]*>.*?</tool_call>", re.DOTALL | re.IGNORECASE),
    re.compile(r"```(?:json|tool|function).*?```", re.DOTALL),
]


def _strip_leaked_tool_calls(text: str) -> str:
    """Remove any inline tool-call syntax the model leaked into its reply."""
    for pattern in _LEAK_PATTERNS:
        text = pattern.sub("", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


# ─── Groq client ──────────────────────────────────────────────────────────────

_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    """Lazy singleton — created on first use so env vars are loaded by then."""
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=get_settings().groq_api_key)
    return _client


def _to_groq_messages(history: List[ChatMessage]) -> list[dict]:
    """Convert our {role, content} → Groq's OpenAI-style messages."""
    return [{"role": m.role, "content": m.content} for m in history]


# ─── Main chat function ──────────────────────────────────────────────────────

async def chat(history: List[ChatMessage]) -> str:
    """Run one chat turn with tool-calling. Returns the model's final reply."""
    client = _get_client()

    messages: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(_to_groq_messages(history))

    for _ in range(MAX_TOOL_ROUNDS + 1):
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            tools=_TOOLS,
            tool_choice="auto",
            temperature=0.5,
            max_tokens=800,
        )

        msg = response.choices[0].message

        # Done if no tool calls
        if not msg.tool_calls:
            text = _strip_leaked_tool_calls(msg.content or "")
            if not text:
                raise RuntimeError("Empty response from agent")
            return text

        # Append the assistant's tool-call turn
        messages.append(
            {
                "role": "assistant",
                "content": msg.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        },
                    }
                    for tc in msg.tool_calls
                ],
            }
        )

        # Execute each tool and append the results
        for tc in msg.tool_calls:
            try:
                args = json.loads(tc.function.arguments or "{}")
                result = await execute_tool(tc.function.name, args)
                content = json.dumps({"result": result})
            except Exception as e:
                logger.exception("Tool %s failed", tc.function.name)
                content = json.dumps({"error": str(e)})

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "name": tc.function.name,
                    "content": content,
                }
            )

    raise RuntimeError("Agent exceeded maximum tool-call rounds")