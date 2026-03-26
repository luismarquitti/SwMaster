"""Planner node — architect_and_planner skill.

Handles requirements elicitation, technical specification (SDD),
Mermaid diagram generation, and Architecture Decision Records.
"""

from __future__ import annotations

import logging

from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.skills import build_system_prompt
from app.agents.state import AgentState
from app.config import settings

logger = logging.getLogger(__name__)


async def planner_node(state: AgentState) -> AgentState:
    """LangGraph node: Planner (architect_and_planner).

    Generates technical specifications, diagrams, and ADRs
    based on the user's request.
    """
    logger.info("Entering planner_node (role: Planner)")

    system_prompt = build_system_prompt("planner")
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
        "current_role": "planner",
    }
