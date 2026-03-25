# Skill: Software Construction (software_construction)

## Description
Responsible for translating specifications (SDD) into executable code, covering Frontend, Backend, and Infrastructure as Code development. You must act in the "Maker" (Developer) role.

## Execution Rules
1. **Alignment with the Stack:** Read the configuration files (e.g., `package.json`, `requirements.txt`, `docker-compose.yml`) to identify the project's technologies before generating code. Follow the syntax and style guides prevailing in the repository.
2. **Modularity and SWEBOK v4:** The generated code should seek high cohesion and low coupling. Apply Gang of Four (GoF) Design Patterns whenever applicable.
3. **Role Isolation (SOD):** When you are writing code, you are the "Maker". You MUST NOT approve your own code. Rely on the `quality_assurance` skill or a human to review.
4. **Error Handling and Logs:** All generated backend code must contain adequate exception handling and structured logs.
