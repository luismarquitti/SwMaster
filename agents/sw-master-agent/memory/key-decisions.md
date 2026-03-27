# Architecture Decision Records (ADRs)

## 2026-03-24 - ADR 001: Agent Orchestration Framework
* **Context:** We need a robust way to orchestrate multi-agent workflows with state management and streaming.
* **Alternatives Considered:** CrewAI, Autogen, Custom LangChain.
* **Decision:** LangGraph.
* **Rationale (Trade-offs):** LangGraph provides fine-grained control over cyclic graphs and state, which is essential for SWEBOK-aligned engineering processes.
* **Status:** Approved.

## 2026-03-26 - ADR 002: Frontend Framework Selection
* **Context:** The initial prototype used vanilla HTML/Tailwind; we need a scalable React framework for OpenUI components.
* **Alternatives Considered:** Vite, CRA, Next.js.
* **Decision:** Next.js.
* **Rationale (Trade-offs):** Next.js offers built-in routing, API routes, and excellent integration with modern UI components, speeding up the implementation of the SwMaster dashboard.
* **Status:** Approved.

