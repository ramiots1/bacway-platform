# app/tools.py
import time
import logging
from typing import Any, Optional

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

CACHE_TTL_SECONDS = 60
HTTP_TIMEOUT_SECONDS = 10

SPECIALITIES = {"MATHS", "SCIENCE", "MATH_TECH", "GESTION", "LETTRE", "LANGUES"}


class _ContributorCache:
    """Simple in-memory TTL cache for the ACCEPTED contributors list."""

    def __init__(self) -> None:
        self._data: list[dict] = []
        self._expires_at: float = 0.0

    def is_fresh(self) -> bool:
        return time.time() < self._expires_at

    def set(self, data: list[dict]) -> None:
        self._data = data
        self._expires_at = time.time() + CACHE_TTL_SECONDS

    def get(self) -> list[dict]:
        return self._data


_cache = _ContributorCache()


async def _fetch_all_accepted() -> list[dict]:
    """Fetch all ACCEPTED contributors from the main backend, with caching."""
    if _cache.is_fresh():
        return _cache.get()

    settings = get_settings()
    url = f"{settings.bacway_backend_url}/admin/contributions"
    params = {"status": "ACCEPTED", "limit": 100}

    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
            res = await client.get(url, params=params)
            res.raise_for_status()
            payload = res.json()
            data = payload.get("data", [])
            _cache.set(data)
            return data
    except Exception as e:
        logger.error("Failed to fetch contributors from backend: %s", e)
        # Serve stale cache if we have one, otherwise empty list
        return _cache.get()


# ─── Tool: search_contributors ───────────────────────────────────────────────

async def search_contributors(
    speciality: Optional[str] = None,
    min_grade: Optional[float] = None,
    limit: int = 5,
) -> list[dict]:
    """Return up to `limit` accepted contributors, optionally filtered."""
    all_rows = await _fetch_all_accepted()
    limit = max(1, min(limit, 10))

    def keep(row: dict) -> bool:
        if speciality and row.get("bacSpeciality") != speciality:
            return False
        if min_grade is not None and float(row.get("grade", 0)) < min_grade:
            return False
        return True

    filtered = [r for r in all_rows if keep(r)]
    filtered.sort(key=lambda r: float(r.get("grade", 0)), reverse=True)

    return [
        {
            "fullName": r["fullName"],
            "bacYear": r["bacYear"],
            "grade": float(r["grade"]),
            "speciality": r["bacSpeciality"],
            "contacts": [
                {"type": c["type"], "link": c["contact"]}
                for c in r.get("contacts", [])
            ],
        }
        for r in filtered[:limit]
    ]


# ─── Tool: search_resources ──────────────────────────────────────────────────

async def search_resources(
    speciality: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = 5,
) -> list[dict]:
    """Return up to `limit` resource folders, optionally filtered."""
    all_rows = await _fetch_all_accepted()
    limit = max(1, min(limit, 10))
    q = query.lower().strip() if query else None

    results: list[dict] = []
    for c in all_rows:
        if speciality and c.get("bacSpeciality") != speciality:
            continue

        for r in c.get("resources", []):
            if q:
                hay = f"{r.get('folderName', '')} {r.get('description') or ''}".lower()
                if q not in hay:
                    continue

            results.append(
                {
                    "folderName": r["folderName"],
                    "folderLink": r["folderLink"],
                    "description": r.get("description"),
                    "contributor": {
                        "name": c["fullName"],
                        "bacYear": c["bacYear"],
                        "grade": float(c["grade"]),
                        "speciality": c["bacSpeciality"],
                    },
                }
            )

            if len(results) >= limit:
                return results

    return results


# ─── Tool dispatcher ─────────────────────────────────────────────────────────

TOOL_REGISTRY = {
    "search_contributors": search_contributors,
    "search_resources": search_resources,
}


async def execute_tool(name: str, args: dict[str, Any]) -> Any:
    """Dispatch a tool call by name with the given args dict."""
    if name not in TOOL_REGISTRY:
        raise ValueError(f"Unknown tool: {name}")
    return await TOOL_REGISTRY[name](**args)
