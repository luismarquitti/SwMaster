"""SwMaster Command Center — FastAPI Application.

Exposes:
- GET  /health       → Health check
- GET  /api/agents   → Agent metadata and available skills
- POST /api/chat     → Chat endpoint with SSE streaming
"""

from __future__ import annotations

import json
import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage

from app.agents.graph import agent_graph
from app.config import settings
from app.models.chat import AgentInfo, ChatRequest, SkillInfo
from app.utils.streaming import format_done_event, format_sse_event

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("swmaster")


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup / shutdown lifecycle."""
    logger.info("SwMaster backend starting — model=%s", settings.llm_model)
    logger.info("Agents dir: %s", settings.agents_dir)
    logger.info("Skills dir: %s", settings.skills_dir)
    yield
    logger.info("SwMaster backend shutting down")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SwMaster Command Center API",
    version="0.1.0",
    description="FastAPI + LangGraph backend for the SwMaster agent framework.",
    lifespan=lifespan,
)

# CORS — allow the frontend (and localhost variants)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    """Simple health-check endpoint."""
    return {"status": "ok", "model": settings.llm_model}


@app.get("/api/agents", response_model=AgentInfo)
async def get_agent_info():
    """Return metadata about the SwMaster agent and its skills."""
    return AgentInfo(
        name="SwMaster",
        version="1.0.0",
        description=(
            "Autonomous Software Engineering Agent specialized in SWEBOK v4, "
            "focused on planning, development, GitHub integration, and "
            "maintenance of living documentation."
        ),
        skills=[
            SkillInfo(
                id="planner",
                name="Architecture & Planning",
                role="Maker",
                description="Requirements elicitation, SDD, Mermaid diagrams, ADRs.",
            ),
            SkillInfo(
                id="maker",
                name="Software Construction",
                role="Maker",
                description="Translates specifications into modular, clean code.",
            ),
            SkillInfo(
                id="checker",
                name="Quality Assurance",
                role="Checker",
                description="TDD, code review, security audit, coverage management.",
            ),
            SkillInfo(
                id="executor",
                name="GitHub Operations",
                role="Executor",
                description="Branch management, commits, Pull Request workflows.",
            ),
        ],
        roles=["Planner", "Maker", "Checker", "Executor", "Auditor"],
    )


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat endpoint — streams responses via SSE.

    Accepts an OpenAI-compatible messages array, invokes the
    LangGraph agent graph, and streams the response back as
    Server-Sent Events in the OpenAI chat-completion chunk format.
    """
    logger.info(
        "POST /api/chat — %d messages, thread=%s",
        len(request.messages),
        request.thread_id,
    )

    # Convert incoming messages to LangChain format
    lc_messages = []
    for msg in request.messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))
        # system messages are handled internally via skill prompts

    if not lc_messages:
        raise HTTPException(status_code=400, detail="No valid messages provided")

    stream_id = str(uuid.uuid4())
    thread_id = request.thread_id or str(uuid.uuid4())

    async def generate():
        """Invoke the agent graph and stream the response."""
        try:
            # Run the graph
            initial_state = {
                "messages": lc_messages,
                "current_role": "",
                "skill_context": "",
                "thread_id": thread_id,
            }

            result = await agent_graph.ainvoke(initial_state)

            # Extract the last AI message from the result
            response_messages = result.get("messages", [])
            ai_response = ""
            for msg in reversed(response_messages):
                if isinstance(msg, AIMessage):
                    ai_response = msg.content
                    break

            if not ai_response:
                ai_response = "I'm sorry, I couldn't process that request."

            # Stream the response token-by-token for a progressive UX
            # We simulate streaming by chunking the complete response
            chunk_size = 4  # characters per SSE event
            for i in range(0, len(ai_response), chunk_size):
                token = ai_response[i : i + chunk_size]
                chunk = {
                    "id": stream_id,
                    "object": "chat.completion.chunk",
                    "choices": [
                        {
                            "index": 0,
                            "delta": {"content": token, "role": "assistant"},
                            "finish_reason": None,
                        }
                    ],
                }
                yield format_sse_event(json.dumps(chunk))

            # Final chunk
            final = {
                "id": stream_id,
                "object": "chat.completion.chunk",
                "choices": [
                    {
                        "index": 0,
                        "delta": {},
                        "finish_reason": "stop",
                    }
                ],
            }
            yield format_sse_event(json.dumps(final))
            yield format_done_event()

        except Exception as exc:
            logger.exception("Error during chat streaming")
            error_chunk = {
                "id": stream_id,
                "object": "chat.completion.chunk",
                "choices": [
                    {
                        "index": 0,
                        "delta": {
                            "content": f"\n\n⚠️ Error: {exc}",
                            "role": "assistant",
                        },
                        "finish_reason": "stop",
                    }
                ],
            }
            yield format_sse_event(json.dumps(error_chunk))
            yield format_done_event()

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ---------------------------------------------------------------------------
# Entry point (for running with `python -m app.main`)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
