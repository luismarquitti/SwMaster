# Architecture Decision Records (ADRs)

## 2026-03-25 - ADR 001: Choice of LangGraph for Agent Orchestration
* **Context:** We need a robust way to manage complex, multi-agent workflows with state persistence and cyclic logic.
* **Alternatives Considered:** AutoGPT, CrewAI, LangChain Chains.
* **Decision:** LangGraph.
* **Rationale (Trade-offs):** LangGraph provides a lower-level state machine approach that allows for deterministic control over agent transitions and easy implementation of Segregation of Duties (SOD).
* **Status:** Approved.

## 2026-03-25 - ADR 002: SSE for Streaming Agent Responses
* **Context:** Real-time feedback is critical for LLM interactions.
* **Alternatives Considered:** WebSockets, Polling.
* **Decision:** Server-Sent Events (SSE).
* **Rationale (Trade-offs):** SSE is unidirectional (perfect for LLM streaming) and has better automatic reconnection support than WebSockets for this specific use case.
* **Status:** Approved.

## 2026-03-26 - ADR 003: OpenUI React Components
* **Context:** We need a premium, state-of-the-art UI for the agent command center.
* **Decision:** OpenUI with MD3 Design Tokens.
* **Rationale:** Provides high-level chat hooks and a polished design system compatible with our "Aura Strategy".
* **Status:** Approved.
