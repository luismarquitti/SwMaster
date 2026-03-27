import pytest
from app.agents.state import AgentState
from app.agents.skills import load_workflow

def test_workflow_loading_sdd_tdd():
    flow = load_workflow("sdd-tdd-flow")
    assert "name" in flow
    assert flow["name"] == "sdd-tdd-feature-flow"
    
    # Check steps
    steps = flow.get("steps", [])
    assert any(s["id"] == "analyze_issue" for s in steps)
    assert any(s["id"] == "write_failing_tests" for s in steps)

def test_conductor_workflow_initialization():
    from app.agents.nodes.conductor import conductor_node
    from langchain_core.messages import HumanMessage
    
    state: AgentState = {
        "messages": [HumanMessage(content="Start workflow.")],
        "current_role": "conductor",
        "skill_context": "",
        "thread_id": "test",
        "workflow_id": "",
        "current_step_id": "",
    }
    
    # After first run, it should output a simulation card
    import asyncio
    result = asyncio.run(conductor_node(state))
    assert "current_role" in result
    assert result["current_role"] == "Conductor"

def test_workflow_step_completion():
    # If the current step matches a keyword, it should move to next
    # This logic depends on the conductor_node implementation
    pass
