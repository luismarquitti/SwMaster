"""Pydantic models for the Thread API.

Matches the OpenUI Thread type for seamless integration.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


class ThreadBase(BaseModel):
    """Base thread data."""

    title: str = Field(..., description="The title of the conversation thread")


class ThreadCreate(ThreadBase):
    """Data for creating a new thread."""
    pass


class ThreadUpdate(BaseModel):
    """Data for updating a thread (e.g., renaming).
    
    Attributes:
        title: The new title for the conversation thread.
    """
    title: str | None = None


class Thread(ThreadBase):
    """A conversation thread as expected by the OpenUI frontend.
    
    Includes metadata like ID, creation timestamp, and pending status
    to support seamless state management in the UI.
    """

    id: str
    createdAt: datetime = Field(..., alias="createdAt")
    isPending: bool = False

    model_config = ConfigDict(populate_by_name=True)


class ThreadListResponse(BaseModel):
    """Response for listing all conversation threads.
    
    Supports pagination via nextCursor (intended for future growth).
    """

    threads: list[Thread]
    nextCursor: Any | None = None
