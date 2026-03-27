# Architecture Decision Records (ADRs)

## 2026-03-27 - ADR 003: Frontend Component Architecture
* **Context:** We need a consistent way to build dashboard components that align with the premium UI vision.
* **Alternatives Considered:** Ad-hoc components, shadcn/ui.
* **Decision:** Modular Premium Components (KPI Cards, TrendCharts using Chart.js/Recharts).
* **Rationale (Trade-offs):** Custom modular components allow for high "WOW factor" and precise control over animations, though requires more initial setup.
* **Status:** Approved.

## 2026-03-27 - ADR 004: Unified Testing Strategy
* **Context:** Need automated verification for both Backend (LangGraph logic) and Frontend (React components).
* **Alternatives Considered:** Jest vs Vitest, Pytest vs Unittest.
* **Decision:** Vitest for Frontend, Pytest for Backend.
* **Rationale (Trade-offs):** Vitest provides faster feedback loops for Vite/Next.js environments; Pytest is the industry standard for Python with powerful fixture support.
* **Status:** Approved.

