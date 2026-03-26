FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (curl for health check)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy application code
COPY app/ app/

# Note: Agents and Skills are mounted via volumes in docker-compose.yml
# for local development. For production (Cloud Run), the build context
# should be adjusted to the root directory.

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
