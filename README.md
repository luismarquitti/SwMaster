# SwMaster: Senior Software Engineering Agent & Command Center

SwMaster is a specialized AI agent framework based on **SWEBOK v4** (Software Engineering Body of Knowledge). It is designed to operate throughout the entire software development lifecycle. It orchestrates specialized agent nodes to handle the entire software development lifecycle with strict **Segregation of Duties (SOD)**.

> [!IMPORTANT]
> **AI Readiness**: This project follows strict AI-native development standards. See the [GLOSSARY.md](GLOSSARY.md) for unified domain terminology.

---

## 🏗️ Architecture

The system follows a 3-tier architecture:

1.  **Frontend (Next.js 16):** A "Data-Driven Command Center" using Material Design 3 tokens, SSE-based real-time chat, and live KPI dashboards.
2.  **Backend (FastAPI):** A Python-based API that serves as the gateway to the agent orchestrator.
3.  **Core (LangGraph):** A state machine that routes user intents to specialized skill nodes:
    *   **Planner:** Architectural design, specifications, and ADRs.
    *   **Maker:** Code construction and implementation.
    *   **Checker:** QA, testing, and code review.
    *   **Executor:** GitHub operations and PR management.
    *   **Conductor:** Multi-step SDD-TDD workflow orchestration.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+ / Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- [GitHub Personal Access Token](https://github.com/settings/tokens)

### Local Development

1.  **Clone & Setup Environment:**
    ```bash
    git clone https://github.com/luismarquitti/SwMaster.git
    cd SwMaster
    cp backend/.env.example .env # Add your keys
    ```

2.  **Run with Docker Compose (Recommended):**
    ```bash
    docker-compose up --build
    ```
    *   **Frontend:** http://localhost:3000
    *   **Backend:** http://localhost:8000

3.  **Manual Start:**
    *   **Backend:** `cd backend && pip install -e . && uvicorn app.main:app --reload`
    *   **Frontend:** `cd frontend && npm install && npm run dev`

---

## 🛡️ Segregation of Duties (SOD)

SwMaster enforces SOD at the graph level. Each request is routed to an isolated node with a context-specific system prompt derived from `agents/sw-master-agent/SOUL.md` and the corresponding `DUTIES.md` and `SKILL.md`. This prevents the "Maker" from approving its own work, as the system requires a "Checker" node to validate transitions.

---

## 🎨 Design System: Aura Strategy

The UI uses a custom "Aura Strategy" theme:
- **Colors:** MD3 Material tokens (Primary: Violet/Mauve).
- **Typography:** Inter & JetBrains Mono for code.
- **Glassmorphism:** Subtle blurs and container outlines.
- **Micro-animations:** AI pulse effects and smooth transitions.

---

## ⚖️ SWEBOK v4 Compliance

Every action taken by SwMaster is mapped to a SWEBOK v4 knowledge area:
- **Software Requirements:** Handled by the Planner.
- **Software Design:** Handled by the Planner/Architect.
- **Software Construction:** Handled by the Maker.
- **Software Testing & Quality:** Handled by the Checker.
- **Software Engineering Process:** Handled by the Conductor.
