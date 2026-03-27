# Segregation of Duties (SOD)

This file defines the conflict matrices and role restrictions for SwMaster, ensuring compliance with Software Engineering best practices (SWEBOK v4) and the GitAgent Standard.

## Roles and Skill Mapping

| Role | Authorized Skills | Responsibility |
| :--- | :--- | :--- |
| **Planner** | `architect_and_planner` | Responsible for requirements elicitation, SDD, Mermaid diagrams, and ADRs. |
| **Maker** | `software_construction` | Responsible for translating specifications into production-ready source code. |
| **Checker** | `quality_assurance` | Responsible for writing tests (TDD), code review, security audits, and coverage management. |
| **Executor** | `github_ops` | Responsible for repository infrastructure (branches, commits, PRS). |
| **Conductor** | `skills_orchestrator` | Meta-role responsible for multi-step SDD-TDD flows. |
| **Auditor** | `quality_assurance` (Audit Mode) | Responsible for validating decision record compliance in `memory/`. |

## Conflict Matrix and Rules

1. **No Self-Review:** A skill acting as **Maker** CANNOT approve its own code. The **Checker** role must be invoked in an isolated context to critique the code.
2. **Strict TDD:** Production code (**Maker**) can only be written **after** the **Checker** role has defined initial unit tests.
3. **Architecture First:** The **Maker** cannot implement features without an approved SDD/ADR from the **Planner**.
4. **Human-in-the-Loop:** The **Executor** is not allowed to push directly to `main`. Every change must use a Pull Request workflow.
