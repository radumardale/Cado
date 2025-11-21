---
description: Analyze and implement a GitHub issue with comprehensive planning and incremental commits
---

# Work on GitHub Issue

Implement a GitHub issue with thorough analysis, planning, and incremental execution.

**Usage:** `/work-issue <issue-number>`

## Context

You are working on a NextJS project with a GitHub issue that needs to be resolved. The issue number is: $ARGUMENTS

## Initial Setup

1. **Read Project Context**
   - First, read the `CLAUDE.md` file to understand project conventions, architecture, and any special instructions
   - Review any coding standards, testing requirements, or deployment procedures mentioned

2. **Fetch Issue Details**
   - Use `gh issue view $ARGUMENTS --json title,body,comments,labels,assignees` to get complete issue information
   - Parse all comments to understand the full context and any discussion that has occurred
   - Note any labels that might indicate priority, type (bug/feature), or area of codebase

## Deep Analysis Phase

3. **Understand the Requirements**
   - Carefully analyze the issue description and all comments
   - Identify the core problem or feature request
   - List any acceptance criteria or success conditions mentioned
   - Note any constraints, dependencies, or related issues

4. **Codebase Investigation**
   - Search for relevant files, components, or modules related to this issue
   - Review existing implementation if this is a bug fix
   - Check for similar patterns in the codebase if this is a new feature
   - Identify any tests that might be related or need to be updated
   - Look for any configuration files, environment variables, or dependencies that might be involved
   - Review recent changes in related files using `git log` to understand recent context

5. **Technical Deep Dive**
   - Understand the current architecture and how the change fits in
   - Identify potential edge cases or complications
   - Consider impact on other parts of the system
   - Think about testing strategy (unit, integration, e2e)
   - Consider performance implications
   - Think about accessibility, security, or other cross-cutting concerns

## Clarification Phase

6. **Ask Clarifying Questions**
   - If there are any ambiguities or missing information, ask me specific questions
   - Present your understanding of the issue and confirm it's correct
   - Discuss any technical decisions or trade-offs that need to be made
   - Wait for my responses before proceeding

## Planning Phase

7. **Create Implementation Plan**
   - Break down the work into clear, logical steps
   - Each step should be small enough to be a single commit
   - Order steps to build incrementally (e.g., data model → API → UI → tests)
   - Include testing steps throughout, not just at the end
   - Identify any refactoring that should happen first

8. **Export Analysis (if complex)**
   - If the issue is complex (requiring 5+ commits or touching multiple systems), create a detailed markdown analysis document
   - Save it as `.claude/analysis/issue-$ARGUMENTS-analysis.md`
   - Include:
     - Problem statement
     - Current state analysis
     - Proposed solution with technical details
     - Implementation plan with commit breakdown
     - Testing strategy
     - Potential risks and mitigations
     - Alternative approaches considered

9. **Present the Plan**
   - Show me the step-by-step implementation plan
   - Explain your reasoning for the approach
   - Highlight any important decisions or trade-offs
   - **WAIT FOR MY APPROVAL before proceeding to implementation**

## Implementation Phase

10. **Execute with Incremental Commits**
    - After I approve the plan, work through each step methodically
    - For each item in the plan:
      - Implement the changes
      - Test that the changes work as expected
      - Create a clear, descriptive commit message following conventional commits format:
        - `feat(scope): add feature description` for new features
        - `fix(scope): fix bug description` for bug fixes
        - `refactor(scope): refactor description` for code improvements
        - `test(scope): test description` for test additions
        - `docs(scope): documentation description` for documentation
        - `chore(scope): task description` for maintenance tasks
      - Commit the changes with `git add` and `git commit`
    - Each commit should be atomic and functional (the codebase should work at each commit)
    - Run relevant tests after each commit to ensure nothing breaks

11. **Final Verification**
    - Run the full test suite if available
    - Verify the solution addresses all acceptance criteria from the issue
    - Check for any console errors or warnings
    - Ensure code follows project conventions from CLAUDE.md

## Completion

12. **Summary**
    - Provide a summary of what was implemented
    - List all commits created with their messages
    - Mention any follow-up work or related issues that should be created
    - Suggest the next steps (e.g., push to branch, create PR, update issue)

## Important Notes

- **Take your time with analysis** - understanding the problem thoroughly is more important than speed
- **Ask questions** - it's better to clarify than to implement the wrong solution
- **Think incrementally** - each commit should represent a logical unit of work
- **Test as you go** - don't wait until the end to verify your changes
- **Follow project conventions** - the CLAUDE.md file is your guide
- **Consider the bigger picture** - how does this change affect the rest of the system?
