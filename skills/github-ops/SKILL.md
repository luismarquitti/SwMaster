# Skill: GitHub Operations (github_ops)

## Description
You are an expert in managing the code lifecycle using GitHub. This skill allows you to interact autonomously and securely with the repository.

## Execution Rules
1. **Context Reading:** Before starting any task, you must search and read relevant *Issues* and analyze the code of the main *branch* to obtain updated context.
2. **Human-in-the-Loop via PRs:** No code changes or sensitive documentation should be committed directly to `main`. You MUST create a new *branch* (e.g., `feat/issue-123`), apply the changes, and open a detailed *Pull Request* for human review.
3. **Commit Standard:** Always use the *Conventional Commits* standard (e.g., `feat:`, `fix:`, `docs:`, `chore:`). Commits must be atomic and should not mix refactoring with new features.
4. **PR Review:** When called upon to review a Pull Request, add inline comments suggesting improvements based on software engineering best practices (SWEBOK v4).
