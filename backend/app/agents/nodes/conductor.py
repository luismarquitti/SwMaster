"""Conductor node — Orchestrates multi-step workflows.

Follows the SDD-TDD pipeline defined in sdd-tdd-flow.yml:
Analyze (Planner) -> Test (Checker) -> Code (Maker) -> Review (Checker) -> PR (Executor).
"""

from __future__ import annotations

import json
from langchain_core.messages import AIMessage
from app.agents.state import AgentState


async def conductor_node(state: AgentState) -> AgentState:
    """Orchestrates the multi-step SDD-TDD workflow."""
    
    # We use a state dictionary for the final assistant response
    # to show the rich simulation card.
    
    pipeline_status = {
        "type": "simulation",
        "title": "SDD-TDD Pipeline Conductor",
        "description": "Orchestrating the full development lifecycle for your request.",
        "steps": [
            {"label": "Architectural Analysis", "status": "active"},
            {"label": "Unit Test Design", "status": "todo"},
            {"label": "Code Construction", "status": "todo"},
            {"label": "Quality Assurance Review", "status": "todo"},
            {"label": "GitHub Pull Request", "status": "todo"},
        ]
    }
    
    response = (
        "I'm initiating the **SwMaster SDD-TDD Pipeline**. I will guide you through the "
        "Analysis, Testing, Coding, Review, and PR phases sequentially.\n\n"
        f"```json\n{json.dumps(pipeline_status, indent=2)}\n```"
    )
    
    # In a real system, we would then transition the state to "planner"
    # for the next turn or via an edge.
    
    return {
        **state,
        "messages": [AIMessage(content=response)],
        "current_role": "Conductor",
        "skill_context": "Following SDD-TDD-Flow YAML",
    }
