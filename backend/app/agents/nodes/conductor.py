"""Conductor node — Orchestrates multi-step workflows.

Follows the SDD-TDD pipeline defined in sdd-tdd-flow.yml:
Analyze (Planner) -> Test (Checker) -> Code (Maker) -> Review (Checker) -> PR (Executor).
"""

from __future__ import annotations

import json
from langchain_core.messages import AIMessage
from app.agents.state import AgentState
from app.agents.skills import load_workflow


async def conductor_node(state: AgentState) -> AgentState:
    """Orchestrates the multi-step SDD-TDD workflow."""
    
    # Load the deterministic flow from GitAgent data
    flow = load_workflow("sdd-tdd-flow")
    
    steps = []
    if flow and "steps" in flow:
        for s in flow["steps"]:
            steps.append({
                "label": s.get("id", "Unknown").replace("_", " ").title(),
                "status": "todo"
            })
    
    # Set the first step to active if we are just starting
    if steps:
        steps[0]["status"] = "active"
        
    pipeline_status = {
        "type": "simulation",
        "title": flow.get("name", "SDD-TDD Pipeline").replace("-", " ").title(),
        "description": flow.get("description", "Orchestrating the full development lifecycle."),
        "steps": steps
    }
    
    response = (
        f"I'm initiating the **{pipeline_status['title']}**. I will guide you through the "
        "Analysis, Testing, Coding, Review, and PR phases sequentially following the GitAgent standard.\n\n"
        f"```json\n{json.dumps(pipeline_status, indent=2)}\n```"
    )
    
    return {
        **state,
        "messages": [AIMessage(content=response)],
        "current_role": "Conductor",
        "skill_context": f"Executing Workflow: {flow.get('name', 'sdd-tdd-flow')}",
    }
