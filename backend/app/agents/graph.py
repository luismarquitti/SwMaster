"""LangGraph state graph for SwMaster.

Builds the agent graph with a router node that dispatches
to the appropriate skill node based on user intent.
The graph enforces Segregation of Duties (SOD) via conditional edges.
"""

from __future__ import annotations

import logging

from langchain_core.messages import AIMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph

from app.agents.nodes.base import get_llm

from app.agents.nodes.checker import checker_node
from app.agents.nodes.conductor import conductor_node
from app.agents.nodes.executor import executor_node
from app.agents.nodes.maker import maker_node
from app.agents.nodes.planner import planner_node
from app.agents.state import AgentState
from app.agents.skills import build_system_context
from app.config import settings

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Router: classifies user intent and picks the right skill node
# ------------------------------------------------------------------

_ROUTER_CONTEXT = """You are a routing assistant for the SwMaster agent.
Your duty is to select the most appropriate skill or duty (Planner, Maker, or Checker)
based on the USER's request.

- **planner** — architecture design, specifications, diagrams, ADRs, requirements
- **maker** — writing code, implementing features, fixing bugs
- **checker** — code review, testing, QA, security audit
- **executor** — git operations, branch creation, commits, pull requests
- **conductor** — multi-step workflows, full lifecycle, pipeline, SDD-TDD process
- **general** — general questions, greetings, explanations, anything else

Respond with ONLY the skill name (one word, lowercase). No explanation.
"""


async def router_node(state: AgentState) -> AgentState:
    """Classifies the user intent using the LLM and labels the next duty.
    
    This node acts as the entry point for semantic routing, ensuring that 
    the request is handled by a node with the appropriate Skill context.
    
    Args:
        state: The current conversation state.
        
    Returns:
        Updated state with 'current_duty' set to the classified skill name.
    """
    logger.info("Entering router_node")

    llm = get_llm(temperature=0.0)
    messages = [
        SystemMessage(content=_ROUTER_CONTEXT),
        *state["messages"][-3:],  # Only pass recent context for routing
    ]
    response = await llm.ainvoke(messages)
    route = response.content.strip().lower()

    # Validate route
    valid_routes = {"planner", "maker", "checker", "executor", "conductor", "general"}
    if route not in valid_routes:
        logger.warning("Router returned unknown route '%s', defaulting to 'general'", route)
        route = "general"

    logger.info("Router classified intent as: %s", route)
    return {**state, "current_duty": route}


async def general_node(state: AgentState) -> AgentState:
    """Handles general engineering inquiries using the SwMaster persona.
    
    Used when the router cannot map the request to a specific functional skill.
    
    Args:
        state: The current conversation state.
        
    Returns:
        Updated state with the assistant's response and 'current_duty' set to 'general'.
    """
    from app.agents.skills import load_soul

    logger.info("Entering general_node")

    soul = load_soul()
    llm = get_llm()

    system = f"""{soul}

You are SwMaster, a Senior Software Engineering Agent. Answer the user's
question helpfully and concisely. When relevant, suggest which skill
(planner, maker, checker, executor) would be appropriate for follow-up tasks.
"""
    messages = [SystemMessage(content=system)] + state["messages"]
    response = await llm.ainvoke(messages)

    return {**state, "messages": [response], "current_duty": "general"}


# ------------------------------------------------------------------
# Conditional edge: route based on classified intent
# ------------------------------------------------------------------

def _route_by_intent(state: AgentState) -> str:
    """Return the next node name based on the duty classification."""
    duty = state.get("current_duty", "general")
    if duty in ("planner", "maker", "checker", "executor", "conductor"):
        return duty
    return "general"


# ------------------------------------------------------------------
# Build the compiled graph
# ------------------------------------------------------------------

def build_graph() -> StateGraph:
    """Construct and compile the SwMaster LangGraph state graph.

    Graph structure::

        START → router → (conditional) → planner | maker | checker | executor | general → END

    SOD enforcement:
    - The router ensures only one skill is active per turn.
    - In multi-step workflows (sdd-tdd-flow), the frontend would
      invoke the graph multiple times with accumulated state.

    Returns:
        Compiled LangGraph ``StateGraph``.
    """
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("router", router_node)
    graph.add_node("planner", planner_node)
    graph.add_node("maker", maker_node)
    graph.add_node("checker", checker_node)
    graph.add_node("executor", executor_node)
    graph.add_node("conductor", conductor_node)
    graph.add_node("general", general_node)

    # Entry point
    graph.set_entry_point("router")

    # Conditional routing from router → skill node
    graph.add_conditional_edges(
        "router",
        _route_by_intent,
        {
            "planner": "planner",
            "maker": "maker",
            "checker": "checker",
            "executor": "executor",
            "conductor": "conductor",
            "general": "general",
        },
    )

    # All skill nodes terminate the graph for this turn
    for node_name in ("planner", "maker", "checker", "executor", "conductor", "general"):
        graph.add_edge(node_name, END)

    return graph.compile()


# Singleton compiled graph
agent_graph = build_graph()
