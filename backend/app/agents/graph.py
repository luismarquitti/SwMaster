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

from app.agents.nodes.checker import checker_node
from app.agents.nodes.conductor import conductor_node
from app.agents.nodes.executor import executor_node
from app.agents.nodes.maker import maker_node
from app.agents.nodes.planner import planner_node
from app.agents.state import AgentState
from app.config import settings

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Router: classifies user intent and picks the right skill node
# ------------------------------------------------------------------

_ROUTER_PROMPT = """You are a routing assistant for the SwMaster agent.
Your ONLY job is to classify the user's message into one of these skills:

- **planner** — architecture design, specifications, diagrams, ADRs, requirements
- **maker** — writing code, implementing features, fixing bugs
- **checker** — code review, testing, QA, security audit
- **executor** — git operations, branch creation, commits, pull requests
- **conductor** — multi-step workflows, full lifecycle, pipeline, SDD-TDD process
- **general** — general questions, greetings, explanations, anything else

Respond with ONLY the skill name (one word, lowercase). No explanation.
"""


async def router_node(state: AgentState) -> AgentState:
    """Classify user intent and set the routing label."""
    logger.info("Entering router_node")

    llm = ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.gemini_api_key,
        temperature=0.0,
    )

    messages = [
        SystemMessage(content=_ROUTER_PROMPT),
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
    return {**state, "current_role": route}


async def general_node(state: AgentState) -> AgentState:
    """Handle general questions using the SwMaster persona."""
    from app.agents.skills import load_soul

    logger.info("Entering general_node")

    soul = load_soul()
    llm = ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.gemini_api_key,
        temperature=settings.llm_temperature,
    )

    system = f"""{soul}

You are SwMaster, a Senior Software Engineering Agent. Answer the user's
question helpfully and concisely. When relevant, suggest which skill
(planner, maker, checker, executor) would be appropriate for follow-up tasks.
"""
    messages = [SystemMessage(content=system)] + state["messages"]
    response = await llm.ainvoke(messages)

    return {**state, "messages": [response], "current_role": "general"}


# ------------------------------------------------------------------
# Conditional edge: route based on classified intent
# ------------------------------------------------------------------

def _route_by_intent(state: AgentState) -> str:
    """Return the next node name based on router classification."""
    role = state.get("current_role", "general")
    if role in ("planner", "maker", "checker", "executor", "conductor"):
        return role
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
