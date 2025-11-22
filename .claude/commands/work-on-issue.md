---
description: Analyze and implement a GitHub issue with comprehensive planning and incremental commits
---

# Work on GitHub Issue

Implement a GitHub issue with thorough analysis, planning, and incremental execution.

**Usage:** `/work-issue <issue-number> [additional context]`

**Examples:**
- `/work-issue 123` - Standard workflow for issue #123
- `/work-issue 123 Backend API is already done, focus only on UI components`
- `/work-issue 45 "Database migration complete. Skip schema changes and implement business logic only"`
- `/work-issue 78 User registration works but email verification is broken - focus on that`

## Context

You are working on a NextJS project with a GitHub issue that needs to be resolved.

**Arguments provided:** `$ARGUMENTS`

The first token is the issue number. Any remaining text is additional context provided by the user about:
- What's already implemented or partially complete
- Specific scope or constraints for this work
- Areas to focus on or avoid
- Known issues or particular aspects to address

**IMPORTANT:** This command should be executed in **Plan Mode** for the analysis and planning phases. Use your extended thinking capabilities to deeply analyze the issue, codebase implications, and create a comprehensive implementation strategy. Switch to normal mode only after the plan is approved.

## Pre-Work Validation

**[Before fetching issue]**

0. **Environment & Branch Safety Check**
   - Run `git branch --show-current` to verify current branch
   - If on `main` or `develop`, STOP immediately and warn:

     ```
     ⚠️ CRITICAL: You're on the '{branch}' branch!

     According to CLAUDE.md Git Flow rules, we CANNOT work directly here.
     Direct commits to main/develop are forbidden.

     We need to create a feature branch first.
     ```

   - Check environment health:
     - Verify `.env.local` exists (for local development)
     - Check if `node_modules` exists (run `npm install` if missing)
     - For local dev: Check if MongoDB is accessible
   - Fetch issue title using `gh issue view $ARGUMENTS --json title --jq .title`
   - Create a URL-friendly slug from the issue title (lowercase, hyphens, max 50 chars)
   - Suggest branch name: `feature/issue-$ARGUMENTS-{slug}`
   - If not on a feature branch, offer to:

     ```
     I'll create and switch to: feature/issue-$ARGUMENTS-{slug}

     Steps:
     1. git checkout develop
     2. git pull origin develop
     3. git checkout -b feature/issue-$ARGUMENTS-{slug}

     Proceed? [y/n]
     ```

   - Wait for confirmation before creating branch
   - After branch creation, verify with `git branch --show-current`

## Parse Arguments

**[Extract Issue Number and User Context]**

Parse `$ARGUMENTS` to extract:
- **Issue Number**: First token (required)
- **Additional Context**: Everything after the first token (optional)

Store the additional context if provided. This context will be used to:
- Focus analysis on specific areas
- Skip already-completed work
- Apply mentioned constraints or requirements
- Prioritize particular aspects of the issue

If context is provided, display it clearly:
```
📋 User-Provided Context:
{additional context text}

This context will inform the analysis and planning phases.
```

## Initial Setup

1. **Read Project Context**
   - First, read the `CLAUDE.md` file to understand project conventions, architecture, and any special instructions
   - Review any coding standards, testing requirements, or deployment procedures mentioned

2. **Fetch Issue Details**
   - Use `gh issue view $ARGUMENTS --json title,body,comments,labels,assignees` to get complete issue information
   - Parse all comments to understand the full context and any discussion that has occurred
   - Note any labels that might indicate priority, type (bug/feature), or area of codebase

## Deep Analysis Phase

**[PLAN MODE - Use Extended Thinking]**

3. **Understand the Requirements**
   - Take your time to carefully analyze the issue description and all comments
   - **If user provided additional context:** Factor it prominently into your analysis
     - Respect scope limitations mentioned (e.g., "focus only on UI")
     - Acknowledge what's already complete to avoid duplicate work
     - Apply any constraints or specific requirements mentioned
     - Prioritize areas the user highlighted
   - Use extended thinking to explore multiple interpretations if the requirements are ambiguous
   - Identify the core problem or feature request
   - List any acceptance criteria or success conditions mentioned
   - Note any constraints, dependencies, or related issues
   - Consider what's NOT said but might be important

4. **Codebase Investigation**
   - **If user context mentions specific areas:** Start investigation there first
   - Search for relevant files, components, or modules related to this issue
   - Review existing implementation if this is a bug fix
   - Check for similar patterns in the codebase if this is a new feature
   - **If user mentioned work already complete:** Verify it and understand the current state
   - Identify any tests that might be related or need to be updated
   - Look for any configuration files, environment variables, or dependencies that might be involved
   - Review recent changes in related files using `git log` to understand recent context
   - Map out the dependency tree - what depends on what?
   - **Check for localization requirements:**
     - Does this change affect user-facing text?
     - Check `/messages/` for existing translation patterns
     - Verify if multilingual fields `{ro, ru, en}` are needed
   - **For API/backend changes:**
     - Review existing tRPC procedures in `/src/server/procedures/`
     - Check if authentication/authorization is needed
     - Identify Mongoose models in `/src/models/` that might be affected
   - **For UI changes:**
     - Check for reusable components in `/src/components/ui/`
     - Verify internationalized routing patterns in `/src/app/[locale]/`

5. **Technical Deep Dive**
   - Use extended thinking to explore multiple solution approaches
   - Understand the current architecture and how the change fits in
   - Identify potential edge cases or complications (think through at least 5 edge cases)
   - Consider impact on other parts of the system (ripple effects)
   - Think about testing strategy (unit, integration, e2e)
   - Consider performance implications (time complexity, memory, network calls)
   - Think about accessibility, security, or other cross-cutting concerns
   - Evaluate trade-offs between different implementation approaches
   - Consider backward compatibility and migration needs
   - Think about error handling and recovery scenarios

## Document Analysis

6. **Post Analysis Findings to Issue**
   - Create a comprehensive comment on the GitHub issue with your analysis findings
   - Use `gh issue comment $ARGUMENTS --body "$(cat << 'EOF'
[Analysis findings here]
EOF
)"`
   - Include in the comment:
     - **User-provided context** (if any) to document the scope/constraints
     - Summary of what you found in the codebase
     - Key files and components involved
     - Relevant context that wasn't in the original issue
     - Technical considerations discovered
     - Any dependencies or related systems affected
     - Edge cases identified
     - **How the user context influenced the analysis** (if applicable)
   - This serves as documentation for future reference and helps other team members understand the investigation

## Clarification Phase

7. **Ask Clarifying Questions**
   - If there are any ambiguities or missing information, ask me specific questions
   - Present your understanding of the issue and confirm it's correct
   - Discuss any technical decisions or trade-offs that need to be made
   - Wait for my responses before proceeding

## Planning Phase

**[CONTINUE PLAN MODE - Extended Thinking]**

8. **Create Implementation Plan**
   - Use extended thinking to explore the optimal sequence of changes
   - **If user provided context:** Adjust plan based on what's mentioned
     - Skip steps for work already completed
     - Focus plan on areas user highlighted
     - Respect scope constraints (e.g., backend-only, UI-only)
     - Address specific concerns or issues mentioned
   - Break down the work into clear, logical steps
   - Each step should be small enough to be a single commit
   - Order steps to build incrementally (e.g., data model → API → UI → tests)
   - Include testing steps throughout, not just at the end
   - Identify any refactoring that should happen first
   - Consider which steps could be done in parallel vs must be sequential
   - Think about rollback strategy if something goes wrong
   - Plan for feature flags if this is a large change

9. **Export Analysis (if complex)**
   - If the issue is complex (requiring 5+ commits or touching multiple systems), create a detailed markdown analysis document
   - Save it as `.claude/analysis/issue-$ARGUMENTS-analysis.md`
   - Include:
     - Problem statement and context
     - Current state analysis (what exists today)
     - Proposed solution with technical details
     - Architecture diagrams (in text/ASCII if helpful)
     - Implementation plan with commit breakdown
     - Testing strategy (what to test at each level)
     - Potential risks and mitigations
     - Alternative approaches considered (with pros/cons)
     - Performance and scalability considerations
     - Security implications
     - Documentation that needs updating
     - Estimated complexity/effort

10. **Present the Plan**
    - Show me the step-by-step implementation plan with your extended thinking summary
    - Explain your reasoning for the approach
    - Highlight any important decisions or trade-offs
    - Present alternative approaches you considered and why you chose this one
    - Note any assumptions you're making
    - **WAIT FOR MY APPROVAL before proceeding to implementation**
    - Be ready to iterate on the plan based on my feedback

11. **Post Implementation Plan to Issue**
    - Once I approve the plan, post it as a comment on the GitHub issue
    - Use `gh issue comment $ARGUMENTS --body "$(cat << 'EOF'

## Implementation Plan

[Plan details here]
EOF
)"`- Include in the comment:
     - **User-provided context** (if any) and how it shaped the plan
     - Brief overview of the approach
     - Step-by-step implementation plan (each step = one commit)
     - **Work being skipped** (if user mentioned something is already done)
     - Testing strategy
     - Estimated commits needed
     - Any risks or considerations
     - Use clear markdown formatting with checkboxes for each step:`markdown
       - [ ] Step 1: Description
       - [ ] Step 2: Description
     `
    - This creates a record of the planned approach and allows for team visibility

12. **Pre-Implementation Quality Baseline**
    - Before starting any code changes, establish a clean baseline:
    - Run `npm run typecheck` to ensure no existing TypeScript errors
    - Run `npm run build` to verify the project builds successfully
    - If either check fails:
      - **STOP**: Do not proceed with implementation
      - Report the failures to me
      - Ask if we should fix these issues first or if they're known/acceptable
    - Only proceed to implementation phase after baseline is clean
    - This ensures we start from a working state and can confidently attribute any new errors to our changes

## Implementation Phase

**[SWITCH TO NORMAL MODE - Execution Phase]**

After plan approval, switch to normal execution mode for faster, focused implementation.

13. **Execute with Incremental Commits**
    - After I approve the plan, work through each step methodically
    - For each item in the plan:
      - Implement the changes
      - **Special considerations:**
        - **If changes involve multilingual content:**
          - Ensure all three languages (ro, ru, en) are properly handled
          - Use the required format: `{ro: string, ru: string, en: string}`
          - Update translation files in `/messages/` if adding new user-facing text
          - Never leave any language missing or empty
        - **If changes involve tRPC procedures:**
          - Follow existing patterns in `/src/server/procedures/`
          - Maintain strict TypeScript typing
          - Add proper session validation for protected routes
          - Use consistent error handling patterns
        - **If changes involve Mongoose models:**
          - Include TypeScript interfaces
          - Use nanoid (8 chars) for custom IDs
          - Enable timestamps on all models
          - Add text normalization for searchable fields if needed
        - **If changes involve UI components:**
          - Check for and use existing components from `/src/components/ui/`
          - Follow internationalized routing patterns in `/src/app/[locale]/`
          - Ensure accessibility standards are maintained
      - Test that the changes work as expected (manual testing or running specific tests)
      - **Quality checks (automated by Husky pre-commit hook):**
        - Husky hook automatically runs when you commit:
          - Docs/config only: Skips all checks
          - Code changes: Runs typecheck + Prettier formatting
          - Critical paths: Also runs full build (server/models/lib/routing)
        - If checks fail:
          - Fix the issues immediately
          - Re-attempt commit (hook runs again)
          - Only commits when checks pass
        - Hook can be bypassed in emergencies: `git commit --no-verify` (not recommended)
      - Create a clear, descriptive commit message following conventional commits format:
        - `feat(scope): add feature description` for new features
        - `fix(scope): fix bug description` for bug fixes
        - `refactor(scope): refactor description` for code improvements
        - `test(scope): test description` for test additions
        - `docs(scope): documentation description` for documentation
        - `chore(scope): task description` for maintenance tasks
      - Commit the changes with `git add` and `git commit`
    - Each commit should be atomic and functional (the codebase should work at each commit)
    - All commits must pass typecheck and build before being created

14. **Final Verification**
    - Run the full test suite if available
    - Verify the solution addresses all acceptance criteria from the issue
    - Check for any console errors or warnings
    - Ensure code follows project conventions from CLAUDE.md
    - **Final quality check:**
      ```bash
      npm run typecheck && npm run build
      ```
    - Must pass before proceeding to PR creation
    - **Create documentation if needed:**
      - For complex features, create documentation in `/docs/features/`
      - For significant fixes, document in `/docs/fixes/`
      - Include:
        - Overview of the change
        - Technical decisions made
        - Setup/configuration steps if applicable
        - Known limitations or future improvements
        - Examples of usage

## Pull Request Creation

15. **Create and Push PR**
    - Push the feature branch to origin:
      ```bash
      git push -u origin feature/issue-$ARGUMENTS-{slug}
      ```
    - Create PR to `develop` branch (default target per CLAUDE.md):
      ```bash
      gh pr create --base develop --title "{conventional-commit-style-title}" --body "$(cat << 'EOF'
      ```

## TLDR

{One paragraph summary of what was implemented and why}

## Changes Made

{Bullet list of main changes:}

- Added/Modified: {description}
- Fixed: {description}
- Updated: {description}

## Related Issue

Closes #$ARGUMENTS

## Implementation Details

{Brief technical explanation of the approach taken}

## Commits

{List each commit with its message}

- {commit-hash}: {commit-message}
- {commit-hash}: {commit-message}

## Testing

{What was tested and how:}

- ✅ TypeScript compilation passes
- ✅ Build completes successfully
- ✅ {Manual testing performed}
- ✅ {Any other validation done}

## Documentation

{If documentation was created, link it here}

- See `/docs/features/{doc-name}.md` for details

## Checklist

- [ ] Code follows project conventions
- [ ] All commits pass typecheck and build
- [ ] Translations updated for ro/ru/en (if applicable)
- [ ] Documentation created/updated (if needed)
- [ ] Ready for review

{Use emojis sparingly, e.g., ✨ for features, 🐛 for fixes, 📝 for docs}
EOF
)"
`     - After PR creation, add PR link to the original GitHub issue:
      `bash
gh issue comment $ARGUMENTS --body "PR created: {pr-url}"

```- Display the PR URL to me

## Completion

16. **Summary**
    - Provide a summary of what was implemented
    - List all commits created with their messages
    - Show the PR link and status
    - Mention any documentation created (with links)
    - Mention any follow-up work or related issues that should be created
    - Suggest the next steps:
      - Request review from specific team members (if known)
      - Monitor CI/CD pipeline once merged
      - Test in staging environment
      - Update any related documentation or issues

## Important Notes

- **NEVER commit directly to main or develop** - Always work on feature branches per Git Flow
- **Quality checks are automatic** - Husky pre-commit hooks run appropriate checks based on changed files
- **Use Plan Mode for analysis and planning** - Extended thinking capabilities are crucial for thorough analysis
- **Switch to normal mode for implementation** - Once the plan is approved, execution is faster in normal mode
- **Take your time with analysis** - Understanding the problem thoroughly is more important than speed
- **Ask questions** - It's better to clarify than to implement the wrong solution
- **Think incrementally** - Each commit should represent a logical unit of work
- **Test as you go** - Don't wait until the end to verify your changes
- **Follow project conventions** - The CLAUDE.md file is your guide
- **Respect localization** - Always handle ro/ru/en for user-facing content
- **Use existing patterns** - Follow tRPC, Mongoose, and component patterns from the codebase
- **Document your thinking** - Analysis documents and PR descriptions are valuable for the team
- **All docs go in /docs/** - Never create documentation files elsewhere
- **PRs target develop** - Not main, unless it's a hotfix (in which case target both)
```
