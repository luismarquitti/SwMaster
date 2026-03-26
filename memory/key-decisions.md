# Architecture Decision Records (ADRs)

## [Date] - ADR 001: Choice of Database
* **Context:** We need to store high-dimensional vectors for AI functionality, in addition to standard relational data.
* **Alternatives Considered:** MongoDB, Supabase (PostgreSQL with pgvector).
* **Decision:** Supabase (PostgreSQL).
* **Rationale (Trade-offs):** pgvector allows semantic search in the same relational database, reducing operational complexity, although the HNSW index requires more RAM.
* **Status:** Approved.
* **Context Diagram:**
  ```mermaid
  graph TD;
      API[FastAPI Backend] -->|Read/Write + pgvector| DB[(Supabase PostgreSQL)];
  ```
