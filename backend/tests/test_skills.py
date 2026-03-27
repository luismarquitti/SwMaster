import pytest
from pathlib import Path
from app.agents.skills import load_soul, load_duties, load_skill_prompt, build_system_prompt, load_workflow

def test_load_soul():
    soul = load_soul()
    assert "# Identity" in soul
    assert "You are **SwMaster**" in soul

def test_load_duties():
    duties = load_duties()
    assert "# Segregation of Duties (SOD)" in duties
    assert "| Role | Authorized Skills |" in duties

def test_load_skill_prompt_valid():
    prompt = load_skill_prompt("planner")
    assert "## Purpose" in prompt or "# Skill" in prompt or "architect_and_planner" in prompt.lower()

def test_load_skill_prompt_invalid():
    prompt = load_skill_prompt("invalid_skill")
    assert prompt == ""

def test_build_system_prompt():
    prompt = build_system_prompt("maker")
    assert "# SwMaster Soul" in prompt
    assert "## Segregation of Duties" in prompt
    assert "## Active Skill Instructions" in prompt
    assert "SOFTWARE_CONSTRUCTION" in prompt.upper()

def test_load_workflow_valid():
    flow = load_workflow("sdd-tdd-flow")
    assert flow["name"] == "sdd-tdd-feature-flow"
    assert len(flow["steps"]) > 0
    assert flow["steps"][0]["id"] == "analyze_issue"

def test_load_workflow_invalid():
    flow = load_workflow("non_existent_flow")
    assert flow == {}
