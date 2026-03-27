"""Pydantic models for the Dashboard API.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class DashboardStats(BaseModel):
    """Stats for the dashboard KPI cards.
    
    Provides real-time metrics on agent performance, SoD compliance,
    and LLM configuration for the Command Center interface.
    """
    model_config = ConfigDict(from_attributes=True)

    activeSkills: int
    sodCompliance: int  # Percentage
    llmModel: str
    agentStatus: str  # "Active", "Offline", "Error"
