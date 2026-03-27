"""Pydantic models for the Chat API.

Uses an OpenAI-compatible schema so the frontend (OpenUI) can connect 
with minimal adapter code. Aligned with the GitAgent Standard.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


class Role(str, Enum):
    """Enumeration of valid message roles in the conversation.
    
    Roles:
        SYSTEM: System instructions for the agent.
        USER: Direct input from the human user.
        ASSISTANT: Response from the AI agent (internally mapped to 'agent' in domain).
    """
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    """A single message in the conversation history.
    
    Attributes:
        role: The role of the message sender (user, assistant, system).
        content: The text content of the message.
    """

    role: Role
    content: str


class ChatRequest(BaseModel):
    """Incoming request to the Chat API.
    
    Attributes:
        messages: The conversation history leading up to the current request.
        stream: Whether to stream the response via SSE.
        thread_id: The ID of the conversation thread for context persistence.
    """

    messages: list[ChatMessage] = Field(
        ..., min_length=1, description="Conversation history"
    )
    stream: bool = Field(default=True, description="Whether to stream the response")
    thread_id: str | None = Field(
        default=None, description="Thread ID for conversation continuity"
    )


class SkillInfo(BaseModel):
    """Metadata about an available agent capability.
    
    This model defines a single skill (e.g., software_construction)
    mapping it to a specific Segregation of Duties (SOD) duty.
    """
    model_config = ConfigDict(from_attributes=True)
    id: str = Field(..., description="Unique skill identifier")
    name: str = Field(..., description="Display name of the skill")
    duty: str = Field(..., description="The SOD duty associated with this skill")
    description: str = Field(..., description="Functional description of the skill")


class AgentInfo(BaseModel):
    """Metadata about the SwMaster agent persona.
    
    Provides core identity information for UI initialization.
    """

    name: str = Field(..., description="Agent display name")
    version: str = Field(..., description="Software version (SemVer)")
    description: str = Field(..., description="High-level purpose of the agent")
    skills: list[SkillInfo] = Field(..., description="List of available skills")
    duties: list[str] = Field(..., description="List of legal duties (roles)")


class SSEEvent(BaseModel):
    """Server-Sent Event payload for chat streaming.
    
    Follows the OpenAI chat-completion chunk format.
    """

    id: str = Field(..., description="Unique stream ID")
    object: str = Field(default="chat.completion.chunk", description="Object type")
    choices: list[dict[str, Any]] = Field(..., description="Delta fragments")
