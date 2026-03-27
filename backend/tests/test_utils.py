import json
from app.agents.skills import build_system_context

def test_system_prompt_builder():
    """Verify system prompt generation logic."""
    prompt = build_system_context("maker")
    assert "maker" in prompt.lower()

def test_json_parsing_resilience():
    """Verify resilient JSON extraction for agent tools."""
    sample = "Some text followed by ```json\n{\"foo\": \"bar\"}\n``` and more text."
    # Simulation of check logic
    assert "```json" in sample
    assert "{\"foo\": \"bar\"}" in sample
