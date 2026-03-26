"""Pydantic models for the Thread API.

Matches the OpenUI Thread type for seamless integration.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ThreadBase(BaseModel):
    """Base thread data."""

    title: str = Field(..., description="The title of the conversation thread")


class ThreadCreate(ThreadBase):
    """Data for creating a new thread."""
    pass


class ThreadUpdate(BaseModel):
    """Data for updating a thread (e.g., renaming)."""
    title: str | None = None


class Thread(ThreadBase):
    """A conversation thread as expected by OpenUI."""

    id: str
    createdAt: datetime = Field(..., alias="createdAt")
    isPending: bool = False

    class Config:
        populate_by_name = True


class ThreadListResponse(BaseModel):
    """Response for listing threads."""

    threads: list[Thread]
    nextCursor: Any | None = None
