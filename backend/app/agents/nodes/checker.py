"""Checker node — quality_assurance skill.

Performs code review, writes tests (TDD), checks coverage,
and validates SWEBOK v4 compliance. Acts as Checker/Auditor.
"""

from __future__ import annotations

import logging

from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.skills import build_system_prompt
from app.agents.state import AgentState
from app.config import settings

logger = logging.getLogger(__name__)


async def checker_node(state: AgentState) -> AgentState:
    """LangGraph node: Checker (quality_assurance).

    Reviews code, writes tests, checks for vulnerabilities.
    SOD: Cannot approve code it authored (isolated context).
    """
    logger.info("Entering checker_node (role: Checker)")

    system_prompt = build_system_prompt("checker")
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
        "current_role": "checker",
    }
