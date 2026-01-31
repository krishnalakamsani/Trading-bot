from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Optional

IST_OFFSET = timedelta(hours=5, minutes=30)


def now_ist_iso() -> str:
    """Return current IST timestamp as ISO string with +05:30 offset."""
    utc_now = datetime.now(timezone.utc)
    return (utc_now + IST_OFFSET).isoformat()


def iso_to_ist_iso(value: Optional[str]) -> Optional[str]:
    """Convert an ISO timestamp string to IST ISO (+05:30).

    - If `value` is None/empty, returns None.
    - If timestamp is naive (no tz), assumes UTC.
    - Supports 'Z' suffix.
    """
    if not value:
        return None

    s = value.strip()
    if s.endswith('Z'):
        s = s[:-1] + '+00:00'

    try:
        dt = datetime.fromisoformat(s)
    except Exception:
        return value

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return (dt.astimezone(timezone.utc) + IST_OFFSET).isoformat()
