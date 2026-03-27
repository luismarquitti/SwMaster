import pytest
import os
from app.agents.skills import load_soul, load_duties, load_skill_prompt, build_system_prompt

def test_load_soul():
    """Verify that the soul (agent personality) is loaded from the markdown file."""
    soul_content = load_soul()
    assert isinstance(soul_content, str)
    assert len(soul_content) > 100
    assert "SwMaster" in soul_content

def test_load_skill_prompt():
    """Verify that a specific skill's SKILL.md is loaded."""
    content = load_skill_prompt("planner")
    assert isinstance(content, str)
    assert len(content) > 0
    assert "Planner" in content or "architect" in content.lower()

def test_load_duties():
    """Verify that SOD duties are loaded."""
    content = load_duties()
    assert isinstance(content, str)
    assert "Duties" in content or "Segregation" in content

def test_build_system_prompt_exhaustiveness():
    """Verify that build_system_prompt covers all expected roles."""
    
    for role in ["planner", "maker", "executor", "checker", "conductor"]:
        prompt = build_system_prompt(role)
        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert role.capitalize() in prompt or "Senior" in prompt
