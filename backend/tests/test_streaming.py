import pytest
from app.utils.streaming import format_sse_event, format_done_event, token_stream_to_sse
from app.models.chat import SSEEvent

def test_format_sse_event():
    """Verify that SSE events are formatted correctly for the browser."""
    data = '{"id": "123", "content": "hello"}'
    formatted = format_sse_event(data)
    assert formatted.startswith("data: ")
    assert '"content": "hello"' in formatted
    assert formatted.endswith("\n\n")

@pytest.mark.asyncio
async def test_token_stream_to_sse():
    """Verify that the stream converter yields properly formatted chunks."""
    async def mock_tokens():
        yield "token1"
        yield "token2"
        
    stream = token_stream_to_sse(mock_tokens())
    results = [item async for item in stream]
    
    # 2 tokens + 1 final chunk + 1 DONE event
    assert len(results) == 4
    assert results[0].startswith("data: ")
    assert '"content": "token1"' in results[0]
    assert "[DONE]" in results[-1]
