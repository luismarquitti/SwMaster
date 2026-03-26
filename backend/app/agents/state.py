"""LangGraph agent state definition.

Defines the shared state that flows through all nodes
in the SwMaster agent graph.
"""

from __future__ import annotations

from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """State shared across all LangGraph nodes.

    Attributes:
        messages: Conversation history (appended via ``add_messages`` reducer).
        current_role: The active SOD role (planner, maker, checker, executor).
        skill_context: Additional context loaded from skill definitions.
        thread_id: Conversation thread identifier.
    """

    messages: Annotated[list[BaseMessage], add_messages]
    current_role: str
    skill_context: str
    thread_id: str
