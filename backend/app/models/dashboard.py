"""Pydantic models for the Dashboard API.
"""

from __future__ import annotations

from pydantic import BaseModel


class DashboardStats(BaseModel):
    """Stats for the dashboard KPI cards."""

    activeSkills: int
    sodCompliance: int  # Percentage
    llmModel: str
    agentStatus: str  # "Active", "Offline", "Error"
