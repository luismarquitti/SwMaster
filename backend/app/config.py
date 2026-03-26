"""SwMaster Backend Configuration.

Loads environment variables and provides typed settings
for the FastAPI application and LLM integrations.
"""

import os
from pathlib import Path

from pydantic_settings import BaseSettings

# Resolve project root (two levels up from this file)
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_PROJECT_ROOT = _BACKEND_DIR.parent


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- LLM ---
    gemini_api_key: str = ""
    llm_model: str = "gemini-2.5-pro"
    llm_temperature: float = 0.2

    # --- GitHub ---
    github_token: str = ""

    # --- Server ---
    host: str = "0.0.0.0"
    port: int = 8000

    # --- CORS ---
    frontend_url: str = "http://localhost:3000"

    # --- Paths ---
    project_root: Path = _PROJECT_ROOT
    agents_dir: Path = _PROJECT_ROOT / "agents"
    skills_dir: Path = _PROJECT_ROOT / "skills"

    class Config:
        env_file = str(_PROJECT_ROOT / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
