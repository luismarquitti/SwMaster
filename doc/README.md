# SwMaster — Project Documentation

> **Version:** 0.1.0  
> **Last Updated:** 2026-03-26  
> **Status:** Milestone 1 — Command Center (Construction Phase)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Directory Structure](#4-directory-structure)
5. [Backend](#5-backend)
6. [Frontend](#6-frontend)
7. [Agent System](#7-agent-system)
8. [API Reference](#8-api-reference)
9. [Design System — Aura Strategy](#9-design-system--aura-strategy)
10. [Deployment](#10-deployment)
11. [Environment Configuration](#11-environment-configuration)
12. [Architecture Decision Records](#12-architecture-decision-records)
13. [SWEBOK v4 Compliance](#13-swebok-v4-compliance)
14. [Roadmap](#14-roadmap)

---

## 1. Project Overview

**SwMaster** is an autonomous AI agent framework and full-stack command center designed according to **SWEBOK v4** (Software Engineering Body of Knowledge) principles. It orchestrates specialized agent nodes to handle the entire software development lifecycle with strict **Segregation of Duties (SOD)**.

The system provides:
- A **Data-Driven Dashboard** with live KPI metrics for agent monitoring.
- A **Real-Time AI Chat Interface** powered by SSE streaming with OpenUI integration.
- A **LangGraph-based Agent Orchestrator** that routes user intents to isolated skill nodes (Planner, Maker, Checker, Executor, Conductor).
- **Thread Persistence** for conversation history management.
- **Rich UI Components** including simulation cards, system updates, and Markdown rendering.

---

## 2. Architecture

SwMaster follows a **3-Tier Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                    │
│  React 19 · Tailwind CSS 4 · OpenUI · Material Design 3    │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐    │
│  │ Sidebar  │  │Dashboard │  │     Chat Panel         │    │
│  │          │  │ KPIs     │  │  OpenUI ChatProvider   │    │
│  │          │  │ Tables   │  │  SSE Streaming Client  │    │
│  │          │  │ Charts   │  │  Thread Management     │    │
│  └──────────┘  └──────────┘  └────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / SSE
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                         │
│  Python 3.12 · Pydantic · Uvicorn · CORS                   │
│                                                             │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │ /api/chat  │  │ /api/threads│  │ /api/dashboard   │     │
│  │ SSE Stream │  │ CRUD Ops    │  │ /api/agents      │     │
│  └──────┬─────┘  └─────────────┘  └──────────────────┘     │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              LangGraph State Machine                │    │
│  │                                                     │    │
│  │  START → Router → ┬─ planner   ─┐                   │    │
│  │                   ├─ maker     ─┤                   │    │
│  │                   ├─ checker   ─├→ END               │    │
│  │                   ├─ executor  ─┤                   │    │
│  │                   ├─ conductor ─┤                   │    │
│  │                   └─ general   ─┘                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE GEMINI API (LLM Provider)               │
│                  gemini-2.5-pro                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User sends a message via the **ChatPanel** (frontend).
2. The message is sent as a `POST /api/chat` request to the **FastAPI backend**.
3. The backend converts messages to LangChain format and invokes the **LangGraph state machine**.
4. The **Router Node** classifies user intent using an LLM call and dispatches to the appropriate skill node.
5. The skill node (e.g., `planner`, `maker`) constructs a system prompt from `SOUL.md + DUTIES.md + SKILL.md` and generates a response.
6. The response is streamed back to the frontend as **Server-Sent Events (SSE)** in OpenAI-compatible chunk format.
7. The **OpenUI ChatProvider** on the frontend parses the SSE stream and renders the response progressively.

---

## 3. Technology Stack

| Layer       | Technology                     | Version     | Purpose                                 |
|-------------|--------------------------------|-------------|------------------------------------------|
| Frontend    | Next.js                        | 16.2.1      | React framework with SSR                |
| Frontend    | React                          | 19.2.4      | UI rendering                             |
| Frontend    | Tailwind CSS                   | 4.x         | Utility-first styling                    |
| Frontend    | OpenUI (`@openuidev/react-*`)  | 0.7–0.9     | Chat state management & thread hooks     |
| Frontend    | Lucide React                   | 1.7.0       | Icon library                             |
| Frontend    | Zustand                        | 4.5.7       | Client state management                  |
| Backend     | FastAPI                        | ≥0.115      | Async HTTP API framework                 |
| Backend     | Uvicorn                        | ≥0.32       | ASGI server                              |
| Backend     | LangGraph                      | ≥0.4.0      | Agent state machine orchestration         |
| Backend     | LangChain Google GenAI         | ≥2.1.0      | Gemini LLM integration                   |
| Backend     | Pydantic / Pydantic Settings   | ≥2.10       | Data validation & environment config     |
| LLM         | Google Gemini                  | 2.5 Pro     | Language model for all agent nodes       |
| DevOps      | Docker / Docker Compose        | —           | Containerization & orchestration         |
| Design      | Material Design 3              | —           | Design system tokens                     |
| Fonts       | Inter · JetBrains Mono         | —           | Typography                               |

---

## 4. Directory Structure

```
SwMaster/
├── agents/                          # Agent definitions (GitAgent format)
│   ├── architect/                   # Meta-agent for building other agents
│   └── sw-master-agent/             # Primary SwMaster agent
│       ├── SOUL.md                  # Agent identity & personality
│       ├── DUTIES.md                # SOD conflict matrix & rules
│       ├── agent.yml                # Agent configuration
│       ├── memory/                  # Agent-specific memory
│       └── workflows/               # Agent-specific workflows
│
├── backend/                         # FastAPI + LangGraph backend
│   ├── Dockerfile                   # Python 3.12-slim container
│   ├── pyproject.toml               # Python dependencies (hatchling)
│   ├── .env.example                 # Environment variable template
│   └── app/
│       ├── main.py                  # FastAPI app, routes, SSE streaming
│       ├── config.py                # Pydantic Settings (env vars)
│       ├── agents/
│       │   ├── graph.py             # LangGraph state machine definition
│       │   ├── state.py             # AgentState TypedDict
│       │   ├── skills.py            # SOUL/DUTIES/SKILL.md loader
│       │   └── nodes/
│       │       ├── planner.py       # Architecture & Planning node
│       │       ├── maker.py         # Code Construction node
│       │       ├── checker.py       # Quality Assurance node
│       │       ├── executor.py      # GitHub Operations node
│       │       └── conductor.py     # Multi-step workflow orchestrator
│       ├── models/
│       │   ├── chat.py              # ChatMessage, ChatRequest, AgentInfo
│       │   ├── dashboard.py         # DashboardStats model
│       │   └── thread.py            # Thread CRUD models
│       ├── services/
│       │   └── thread_service.py    # In-memory thread storage
│       └── utils/
│           └── streaming.py         # SSE formatting utilities
│
├── frontend/                        # Next.js 16 React application
│   ├── Dockerfile                   # Node 20-alpine multi-stage build
│   ├── package.json                 # Node dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── app/
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Main page (Dashboard + Chat)
│   │   └── globals.css              # MD3 theme variables & animations
│   ├── components/
│   │   ├── Sidebar.tsx              # Left navigation rail
│   │   ├── Topbar.tsx               # Top toolbar
│   │   ├── TabBar.tsx               # Tab navigation
│   │   ├── KPICards.tsx             # Live KPI metrics (4 cards)
│   │   ├── DataTable.tsx            # Data table component
│   │   ├── TrendChart.tsx           # Chart visualization
│   │   ├── StrategyCard.tsx         # Strategy display card
│   │   └── chat/
│   │       ├── ChatPanel.tsx        # OpenUI ChatProvider wrapper
│   │       ├── ChatInput.tsx        # Multi-line textarea input
│   │       ├── MessageBubble.tsx    # Message renderer (Markdown, rich UI)
│   │       ├── SimulationCard.tsx   # Multi-step simulation display
│   │       └── SystemUpdate.tsx     # Status update component
│   └── lib/
│       └── api.ts                   # Backend API client
│
├── skills/                          # Shared skill definitions
│   ├── architect_and_planner/       # Planning skill (Maker role)
│   ├── software_construction/       # Coding skill (Maker role)
│   ├── quality_assurance/           # QA & testing skill (Checker role)
│   ├── github-ops/                  # Git operations skill (Executor role)
│   └── ...                          # Other utility skills
│
├── memory/                          # Project memory & context
│   ├── context.md                   # Current project state
│   ├── key-decisions.md             # Architecture Decision Records
│   └── dailylog.md                  # Daily activity log
│
├── scripts/                         # Utility & test scripts
│   ├── check-build.ps1              # Windows build checker
│   ├── check-build.sh               # Unix build checker
│   ├── test_cancel_msg.py           # Cancel message API test
│   └── unit_test_backend.py         # Backend unit tests
│
├── stitch/                          # Original HTML design prototype
│   ├── code.html                    # Static Tailwind CSS dashboard
│   └── screen.png                   # Design reference screenshot
│
├── docker-compose.yml               # Multi-container orchestration
├── .env                             # Environment variables (gitignored)
├── .gitignore                       # Git exclusions
├── GEMINI.md                        # AI assistant project context
├── OpenUI_spec.md                   # Original integration specification
└── README.md                        # Project README
```

---

## 5. Backend

### 5.1. FastAPI Application (`backend/app/main.py`)

The backend is a FastAPI application that serves as the gateway to the LangGraph agent orchestrator.

**Key Features:**
- **Lifespan management** with structured logging.
- **CORS middleware** configured for localhost and configurable frontend URLs.
- **SSE Streaming** for chat responses in OpenAI-compatible chunk format.
- **Thread Management** with full CRUD operations.
- **Dashboard Stats** API for live KPI data.

### 5.2. LangGraph Agent Graph (`backend/app/agents/graph.py`)

The core of SwMaster's intelligence is a compiled LangGraph state machine:

```
START → router → (conditional) → planner | maker | checker | executor | conductor | general → END
```

**Router Node:**
- Uses an LLM call with a classification prompt to determine user intent.
- Routes to one of six skill nodes based on the classification.
- Defaults to `general` for unrecognized intents.

**Skill Nodes:**
- Each node builds a system prompt by combining `SOUL.md + DUTIES.md + SKILL.md`.
- All nodes use `ChatGoogleGenerativeAI` with configurable Gemini model and temperature.
- After processing, each node terminates the graph for that turn (single-turn execution).

### 5.3. Agent State (`backend/app/agents/state.py`)

```python
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]  # Conversation history
    current_role: str       # Active SOD role (planner, maker, checker, executor)
    skill_context: str      # Additional context from skill definitions
    thread_id: str          # Conversation thread identifier
```

### 5.4. Skill Loader (`backend/app/agents/skills.py`)

Dynamically loads agent personality and skill instructions from the filesystem:
- `load_soul()` → reads `agents/sw-master-agent/SOUL.md`
- `load_duties()` → reads `agents/sw-master-agent/DUTIES.md`
- `load_skill_prompt(skill_id)` → reads the appropriate `skills/<folder>/SKILL.md`
- `build_system_prompt(skill_id)` → combines all three into a single system prompt

**Skill ID to Folder Mapping:**

| Skill ID  | Folder                    |
|-----------|---------------------------|
| planner   | `architect_and_planner`   |
| maker     | `software_construction`   |
| checker   | `quality_assurance`       |
| executor  | `github-ops`              |

### 5.5. Thread Service (`backend/app/services/thread_service.py`)

An in-memory thread storage manager (singleton) providing:
- Thread CRUD (create, list, get, update, delete).
- Message history per thread (append, retrieve).
- Cancel-and-edit: `pop_last_messages()` removes the last user/assistant pair and returns the user message for editing.

> **Note:** This is currently in-memory storage. Thread data is lost on server restart. A persistence layer (e.g., database) is planned for future milestones.

### 5.6. Streaming Utilities (`backend/app/utils/streaming.py`)

Provides SSE formatting functions:
- `format_sse_event(data)` → formats data as `data: {data}\n\n`
- `format_done_event()` → sends `data: [DONE]\n\n`
- `token_stream_to_sse()` → converts async token streams into OpenAI-compatible SSE events

### 5.7. Data Models

**Chat Models (`backend/app/models/chat.py`):**
- `ChatMessage` — role (system/user/assistant) + content
- `ChatRequest` — messages array + stream flag + optional thread_id
- `AgentInfo` / `SkillInfo` — agent metadata for the `/api/agents` endpoint

**Dashboard Models (`backend/app/models/dashboard.py`):**
- `DashboardStats` — activeSkills, sodCompliance, llmModel, agentStatus

**Thread Models (`backend/app/models/thread.py`):**
- `ThreadCreate` / `ThreadUpdate` / `Thread` / `ThreadListResponse`

---

## 6. Frontend

### 6.1. Application Structure

The frontend is a **Next.js 16** application using **React 19**, **Tailwind CSS 4**, and **OpenUI** for chat state management.

**Main Page (`frontend/app/page.tsx`):**
The page layout is split 65/35:
- **Left Panel (65%):** Dashboard with Topbar, TabBar, KPICards, DataTable, TrendChart, and StrategyCard.
- **Right Panel (35%):** Chat interface via `ChatPanel`.

### 6.2. Chat System

The chat implementation uses OpenUI's `ChatProvider` for state management and SSE streaming:

**`ChatPanel.tsx`:**
- Wraps the chat interface in OpenUI's `ChatProvider` with `openAIAdapter()`.
- Manages thread switching, new thread creation, and conversation history flyout.
- Handles auto-scrolling, message rendering, and streaming status indicators.

**`ChatInput.tsx`:**
- Multi-line textarea with auto-resizing (capped at 33% viewport height).
- **Shift+Enter** sends the message; **Enter** creates a new line.
- **Arrow Up** on empty input triggers edit of the last message.
- Auto-detects code input and switches to monospace font.

**`MessageBubble.tsx`:**
- Renders user messages (right-aligned, purple tint) and assistant messages (left-aligned, surface background).
- Hover actions: **Copy to clipboard** (assistant), **Edit** (last user message).
- Rich content rendering:
  - `[UPDATE:type:label:details]` → `SystemUpdate` component
  - JSON blocks with `"type": "simulation"` → `SimulationCard` component
  - Markdown formatting (bold, code blocks, inline code)

**`SimulationCard.tsx`:**
- Displays multi-step pipelines with status indicators (done ✓, active ●, todo ○).

**`SystemUpdate.tsx`:**
- Displays status notifications with type-based styling (success/info/warning).

### 6.3. Dashboard Components

| Component          | Description                                      |
|--------------------|--------------------------------------------------|
| `Sidebar.tsx`      | Fixed left navigation rail with icon buttons      |
| `Topbar.tsx`       | Top toolbar with breadcrumbs and actions          |
| `TabBar.tsx`       | Tab navigation for dashboard sections             |
| `KPICards.tsx`     | 4 live KPI cards fetched from `/api/dashboard/stats` (auto-refresh every 30s) |
| `DataTable.tsx`    | Data table for structured information display     |
| `TrendChart.tsx`   | Chart visualization component                    |
| `StrategyCard.tsx` | Strategy overview card                            |

### 6.4. API Client (`frontend/lib/api.ts`)

- `fetchAgentInfo()` → `GET /api/agents`
- `healthCheck()` → `GET /health`
- `getChatApiUrl()` → Returns the chat API URL for OpenUI's ChatProvider

---

## 7. Agent System

### 7.1. SwMaster Agent Identity (`agents/sw-master-agent/SOUL.md`)

SwMaster is defined as a **Senior Software Engineering Agent and Solutions Architect** with a knowledge base strictly based on SWEBOK v4. Key principles:

1. **Living Documentation** — maintains `memory/` directory with decision records.
2. **Visual Thinking** — generates Mermaid diagrams (class, ERD, sequence, use case).
3. **SWEBOK v4 Grounded** — modular design, maintainability, cohesion, low coupling.
4. **GitHub Integration** — reads code, analyzes Issues, proposes PRs, performs code reviews.
5. **Segregation of Duties** — strict role enforcement between Planner, Maker, Checker, Executor.

### 7.2. Segregation of Duties (`agents/sw-master-agent/DUTIES.md`)

| Role        | Authorized Skills                           | Responsibility                                    |
|-------------|---------------------------------------------|---------------------------------------------------|
| **Maker**   | `architect_and_planner`, `software_construction` | Specifications, diagrams, production code          |
| **Checker** | `quality_assurance`                         | TDD, code review, coverage, vulnerability testing  |
| **Executor**| `github_ops`                                | Branch management, commits, Pull Requests          |
| **Auditor** | `quality_assurance` (Audit Mode)            | Validates ADR compliance                           |

**Conflict Rules:**
1. **No Self-Review** — Maker cannot approve its own code.
2. **Strict TDD** — Production code only after Checker defines unit tests.
3. **Mandatory Human-in-the-Loop** — Executor cannot push directly to `main`.

### 7.3. Skill Definitions (`skills/`)

Each skill folder contains a `SKILL.md` with domain-specific instructions:

| Skill Folder              | Skill ID  | Description                                  |
|---------------------------|-----------|----------------------------------------------|
| `architect_and_planner`   | planner   | Requirements, SDD, Mermaid diagrams, ADRs    |
| `software_construction`   | maker     | Clean code generation from specifications     |
| `quality_assurance`       | checker   | TDD, code review, security audit, coverage    |
| `github-ops`              | executor  | Branch creation, commits, PR workflows        |

---

## 8. API Reference

### Health Check

```
GET /health
```

**Response:**
```json
{ "status": "ok", "model": "gemini-2.5-pro" }
```

---

### Agent Information

```
GET /api/agents
```

**Response:** Returns `AgentInfo` with name, version, description, skills list, and available roles.

---

### Chat (SSE Streaming)

```
POST /api/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Design a REST API for a todo app" }
  ],
  "stream": true,
  "thread_id": "optional-uuid"
}
```

**Response:** `text/event-stream` in OpenAI chat-completion chunk format.

```
data: {"id":"...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Here","role":"assistant"},"finish_reason":null}]}

data: {"id":"...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

---

### Thread Management

| Method   | Endpoint                                  | Description                          |
|----------|-------------------------------------------|--------------------------------------|
| `GET`    | `/api/threads`                            | List all threads (newest first)       |
| `GET`    | `/api/threads/{thread_id}`                | Get messages for a thread             |
| `POST`   | `/api/threads`                            | Create a new thread                   |
| `PATCH`  | `/api/threads/{thread_id}`                | Update thread title                   |
| `DELETE` | `/api/threads/{thread_id}`                | Delete a thread                       |
| `DELETE` | `/api/threads/{thread_id}/messages/last`  | Cancel & edit last message pair       |

---

### Dashboard Stats

```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "activeSkills": 4,
  "sodCompliance": 100,
  "llmModel": "gemini-2.5-pro",
  "agentStatus": "Active"
}
```

---

## 9. Design System — Aura Strategy

The UI implements a custom **"Aura Strategy"** design system built on Material Design 3 tokens:

### Color Palette

| Token                         | Value       | Usage                             |
|-------------------------------|-------------|-----------------------------------|
| `--primary`                   | `#4f1c9e`   | Primary actions, headers          |
| `--on-primary`                | `#ffffff`   | Text on primary                   |
| `--primary-container`         | `#673ab7`   | Contained primary elements        |
| `--surface`                   | `#fef7ff`   | Base background                   |
| `--surface-container`         | `#f3ebf7`   | Card backgrounds                  |
| `--surface-container-highest` | `#e7e0eb`   | Input field backgrounds           |
| `--secondary-container`       | `#e8def8`   | Active nav items                  |
| `--outline`                   | `#7b7484`   | Subtle borders                    |

### Typography

- **Body:** Inter (300–700 weights)
- **Code:** JetBrains Mono / system monospace
- **Icons:** Material Symbols Outlined (variable weight/fill)

### Effects

- **Glassmorphism:** `backdrop-blur-md` with semi-transparent backgrounds.
- **AI Pulse:** Gradient animation (`#4f1c9e → #24b2fe`) with blur, used for loading indicators.
- **Micro-Animations:** `fade-in` (0.3s), `slide-up` (0.4s), `pulse-dot` for status indicators.
- **Custom Scrollbar:** 4px thin, rounded, semi-transparent.

---

## 10. Deployment

### 10.1. Docker Compose (Local Development)

```bash
docker-compose up --build
```

**Services:**

| Service   | Port  | Container Base     | Health Check                |
|-----------|-------|--------------------|-----------------------------|
| backend   | 8000  | `python:3.12-slim` | `GET /health` every 10s     |
| frontend  | 3000  | `node:20-alpine`   | Depends on backend healthy  |

**Volume Mounts (Development):**
- `./agents` → `/agents:ro` (read-only agent definitions)
- `./skills` → `/skills:ro` (read-only skill definitions)
- `./backend/app` → `/app/app` (hot-reload backend code)

### 10.2. Manual Start

**Backend:**
```bash
cd backend
pip install -e .
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 10.3. Cloud Run (Production)

The architecture is designed for two-container deployment on Google Cloud Run:
1. **Backend Service:** `backend/Dockerfile` — Python FastAPI with LangGraph.
2. **Frontend Service:** `frontend/Dockerfile` — Next.js with multi-stage build (builder + runner).

> For production, the backend Dockerfile build context should be adjusted to the project root to include `agents/` and `skills/` directories in the image.

---

## 11. Environment Configuration

Copy `backend/.env.example` to `.env` in the project root:

```bash
cp backend/.env.example .env
```

| Variable         | Required | Default                  | Description                      |
|------------------|----------|--------------------------|----------------------------------|
| `GEMINI_API_KEY` | ✅       | —                        | Google Gemini API key            |
| `GITHUB_TOKEN`   | ❌       | —                        | GitHub PAT for executor skill    |
| `HOST`           | ❌       | `0.0.0.0`               | Backend bind address             |
| `PORT`           | ❌       | `8000`                   | Backend port                     |
| `FRONTEND_URL`   | ❌       | `http://localhost:3000`  | Allowed CORS origin              |
| `LLM_MODEL`      | ❌       | `gemini-2.5-pro`        | Gemini model identifier          |
| `LLM_TEMPERATURE`| ❌       | `0.2`                    | LLM response temperature         |

**Frontend Environment (`frontend/.env.local`):**

| Variable               | Default                  | Description                    |
|------------------------|--------------------------|--------------------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000`  | Backend API base URL           |

---

## 12. Architecture Decision Records

### ADR 001: LangGraph for Agent Orchestration
- **Decision:** Use LangGraph as the state machine for multi-agent workflows.
- **Rationale:** Provides deterministic control over agent transitions and easy SOD enforcement through conditional edges.
- **Status:** ✅ Approved (2026-03-25)

### ADR 002: SSE for Streaming Agent Responses
- **Decision:** Use Server-Sent Events for real-time LLM response streaming.
- **Rationale:** Unidirectional (ideal for LLM streaming), better automatic reconnection than WebSockets for this use case.
- **Status:** ✅ Approved (2026-03-25)

### ADR 003: OpenUI React Components
- **Decision:** Use OpenUI with MD3 Design Tokens for the chat interface.
- **Rationale:** Provides high-level chat hooks (`useThread`, `useThreadList`) and a polished design system compatible with the Aura Strategy theme.
- **Status:** ✅ Approved (2026-03-26)

---

## 13. SWEBOK v4 Compliance

Every action taken by SwMaster is mapped to a SWEBOK v4 knowledge area:

| SWEBOK Knowledge Area                | SwMaster Component           |
|--------------------------------------|------------------------------|
| Software Requirements                | Planner Node                 |
| Software Design                      | Planner / Architect Node     |
| Software Construction                | Maker Node                   |
| Software Testing & Quality           | Checker Node                 |
| Software Configuration Management    | Executor Node (GitHub Ops)   |
| Software Engineering Process         | Conductor Node               |
| Software Engineering Management      | Dashboard KPIs               |

---

## 14. Roadmap

### ✅ Milestone 1 — Command Center (Current)

- [x] Scaffold Backend (FastAPI + LangGraph)
- [x] Scaffold Frontend (Next.js 16 + React 19)
- [x] Implement LangGraph state machine with SOD routing
- [x] SSE streaming chat with OpenUI integration
- [x] Thread persistence (in-memory)
- [x] Dashboard with live KPI cards
- [x] Rich UI components (SimulationCard, SystemUpdate)
- [x] Docker Compose orchestration
- [x] Chat enhancements (cancel/edit, copy, multi-line input, Markdown rendering)

### 🔲 Milestone 2 — Persistence & Memory

- [ ] Database-backed thread storage (PostgreSQL / SQLite)
- [ ] Agent memory persistence across sessions
- [ ] Long-term context window management

### 🔲 Milestone 3 — Advanced Agent Interaction

- [ ] True token-by-token streaming from LangGraph (currently simulated)
- [ ] Multi-turn Conductor workflows (SDD-TDD pipeline execution)
- [ ] File attachment support in chat
- [ ] Agent skill activation UI

### 🔲 Milestone 4 — Production Deployment

- [ ] Google Cloud Run deployment (backend + frontend services)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Production logging and monitoring
- [ ] Authentication and access control
