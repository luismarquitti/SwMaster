# SwMaster Domain Glossary

Standardized terminology to ensure AI Agent consistency and SWEBOK v4 alignment.

## Core Concepts

| Term | Definition | SWEBOK v4 Alignment |
| :--- | :--- | :--- |
| **Agent** | The autonomous software engineering entity (SwMaster). | Software Construction |
| **Skill** (Role) | A specialized capability assigned to the Agent (e.g., Planner, Maker). Matches an internal SOD Duty. | Professional Practice |
| **Duty** | An explicit constraint or responsibility defining SOD boundaries. | Software Quality |
| **Node** | A single step in the LangGraph orchestration (e.g., `planner_node`). | Software Design |
| **Thread** | A persistent conversation state between a human and SwMaster. | Requirements |
| **Conductor** | The meta-node responsible for multi-step workflow orchestration. | Engineering Process |

## Standard Terms (Use These)
- Use **"Skill"** when referring to functional capabilities (Planner, Maker).
- Use **"Duty"** when referring to SOD rules.
- Use **"Thread"** instead of "Conversation" or "Session".
- Use **"Agent"** to refer to the high-level AI persona.

## Forbidden Terms (Avoid These)
- "Bot" (Use "Agent")
- "Script" (Use "Logic" or "Skill")
- "User Session" (Use "Thread")
