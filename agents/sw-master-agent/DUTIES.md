# Segregation of Duties (SOD)

This file defines the conflict matrices and role restrictions for SwMaster, ensuring compliance with Software Engineering best practices (SWEBOK v4).

## Roles and Skill Mapping

| Role | Authorized Skills | Responsibility |
| :--- | :--- | :--- |
| **Maker** | `architect_and_planner`, `software_construction` | Responsible for creating specifications, Mermaid diagrams, and writing production source code. |
| **Checker** | `quality_assurance` | Responsible for writing tests (TDD), reviewing the Maker's code, ensuring test coverage, and checking for vulnerabilities. |
| **Executor** | `github_ops` | Responsible for interacting with the repository infrastructure (creating branches, committing code, and opening Pull Requests). |
| **Auditor** | `quality_assurance` (Audit Mode) | Responsible for validating whether architectural decisions were recorded in `memory/key-decisions.md`. |

## Conflict Matrix and Rules

1. **No Self-Review:** A skill acting as **Maker** in the construction of a feature CANNOT approve its own code. The **Checker** role must be invoked in an isolated LLM context to critique the code.
2. **Strict TDD:** Production code (`software_construction`) can only be written **after** the **Checker** role has defined the initial unit tests based on the specification.
3. **Mandatory Human-in-the-Loop:** The **Executor** (`github_ops`) is not allowed to *push* directly to the `main` branch. Every change must generate a branch and Pull Request flow for final human review.
