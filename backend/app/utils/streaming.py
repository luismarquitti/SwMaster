"""SSE streaming utilities.

Formats LangGraph output tokens into OpenAI-compatible
Server-Sent Event payloads for the frontend.
"""

from __future__ import annotations

import json
import uuid
from typing import AsyncIterator


def format_sse_event(data: str) -> str:
    """Format a string as an SSE data line."""
    return f"data: {data}\n\n"


def format_done_event() -> str:
    """Format the SSE stream termination signal."""
    return "data: [DONE]\n\n"


async def token_stream_to_sse(
    token_stream: AsyncIterator[str],
    stream_id: str | None = None,
) -> AsyncIterator[str]:
    """Convert an async stream of tokens into OpenAI-compatible SSE events.

    Each token is wrapped in a chat.completion.chunk payload so that
    OpenUI's ``openAIAdapter`` can parse it natively.

    Args:
        token_stream: Async iterator yielding string tokens.
        stream_id: Optional unique ID for this stream.

    Yields:
        SSE-formatted strings ready for ``StreamingResponse``.
    """
    sid = stream_id or str(uuid.uuid4())

    async for token in token_stream:
        chunk = {
            "id": sid,
            "object": "chat.completion.chunk",
            "choices": [
                {
                    "index": 0,
                    "delta": {"content": token, "role": "assistant"},
                    "finish_reason": None,
                }
            ],
        }
        yield format_sse_event(json.dumps(chunk))

    # Send the final chunk with finish_reason
    final_chunk = {
        "id": sid,
        "object": "chat.completion.chunk",
        "choices": [
            {
                "index": 0,
                "delta": {},
                "finish_reason": "stop",
            }
        ],
    }
    yield format_sse_event(json.dumps(final_chunk))
    yield format_done_event()
