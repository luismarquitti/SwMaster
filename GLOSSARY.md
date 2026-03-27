# SwMaster Domain Glossary

Standardized terminology aligned with the **GitAgent Standard** and **SWEBOK v4**.

## Core Taxonomy (GitAgent)

| Term | Definition | GitAgent Location |
| :--- | :--- | :--- |
| **Soul** | The agent's core identity, personality, and foundational approach. | `SOUL.md` |
| **Skill** | Atomic, reusable capability modules (e.g., `code-review`). | `skills/SKILL.md` |
| **Duty** | Specific responsibilities/tasks assigned to a role to enforce SOD. | `DUTIES.md` |
| **Workflow** | Deterministic, multi-step sequences chaining skills and tools. | `workflows/` |
| **Knowledge** | Hierarchical trees of external information the agent can query. | `knowledge/` |
| **Memory** | Persistent logs of past decisions, context, and runtime history. | `memory/` |

## Operational Concepts (SwMaster)

| Term | Definition | SWEBOK v4 Alignment |
| :--- | :--- | :--- |
| **Agent** | The high-level AI persona orchestrating the work. | Software Construction |
| **Node** | A single execution step in the LangGraph orchestration. | Software Design |
| **Thread** | A persistent workspace/conversation for a specific task. | Requirements |
| **Conductor** | The meta-node orchestrating complex SkillsFlows. | Engineering Process |

## Standard Usage Rules
- Use **"Skill"** when referring to the *capability* (e.g., Maker's construction skill).
- Use **"Duty"** when referring to the *responsibility* and SOD constraint.
- Use **"Workflow"** instead of "Procedure" or "Logic Flow".
- Use **"Soul"** when referring to the agent's behavioral identity/rules.

## Forbidden Terms
- "Bot" -> Use **Agent**
- "Session" -> Use **Thread**
- "Prompt" -> Use **Instruction** (if static) or **Context** (if dynamic)
