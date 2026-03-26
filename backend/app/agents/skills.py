"""Skill loader utility.

Reads SKILL.md and SOUL.md files from the project's agents/skills
directories and assembles them into system prompts for each node.
"""

from __future__ import annotations

import logging
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)

# Map of skill_id → path under skills/
_SKILL_MAP: dict[str, str] = {
    "planner": "architect_and_planner",
    "maker": "software_construction",
    "checker": "quality_assurance",
    "executor": "github-ops",
}


def _read_file(path: Path) -> str:
    """Read a file safely, returning empty string on failure."""
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        logger.warning("File not found: %s", path)
        return ""


def load_soul() -> str:
    """Load the SwMaster agent's SOUL.md."""
    return _read_file(settings.agents_dir / "sw-master-agent" / "SOUL.md")


def load_duties() -> str:
    """Load the SwMaster agent's DUTIES.md (SOD rules)."""
    return _read_file(settings.agents_dir / "sw-master-agent" / "DUTIES.md")


def load_skill_prompt(skill_id: str) -> str:
    """Load the SKILL.md for a given skill.

    Args:
        skill_id: One of 'planner', 'maker', 'checker', 'executor'.

    Returns:
        The skill's SKILL.md content, or empty string.
    """
    folder = _SKILL_MAP.get(skill_id)
    if not folder:
        logger.warning("Unknown skill_id: %s", skill_id)
        return ""
    return _read_file(settings.skills_dir / folder / "SKILL.md")


def build_system_prompt(skill_id: str) -> str:
    """Build a complete system prompt for a LangGraph node.

    Combines SOUL.md + DUTIES.md + the skill's SKILL.md into
    a single prompt that gives the LLM the correct personality,
    SOD constraints, and role-specific instructions.

    Args:
        skill_id: One of 'planner', 'maker', 'checker', 'executor'.

    Returns:
        Assembled system prompt string.
    """
    soul = load_soul()
    duties = load_duties()
    skill = load_skill_prompt(skill_id)

    return f"""
{soul}

---
## Segregation of Duties
{duties}

---
## Active Skill Instructions
You are currently operating in the **{skill_id.upper()}** role.
{skill}
""".strip()
