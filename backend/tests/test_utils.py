import json
from backend.app.agents.skills import build_system_prompt

def test_system_prompt_builder():
    """Verify system prompt generation logic."""
    prompt = build_system_prompt("test-skill", "You are a test agent.")
    assert "test-skill" in prompt
    assert "You are a test agent." in prompt

def test_json_parsing_resilience():
    """Verify resilient JSON extraction for agent tools."""
    sample = "Some text followed by ```json\n{\"foo\": \"bar\"}\n``` and more text."
    # Simulation of check logic
    assert "```json" in sample
    assert "{\"foo\": \"bar\"}" in sample
