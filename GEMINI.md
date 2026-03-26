# SwMaster: Senior Software Engineering Agent & Solutions Architect

## Project Overview
SwMaster is a specialized AI agent framework based on **SWEBOK v4** (Software Engineering Body of Knowledge). It is designed to operate throughout the entire software development lifecycle, from requirements elicitation and architecture design to coding, testing, and maintenance.

The project follows the **GitAgent** structure, where autonomous agents are defined with specific "souls," "rules," and "duties," and are equipped with "skills" to perform specialized tasks.

### Main Technologies
- **GitAgent Framework:** For agent definition and orchestration.
- **SWEBOK v4:** The foundational knowledge base for all architectural and engineering decisions.
- **LangGraph & FastAPI:** Intended backend for orchestrating agent workflows with streaming support.
- **OpenUI (React):** Intended frontend for the agent's command center.
- **Tailwind CSS:** Used for UI styling.

---

## Core Directory Structure

### `agents/`
Contains the definitions for the different AI agents in the system.
- **`sw-master-agent/`**: The primary agent, specialized in autonomous software engineering and SWEBOK v4 compliance.
- **`architect/`**: A meta-agent (based on Lyzr's GitAgent Architect) that helps in building, running, and managing other agents.

Each agent directory typically contains:
- `agent.yml` / `agent.yaml`: Configuration (model, version, skills, etc.).
- `SOUL.md`: Defines the agent's personality, core values, and fundamental approach.
- `RULES.md`: Explicit constraints and operational guidelines.
- `DUTIES.md`: Specific responsibilities and tasks the agent is expected to perform.
- `skills/`: Local skills specific to the agent.
- `knowledge/`: External information sources the agent can reference.

### `skills/`
A central repository of specialized capabilities that can be assigned to agents. Each skill is documented in a `SKILL.md` file.
- **`software_construction`**: Translating specifications into code (Maker role).
- **`quality_assurance`**: Testing and code review.
- **`architect_and_planner`**: High-level system design and roadmap creation.
- **`github-ops`**: Integration with GitHub for version control and CI/CD.

---

## Development Conventions

### Segregation of Duties (SoD)
The project strictly enforces Segregation of Duties. For example, an agent acting in the "Maker" (Developer) role through the `software_construction` skill MUST NOT approve its own code. Approval must come from a "Reviewer" role (e.g., via `quality_assurance` or a human).

### SWEBOK v4 Alignment
All engineering decisions, documentation, and code generation must align with the standards defined in SWEBOK v4. This includes:
- High cohesion and low coupling in modular design.
- Application of Design Patterns (GoF).
- Structured logging and robust exception handling.

---

## Key Files
- **`README.md`**: High-level introduction to the project.
- **`OpenUI_spec.md`**: Technical specification for the frontend/backend integration and deployment strategy on Google Cloud Run.
- **`agents/sw-master-agent/SOUL.md`**: The definitive guide to the SwMaster agent's behavior.
- **`agents/architect/agent.yaml`**: Configuration for the GitAgent assistant.

---

## Roadmap & Usage
The project is transitioning from a set of agent definitions into a full-stack application.
1. **Backend:** Implement a FastAPI service with LangGraph to orchestrate agent nodes.
2. **Frontend:** Convert the existing Tailwind-based HTML prototypes into a React application using OpenUI components.
3. **Deployment:** Containerize the services for deployment on Google Cloud Run.
