"""Executor node — github_ops skill.

Manages repository lifecycle: branch creation, commits (Conventional
Commits), and Pull Request opening. Never pushes directly to main.
"""

from __future__ import annotations

from loguru import logger

from app.agents.nodes.base import execute_agent_node
from app.agents.state import AgentState


async def executor_node(state: AgentState) -> AgentState:
    """LangGraph node: Executor (github_ops).

    Creates branches, commits code, opens PRs.
    SOD: Cannot push directly to main — always requires human review.
    """
    return await execute_agent_node(state, "executor")
