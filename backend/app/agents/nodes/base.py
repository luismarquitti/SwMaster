"""Base node logic for LangGraph agent nodes to eliminate duplication."""

from __future__ import annotations

from typing import TYPE_CHECKING
from loguru import logger

from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.skills import build_system_context
from app.config import settings

def get_llm(temperature: float | None = None) -> ChatGoogleGenerativeAI:
    """Return a pre-configured LLM instance."""
    return ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.gemini_api_key,
        temperature=temperature if temperature is not None else settings.llm_temperature,
    )


async def execute_agent_node(state: AgentState, role: str) -> AgentState:
    """Consolidated logic for executing an agent node.

    Refactors the common LLM invocation pattern across different agent nodes
    (planner, maker, executor, checker) to improve maintainability and
    reduce token waste during AI analysis.

    Args:
        state: The current LangGraph state containing agent messages.
        role: The specific role/skill to execute (e.g., "planner", "maker").

    Returns:
        AgentState: The updated state containing the LLM's response and current role.
    """
    logger.info(f"Executing node for role: {role}")

    # Elicit the specific system context for the role
    system_context = build_system_context(role)

    # Initialize the LLM with project settings
    llm = get_llm()

    # Combine system context with conversation history
    messages = [SystemMessage(content=system_context)] + state["messages"]

    # Log LLM Input
    logger.debug(f"LLM Input for role {role}: {messages}")

    # Invoke the LLM asynchronously
    response = await llm.ainvoke(messages)

    # Log LLM Response
    logger.debug(f"LLM Response for role {role}: {response.content}")

    # Return updated state
    return {
        **state,
        "messages": [response],
        "current_role": role,
    }
