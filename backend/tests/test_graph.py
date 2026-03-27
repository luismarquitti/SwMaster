import pytest
from langchain_core.messages import HumanMessage, AIMessage
from app.agents.graph import agent_graph
from app.agents.state import AgentState

@pytest.mark.asyncio
async def test_graph_initial_routing_planner():
    # Test that a request about planning/architecture routes to planner
    state = {
        "messages": [HumanMessage(content="Create a technical spec for a login system.")],
        "current_role": "",
        "skill_context": "",
        "thread_id": "test_thread",
        "workflow_id": "",
        "current_step_id": "",
    }
    
    # We invoke the graph. For testing, we might need to mock the LLM inside nodes 
    # but since we are using get_llm which is already mocked in previous rounds 
    # (or uses safe defaults), we check the transition.
    
    # Actually, to test routing specifically without full execution, 
    # we would test the router_node.
    from app.agents.graph import router_node
    result = await router_node(state)
    assert result["current_role"] == "planner"

@pytest.mark.asyncio
async def test_graph_initial_routing_maker():
    state = {
        "messages": [HumanMessage(content="Write the python code for a fibonacci function.")],
        "current_role": "",
        "skill_context": "",
        "thread_id": "test_thread",
        "workflow_id": "",
        "current_step_id": "",
    }
    from app.agents.graph import router_node
    result = await router_node(state)
    assert result["current_role"] == "maker"

@pytest.mark.asyncio
async def test_graph_conductor_dynamic_card():
    # Test that conductor builds the card from YAML
    state = {
        "messages": [HumanMessage(content="Start the SDD-TDD flow.")],
        "current_role": "conductor",
        "skill_context": "",
        "thread_id": "test_thread",
        "workflow_id": "",
        "current_step_id": "",
    }
    from app.agents.nodes.conductor import conductor_node
    result = await conductor_node(state)
    
    last_msg = result["messages"][-1]
    assert "Simulation Card" in last_msg.content or "simulation" in last_msg.content
    assert "Analyze Issue" in last_msg.content
    assert "active" in last_msg.content
