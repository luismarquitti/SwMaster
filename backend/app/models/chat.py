"""Pydantic models for the Chat API.

Uses an OpenAI-compatible schema so the frontend
(OpenUI) can connect with minimal adapter code.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class Role(str, Enum):
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
    """Metadata about an available agent skill."""

    id: str
    name: str
    role: str
    description: str


class AgentInfo(BaseModel):
    """Metadata about the SwMaster agent."""

    name: str
    version: str
    description: str
    skills: list[SkillInfo]
    roles: list[str]


class SSEEvent(BaseModel):
    """Server-Sent Event payload (OpenAI chat-completion delta format)."""

    id: str
    object: str = "chat.completion.chunk"
    choices: list[dict[str, Any]]
