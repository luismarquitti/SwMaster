"""Executor node — github_ops skill.

Manages repository lifecycle: branch creation, commits (Conventional
Commits), and Pull Request opening. Never pushes directly to main.
"""

from __future__ import annotations

import logging

from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.skills import build_system_prompt
from app.agents.state import AgentState
from app.config import settings

logger = logging.getLogger(__name__)


async def executor_node(state: AgentState) -> AgentState:
    """LangGraph node: Executor (github_ops).

    Creates branches, commits code, opens PRs.
    SOD: Cannot push directly to main — always requires human review.
    """
    logger.info("Entering executor_node (role: Executor)")

    system_prompt = build_system_prompt("executor")
    llm = ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.gemini_api_key,
        temperature=settings.llm_temperature,
    )

    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = await llm.ainvoke(messages)

    return {
        **state,
        "messages": [response],
        "current_role": "executor",
    }
