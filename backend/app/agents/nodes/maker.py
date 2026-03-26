"""Maker node — software_construction skill.

Translates specifications and failing tests into clean,
modular production code following SWEBOK v4 principles.
"""

from __future__ import annotations

import logging

from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.skills import build_system_prompt
from app.agents.state import AgentState
from app.config import settings

logger = logging.getLogger(__name__)


async def maker_node(state: AgentState) -> AgentState:
    """LangGraph node: Maker (software_construction).

    Writes production code based on specifications and tests.
    SOD: Output MUST route to checker_node for review.
    """
    logger.info("Entering maker_node (role: Maker)")

    system_prompt = build_system_prompt("maker")
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
        "current_role": "maker",
    }
