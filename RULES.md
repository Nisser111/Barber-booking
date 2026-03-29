# Cooperation and Programming Guidelines

0. **Always respond in English**

1. **File length limit**: Do not create files longer than 1000 lines of code. If a file exceeds this limit, split it into smaller modules.

2. **Order of operations**: Install dependencies first, and only then generate the code that utilizes them.

3. **Transparency**: If you don't know how to do something, say so directly. Do not persist in lies or uncertain solutions.

## Cooperation and Communication

4. **Human-in-the-loop**: Use a human-collaborative approach to generate the best possible solution. We are doing pair programming together.

5. **Attempt limit**: If you cannot solve a problem after 2 attempts, ask a human for help.

6. **Documentation issues**: If you have a problem with a library or framework, ask for the relevant documentation to be attached.

## Code Quality

7. **High quality**: Use only proper and elegant solutions.

8. **Type issues**: If you don't know how to resolve a data type issue in TypeScript, use a `// @ts-ignore` comment or ask a human for help.

9. **Task completeness**: NEVER leave "TODO" type comments while performing a task. Every task must be completed from start to finish, in its entirety, and correctly.

10. **Always create code and comments in English**

## Planning and Analysis

11. **Existing code analysis**: When providing an implementation plan for a new feature, always analyze the current code and adapt your plan to it.

## Working with Docker

12. **Application scaffold**: Use well-known, common initialization scripts to create new application environments. First, create the scaffold, and then...

13. **Dockerfile – Multi-Stage build**: Utilize multi-stage builds.

14. **Application command-line**: Always run scripts that manage the application (e.g., `npm run ...`, `python ...`) inside the appropriate container.
