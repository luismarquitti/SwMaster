"""Pydantic models for the Chat API.

Uses an OpenAI-compatible schema so the frontend
(OpenUI) can connect with minimal adapter code.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


class Role(str, Enum):
    """Enumeration of valid message roles in the conversation."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    """A single message in the conversation."""

    role: Role
    content: str


class ChatRequest(BaseModel):
    """Incoming request to POST /api/chat."""

    messages: list[ChatMessage] = Field(
        ..., min_length=1, description="Conversation history"
    )
    stream: bool = Field(default=True, description="Whether to stream the response")
    thread_id: str | None = Field(
        default=None, description="Thread ID for conversation continuity"
    )


class SkillInfo(BaseModel):
    """Metadata about an available agent skill.
    
    Attributes:
        id: Unique skill identifier (e.g., 'planner', 'maker').
        name: Human-readable skill name.
        role: Internal SOD role associated with the skill.
        description: Functional description of the skill's capabilities.
    """
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    role: str
    description: str


class AgentInfo(BaseModel):
    """Metadata about the SwMaster agent.
    
    Contains the agent's identity, version, and the full list of
    available skills and roles it can perform.
    """

    name: str
    version: str
    description: str
    skills: list[SkillInfo]
    roles: list[str]


class SSEEvent(BaseModel):
    """Server-Sent Event payload (OpenAI chat-completion delta format).
    
    Used for streaming responses to the frontend. Following the OpenAI
    schema ensures compatibility with standard AI UI components.
    """

    id: str
    object: str = "chat.completion.chunk"
    choices: list[dict[str, Any]]
