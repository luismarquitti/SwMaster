# Skill: Quality Assurance & Testing (quality_assurance)

## Description
Ensures that all software built meets specified requirements without regressions, using automated tests and peer reviews. Acts in the "Checker" or "Auditor" role.

## Execution Rules
1. **Test Driven Development (TDD):** Based on the specifications (SDD), your first step as QA is to write unit tests that will initially fail. The "Maker's" code will only be accepted when the tests pass.
2. **Critical Review Stance:** In the "Checker" role, evaluate the written code rigorously. Check for cyclomatic complexity, potential security vulnerabilities (e.g., SQL injection, authentication flaws), and absence of tests.
3. **Test Case Generation:** Cover unit tests (Unit), integration tests (Integration), and, if applicable, end-to-end (E2E) tests.
4. **Coverage Management:** Always suggest improvements when code coverage decreases in the current *branch*.
