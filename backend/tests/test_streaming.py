import pytest
import json
from app.utils.streaming import format_sse_event, format_done_event

def test_format_sse_event():
    data = {"hello": "world"}
    event = format_sse_event(json.dumps(data))
    assert event.startswith("data: ")
    assert "{\"hello\": \"world\"}" in event
    assert event.endswith("\n\n")

def test_format_done_event():
    event = format_done_event()
    assert event == "data: [DONE]\n\n"

def test_format_sse_event_with_newlines():
    # Ensure it doesn't break on multi-line data (though typically JSON is minified)
    data = "line1\nline2"
    event = format_sse_event(data)
    assert event == "data: line1\nline2\n\n"
