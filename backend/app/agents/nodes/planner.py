"""Planner node — architect_and_planner skill.

Handles requirements elicitation, technical specification (SDD),
Mermaid diagram generation, and Architecture Decision Records.
"""

from __future__ import annotations

import logging

from app.agents.nodes.base import execute_agent_node
from app.agents.state import AgentState

logger = logging.getLogger(__name__)


async def planner_node(state: AgentState) -> AgentState:
    """LangGraph node: Planner (architect_and_planner).

    Generates technical specifications, diagrams, and ADRs
    based on the user's request.
    """
    return await execute_agent_node(state, "planner", logger)
