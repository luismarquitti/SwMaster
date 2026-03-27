"""Maker node — software_construction skill.

Translates specifications and failing tests into clean,
modular production code following SWEBOK v4 principles.
"""

from __future__ import annotations

from loguru import logger

from app.agents.nodes.base import execute_agent_node
from app.agents.state import AgentState


async def maker_node(state: AgentState) -> AgentState:
    """LangGraph node: Maker (software_construction).

    Writes production code based on specifications and tests.
    SOD: Output MUST route to checker_node for review.
    """
    return await execute_agent_node(state, "maker")
