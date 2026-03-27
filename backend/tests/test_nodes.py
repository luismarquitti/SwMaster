import pytest
from loguru import logger
from unittest.mock import AsyncMock, patch, ANY
from langchain_core.messages import AIMessage, HumanMessage
from app.agents.nodes.base import execute_agent_node
from app.agents.state import AgentState

@pytest.mark.asyncio
async def test_execute_agent_node_success():
    """Verify that execute_agent_node correctly invokes the LLM and updates state."""
    
    # Initial state
    state: AgentState = {
        "messages": [HumanMessage(content="Hello")],
        "current_role": "user",
        "skill_context": "",
        "thread_id": "test",
        "workflow_id": "",
        "current_step_id": "",
    }
    
    # Mock LLM response
    mock_response = AIMessage(content="I am the planner.")
    
    with patch("app.agents.nodes.base.ChatGoogleGenerativeAI") as mock_llm_class:
        # Configure the mock instance
        mock_instance = mock_llm_class.return_value
        mock_instance.ainvoke = AsyncMock(return_value=mock_response)
        
        # Execute the node
        result = await execute_agent_node(state, "planner")
        
        # Verify result
        assert result["current_role"] == "planner"
        assert len(result["messages"]) == 1
        assert result["messages"][0].content.strip() == "I am the planner."
        
        # Verify LLM was called with correct context (system prompt + user message)
        args, _ = mock_instance.ainvoke.call_args
        messages = args[0]
        assert len(messages) == 2
        assert "Senior" in messages[0].content or "Planner" in messages[0].content

@pytest.mark.asyncio
async def test_all_role_nodes():
    """Verify each role-specific node correctly delegates to the base helper."""
    from app.agents.nodes.planner import planner_node
    from app.agents.nodes.maker import maker_node
    from app.agents.nodes.executor import executor_node
    from app.agents.nodes.checker import checker_node
    
    state: AgentState = {
        "messages": [HumanMessage(content="test")],
        "current_role": "user",
        "skill_context": "",
        "thread_id": "test",
        "workflow_id": "",
        "current_step_id": "",
    }
    
    with patch("app.agents.nodes.planner.execute_agent_node", new_callable=AsyncMock) as mock_execute_planner, \
         patch("app.agents.nodes.maker.execute_agent_node", new_callable=AsyncMock) as mock_execute_maker, \
         patch("app.agents.nodes.executor.execute_agent_node", new_callable=AsyncMock) as mock_execute_executor, \
         patch("app.agents.nodes.checker.execute_agent_node", new_callable=AsyncMock) as mock_execute_checker:

        # Test Planner
        await planner_node(state)
        assert mock_execute_planner.call_args[0][1] == "planner"
        
        # Test Maker
        await maker_node(state)
        assert mock_execute_maker.call_args[0][1] == "maker"
        
        # Test Executor
        await executor_node(state)
        assert mock_execute_executor.call_args[0][1] == "executor"
        
        # Test Checker
        await checker_node(state)
        assert mock_execute_checker.call_args[0][1] == "checker"
