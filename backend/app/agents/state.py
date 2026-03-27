"""LangGraph agent state definition.

Defines the shared state that flows through all nodes
in the SwMaster agent graph.
"""

from __future__ import annotations

from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """Global state for the LangGraph agent orchestration.
    
    This dictionary is the shared memory that flows through all nodes 
    in the graph, following the GitAgent state management standard.
    
    Attributes:
        messages: The append-only conversation history (BaseMessage list).
        current_role: The active persona role (e.g. 'planner', 'maker').
        skill_context: Static context loaded from SKILL.md for the active node.
        thread_id: The persistent conversation workspace identifier.
        workflow_id: The ID of the deterministic SkillsFlow currently executing.
        current_step_id: The step ID within the active workflow.
    """

    messages: Annotated[list[BaseMessage], add_messages]
    current_duty: str
    skill_context: str
    thread_id: str
    workflow_id: str
    current_step_id: str
