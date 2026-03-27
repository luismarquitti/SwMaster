"""Checker node — quality_assurance skill.

Performs code review, writes tests (TDD), checks coverage,
and validates SWEBOK v4 compliance. Acts as Checker/Auditor.
"""

from __future__ import annotations

from loguru import logger

from app.agents.nodes.base import execute_agent_node
from app.agents.state import AgentState


async def checker_node(state: AgentState) -> AgentState:
    """LangGraph node: Checker (quality_assurance).

    Reviews code, writes tests, checks for vulnerabilities.
    SOD: Cannot approve code it authored (isolated context).
    """
    return await execute_agent_node(state, "checker")
