---
description: Review PR comments, decide which to address, respond to others, and implement changes with atomic commits
---

# Review PR Comments

Analyze PR comments, categorize them, implement accepted changes, and respond to declined comments.

**Usage:** `/review-pr-comments <pr-number-or-url>`

## Context

You are reviewing comments on a Pull Request. The PR identifier is: $ARGUMENTS

**IMPORTANT:** This command should be executed in **Plan Mode** for the analysis and evaluation phases. Use your extended thinking capabilities to carefully evaluate each comment and create a comprehensive implementation strategy. Switch to normal mode only after the plan is approved.

## PR Identification

0. **Parse PR Input**
   - If $ARGUMENTS is a URL, extract the PR number from it
   - If $ARGUMENTS is just a number, use it directly as the PR number
   - Store as `PR_NUMBER` for use throughout the command
   - Verify the PR exists: `gh pr view $PR_NUMBER`

## Initial Setup

1. **Read Project Context**
   - First, read the `CLAUDE.md` file to understand project conventions
   - Review coding standards, testing requirements, and quality expectations
   - Note any specific patterns or architectural decisions

2. **Fetch PR Details**
   - Get comprehensive PR information:
     ```bash
     gh pr view $PR_NUMBER --json title,body,author,baseRefName,headRefName,state,number,isDraft
     ```
   - Check if PR is in draft state
   - Store PR metadata for later use

3. **Extract and Fetch Original Issue**
   - Parse PR body to find issue reference:
     - Look for patterns: "Closes #123", "Fixes #123", "Resolves #123"
     - Also check for full URLs to issues
   - If issue number found:
     ```bash
     gh issue view {ISSUE_NUMBER} --json title,body,comments,labels --jq '.'
     ```
   - Store issue context:
     - Original problem statement
     - Acceptance criteria
     - All discussion in issue comments
     - Labels (bug/feature/etc)
   - If no issue found:
     - Warn that we're missing context
     - Ask if I want to provide an issue number manually
     - Proceed with limited context if confirmed

4. **Find Implementation Plan in Issue**
   - Search through issue comments for the implementation plan
   - Look for comments that contain:
     - "## Implementation Plan" heading
     - Checkbox lists with steps
     - Commit breakdown
   - If found:
     - Parse the approved plan
     - Use it as the source of truth for scope decisions
     - Store plan for reference in responses
   - If not found:
     - Note that no formal plan exists
     - Will need to infer scope from issue description

5. **Fetch ALL PR Comments and Reviews**
   - Fetch code review comments (line-specific):
     ```bash
     gh api repos/:owner/:repo/pulls/$PR_NUMBER/comments --jq '.[] | {
       id: .id,
       author: .user.login,
       body: .body,
       path: .path,
       line: .line,
       created_at: .created_at,
       in_reply_to_id: .in_reply_to_id
     }'
     ```
   - Fetch general PR conversation comments:
     ```bash
     gh api repos/:owner/:repo/issues/$PR_NUMBER/comments --jq '.[] | {
       id: .id,
       author: .user.login,
       body: .body,
       created_at: .created_at
     }'
     ```
   - Fetch PR reviews (overall review comments):
     ```bash
     gh api repos/:owner/:repo/pulls/$PR_NUMBER/reviews --jq '.[] | {
       id: .id,
       author: .user.login,
       state: .state,
       body: .body,
       submitted_at: .submitted_at
     }'
     ```
   - Combine and organize all comments chronologically
   - Filter out empty bodies and bot comments
   - Note which comments are threads vs standalone

6. **Check Current Branch and Checkout PR Branch**
   - Check current branch: `git branch --show-current`
   - Get the head branch name from PR info
   - If not already on the PR branch:
     ```bash
     git fetch origin
     git checkout {head-branch-name}
     git pull origin {head-branch-name}
     ```
   - If already on PR branch:
     - Just pull latest: `git pull origin {head-branch-name}`
   - Verify we're on the correct branch with latest changes

7. **Quality Baseline Check**
   - Before analyzing comments, establish a clean baseline:
   - Run `npm run typecheck` to check for existing TypeScript errors
   - Run `npm run build` to verify the project builds successfully
   - If either check fails:
     - **STOP**: Report the failures
     - These are pre-existing issues on the PR branch
     - Ask if we should:
       1. Fix these first before addressing comments
       2. Note them and proceed (they're not related to comments)
       3. Abort and ask the PR author to fix first
   - Only proceed to comment analysis after decision is made
   - This ensures we know the starting state of the PR

## Comment Analysis Phase

**[PLAN MODE - Use Extended Thinking]**

8. **Categorize and Evaluate Comments with Full Context**
   - For each comment, analyze using ALL available context:
     - **Original issue context:**
       - What problem was this PR supposed to solve?
       - What were the original requirements/acceptance criteria?
       - What was discussed in issue comments?
       - What scope was agreed upon?
     - **Implementation plan (if exists):**
       - Was this approach approved in the plan?
       - Does the comment suggest deviation from the plan?
       - Is this concern already addressed in the plan?
     - **Project conventions (CLAUDE.md):**
       - Does the comment align with project standards?
       - Is this a valid concern per our conventions?
   - For each comment, analyze:
     - **Type of comment:**
       - Code quality suggestion
       - Bug report or potential issue
       - Architecture/design feedback
       - Nitpick (style, naming, formatting)
       - Question or clarification request
       - Positive feedback (no action needed)
       - Duplicate/redundant comment
       - Scope creep (suggesting features beyond original issue)
     - **Validity:** Is the comment correct/applicable?
     - **Scope alignment:** Does it align with the original issue and approved plan?
     - **Impact:** High/Medium/Low impact on code quality
     - **Effort:** Easy/Medium/Hard to implement
     - **Project alignment:** Does it align with CLAUDE.md conventions?
   - Use extended thinking to consider:
     - Technical merit of each suggestion
     - Consistency with existing codebase patterns
     - Alignment with original issue requirements
     - Whether it contradicts the approved implementation plan
     - Potential side effects of implementing changes
     - Whether the comment reveals a deeper issue
     - Cost/benefit of addressing vs. not addressing
     - Whether this should be addressed now or in a follow-up

9. **Create Comment Classification**
   - Organize comments into categories:
     - **MUST ADDRESS** (blocking issues, bugs, security concerns, breaks original requirements)
     - **SHOULD ADDRESS** (valid improvements that align with scope, good suggestions)
     - **COULD ADDRESS** (nice-to-haves, minor improvements within scope)
     - **WON'T ADDRESS** (out of scope per original issue, disagree with rationale, already addressed, contradicts approved plan)
     - **NEED CLARIFICATION** (unclear what's being requested)
   - For each comment, document:
     - Comment ID/reference
     - Author
     - File and line (if applicable)
     - Comment text (summary)
     - Classification (MUST/SHOULD/COULD/WON'T/CLARIFY)
     - **Reasoning for classification WITH CONTEXT:**
       - Reference original issue if relevant
       - Reference implementation plan if relevant
       - Reference CLAUDE.md if relevant
       - Explain scope considerations
     - Estimated effort if addressing
     - Implementation approach (brief)

## Evaluation Presentation

10. **Present Comment Evaluation with Context**
    - First, provide a context summary:

      ```markdown
      ## Context Summary

      **Original Issue:** #{ISSUE_NUMBER} - {issue title}

      - **Problem:** {brief description of what the issue was solving}
      - **Scope:** {key scope points from issue}
      - **Implementation Plan:** {Found/Not found - if found, link to issue comment}

      **PR Details:**

      - **Branch:** {head-branch-name}
      - **Status:** {Draft/Ready for Review}
      - **Base Branch:** {base-branch-name}

      **Quality Baseline:** {Passed/Failed with details}
      ```

    - Then show a clear table or structured list of all comments with classifications:

      ```markdown
      ## Comment Evaluation ({X} total comments)

      ### MUST ADDRESS (2 comments)

      1. **[@username] security-middleware.ts:45**

         > "This exposes user emails without sanitization"
         - **Classification:** MUST ADDRESS
         - **Reasoning:** Security vulnerability - PII exposure. This breaks the security requirements from the original issue.
         - **Context:** Original issue #123 specifically mentioned protecting user data.
         - **Effort:** Easy
         - **Approach:** Add email sanitization helper

      2. **[@username] api/route.ts:89**
         > "Missing error handling for database failures"
         - **Classification:** MUST ADDRESS
         - **Reasoning:** Could cause unhandled exceptions. This was part of the approved implementation plan (Step 3).
         - **Context:** Implementation plan included "Add proper error handling"
         - **Effort:** Medium
         - **Approach:** Wrap in try-catch, return proper error response

      ### SHOULD ADDRESS (3 comments)

      3. **[@username] component.tsx:23**
         > "This could be optimized with useMemo"
         - **Classification:** SHOULD ADDRESS
         - **Reasoning:** Valid performance improvement, aligns with CLAUDE.md code quality standards
         - **Context:** Doesn't impact original issue scope, but improves code quality
         - **Effort:** Easy
         - **Approach:** Wrap calculation in useMemo hook

      [... similar format ...]

      ### WON'T ADDRESS (2 comments)

      5. **[@username] component.tsx:12**

         > "Consider using a different state management library"
         - **Classification:** WON'T ADDRESS
         - **Reasoning:** Out of scope for this PR; would require major refactor. Original issue #123 was specifically about fixing the login bug, not architectural changes.
         - **Context:** The approved implementation plan (link) used React Context, which was reviewed and approved.
         - **Response:** "This is outside the scope of issue #123, which focused on fixing the login bug. Per the approved implementation plan [link], we agreed to use React Context to maintain consistency with the existing auth system. We can discuss this architectural change separately."

      6. **[@username] api/users.ts:67**
         > "We should add pagination here"
         - **Classification:** WON'T ADDRESS
         - **Reasoning:** Feature addition beyond the original issue scope. Issue #123 was about fixing the user update endpoint, not adding pagination.
         - **Context:** Original issue didn't mention pagination; this would be scope creep.
         - **Response:** "Great suggestion! However, this wasn't part of the original requirements in issue #123. I've created a follow-up issue #XXX to track this improvement."
      ```

    - Provide summary statistics:
      - Total comments: X
      - Must address: X (Y are from approved plan, Z are new issues)
      - Should address: X
      - Could address: X
      - Won't address: X (A are out of scope, B contradict plan)
      - Need clarification: X

11. **Request Feedback and Adjustments**
    - **WAIT FOR MY REVIEW OF THE EVALUATION**
    - Ask:

      ```
      Please review my comment evaluation above. I've used the context from:
      - Original issue #{ISSUE_NUMBER}
      - Implementation plan (if found)
      - CLAUDE.md conventions

      Let me know if you want to:

      1. Move comments between categories (e.g., SHOULD → WON'T)
      2. Add comments I missed or miscategorized
      3. Change reasoning or implementation approach
      4. Adjust priorities
      5. Modify response text for WON'T ADDRESS items

      Once you approve the evaluation, I'll proceed to:
      - Respond to WON'T ADDRESS comments (with context references)
      - Create implementation plan for MUST/SHOULD/COULD ADDRESS comments

      What changes would you like to make? (or type "approve" to proceed)
      ```

    - Wait for my input and incorporate any changes
    - Be ready to iterate multiple times if needed

## Planning Phase

**[CONTINUE PLAN MODE - Extended Thinking]**

12. **Create Implementation Plan**

- After evaluation is approved, create a detailed plan for addressing accepted comments
- Group comments strategically:
  - **Atomic commits:** Each significant comment gets its own commit
  - **Grouped commits:** Multiple trivial/related comments (same file, same type) can share a commit
- Plan structure:

  ```markdown
  ## Implementation Plan

  ### Commit 1: Fix email sanitization vulnerability

  - Addresses: Comment #1 by @username
  - Files: src/middleware/security-middleware.ts, src/lib/sanitize.ts
  - Changes:
    - Create sanitization helper in lib/sanitize.ts
    - Apply sanitization in security middleware
    - Add unit tests for sanitizer
  - Tests: Unit tests for sanitization logic
  - Estimated complexity: Easy

  ### Commit 2: Add error handling for database operations

  - Addresses: Comment #2 by @username
  - Files: src/api/route.ts
  - Changes:
    - Wrap database calls in try-catch
    - Return proper HTTP error responses
    - Add logging for errors
  - Tests: Test error scenarios
  - Estimated complexity: Medium

  ### Commit 3: Minor code quality improvements

  - Addresses: Comments #5, #7, #9 by @username (grouped - all trivial)
  - Files: Multiple files
  - Changes:
    - Rename variable for clarity (comment #5)
    - Fix typo in comment (comment #7)
    - Add missing JSDoc (comment #9)
  - Tests: None needed (cosmetic changes)
  - Estimated complexity: Easy
  ```

- Consider:
  - Logical ordering of commits (dependencies)
  - Which commits require quality checks
  - Which commits affect multiple systems
  - Whether any refactoring should happen first

9. **Present Implementation Plan**
   - Show the complete plan with all commits
   - Explain the grouping strategy
   - Highlight any dependencies or risks
   - **WAIT FOR MY APPROVAL**
   - Be ready to adjust commit grouping if requested

## Response Phase

**[SWITCH TO NORMAL MODE - Execution Phase]**

13. **Respond to WON'T ADDRESS Comments**
    - For each comment classified as WON'T ADDRESS:
      - Craft a respectful, clear explanation with proper context
      - Reference the original issue and/or implementation plan when relevant
      - Use GitHub's PR comment reply feature:
        ```bash
        gh api repos/:owner/:repo/pulls/$PR_NUMBER/comments/{comment_id}/replies \
          -f body="**Response:**
        ```

{Explanation with context references}

{Suggest alternatives if applicable}"

````- Keep responses professional and constructive: - Acknowledge the feedback - Explain the reasoning clearly with context - Reference original issue/plan when applicable - Suggest alternatives or future work if appropriate - Thank them for the review

    - Example responses with context:
      - **Out of scope (with issue reference):**
        ```
        Thanks for this suggestion! However, this is outside the scope of issue #123,
        which specifically focused on [original goal]. Per the approved implementation
        plan [link to issue comment], we agreed to [approach].

        I've created a follow-up issue #XXX to track this improvement separately.
        Would you be interested in collaborating on that?
        ```

      - **Contradicts approved plan:**
        ```
        I appreciate this architectural feedback! However, per the implementation plan
        approved in issue #123 [link], we agreed to use [approach] to maintain
        consistency with [existing system]. This decision was made after considering
        [trade-offs discussed in issue].

        If you feel strongly about this, we could revisit the approach in the issue
        discussion. Happy to set up a call to discuss further.
        ```

      - **Already addressed in original issue:**
        ```
        Great catch! This was actually discussed in the original issue #123 [link to
        specific comment]. We decided to [decision] because [reasoning from issue
        discussion]. The current implementation follows that agreement.

        Let me know if you have concerns about that decision!
        ```

      - **Not applicable per CLAUDE.md:**
        ```
        Thanks for the suggestion! However, per our project conventions in CLAUDE.md
        [specific section], we [convention]. This aligns with [reasoning from CLAUDE.md].

        The current implementation follows these established patterns to maintain
        consistency across the codebase.
        ```

      - **Will handle in follow-up:**
        ```
        Excellent point! This is a valid improvement, but it's beyond the scope of
        the current PR which addresses issue #123 [link]. To keep this PR focused
        and reviewable, I've created issue #XXX to track this enhancement.

        Would you like to review that follow-up PR when ready?
        ```

14. **Respond to NEED CLARIFICATION Comments**
    - For comments that were unclear:
      - Ask polite, specific questions
      - Provide context for why clarification is needed
      - Reference the original issue if it helps clarify intent
      - Use GitHub PR comments to reply

## Implementation Phase

**[CONTINUE NORMAL MODE - Focused Execution]**

12. **Execute Implementation Plan**
    - Work through each planned commit in order
    - For each commit:
      - Make the necessary code changes
      - **Apply project-specific checks:**
        - If multilingual content: ensure ro/ru/en fields are complete
        - If tRPC changes: follow existing patterns
        - If Mongoose models: maintain conventions
        - If UI components: check for reusable components
      - Test the changes manually or run relevant tests
      - **Quality checks (automated by Husky pre-commit hook):**
        - Husky hook automatically runs when you commit:
          - **Instant** for docs/config only changes
          - **5-15s** incremental TypeScript checks for code changes
          - **30-60s** full build for critical path changes (server/models/lib)
        - If checks fail:
          - Fix the issues immediately
          - Re-attempt commit (hook runs again)
          - Only commits when checks pass
        - Hook can be bypassed in emergencies: `git commit --no-verify` (not recommended)
      - Create commit message referencing the comment(s):

        ```
        fix(scope): address PR comment - {brief description}

        Addresses comment by @username:
        {quote relevant part of comment}

        Changes:
        - {change 1}
        - {change 2}
        ```

      - Commit with `git add` and `git commit`
    - After each commit:
      - Reply to the addressed comment on GitHub:
        ```bash
        gh pr review $PR_NUMBER --comment --body "✅ Addressed in commit {hash}
        ```

{Brief explanation of what was changed}"
``` - This creates traceability between commits and comments

13. **Final Verification**
    - Run full quality checks:
      ```bash
      npm run typecheck && npm run build
      ```
    - Verify all addressed comments have been properly resolved
    - Check that no new issues were introduced
    - Ensure all changes align with CLAUDE.md conventions

14. **Push Changes**
    - Push all commits to the PR branch:
      ```bash
      git push origin {head-branch-name}
      ```
    - GitHub will automatically update the PR

## Completion

15. **Post Comprehensive Summary Comment on PR**
    - Post a detailed summary comment on the PR with full context and traceability:
      ```bash
      gh pr comment $PR_NUMBER --body "## PR Comments Review Complete
      ```

Thank you all for the thorough review! Here's a comprehensive summary:

### 📋 Context

**Original Issue:** Closes #{ISSUE_NUMBER} - {issue title}
**Implementation Plan:** [Link to approved plan in issue]

### ✅ Addressed ({X} comments)

1. **[@username] {file}:{line}**

   > {Brief quote of comment}
   - **Resolution:** Fixed in commit \`{hash}\`
   - **Changes:** {Brief description of what was changed}

2. **[@username] {file}:{line}**
   > {Brief quote of comment}
   - **Resolution:** Fixed in commit \`{hash}\`
   - **Changes:** {Brief description of what was changed}

[... continue for all addressed comments ...]

### 💬 Explained/Declined ({X} comments)

1. **[@username] General comment**

   > {Brief quote}
   - **Reason:** Out of scope for issue #{ISSUE_NUMBER}
   - **Context:** [Link to relevant issue discussion]
   - **Follow-up:** Created issue #{XXX} to track separately

2. **[@username] {file}:{line}**
   > {Brief quote}
   - **Reason:** Aligns with approved implementation plan
   - **Context:** [Link to plan in issue]

[... continue ...]

### 📊 Summary

- **Total commits:** {X}
- **Comments addressed:** {X}/{total}
- **Quality checks:** All commits pass typecheck ✓ and build ✓
- **Scope alignment:** All changes align with issue #{ISSUE_NUMBER}
- **Tests:** {Test status}

### 🔄 Next Steps

Ready for re-review! I've requested reviews from all previous reviewers.

{If any follow-up issues were created, list them here:}
**Follow-up Issues Created:**

- Issue #{XXX}: {Description}
- Issue #{YYY}: {Description}
  "
````

16. **Request Re-review from Reviewers**
    - Get list of reviewers who commented:
      ```bash
      gh api repos/:owner/:repo/pulls/$PR_NUMBER/reviews --jq '[.[] | .user.login] | unique | .[]'
      ```
    - Request re-review from each reviewer:
      ```bash
      gh pr edit $PR_NUMBER --add-reviewer {username}
      ```
    - This notifies reviewers that their comments have been addressed
    - If multiple reviewers, request from all of them
    - Note: This will trigger GitHub notifications

17. **Create Follow-up Issues if Needed**
    - For any out-of-scope suggestions that merit future work:
    - Create new issues using `gh issue create`:
      ```bash
      gh issue create --title "Enhancement: {brief description}" --body "## Context
      ```

This suggestion came from PR #{PR_NUMBER} review:

{Quote the original comment}

## Proposed Enhancement

{Description of the suggested improvement}

## Rationale

While this is a good suggestion, it was outside the scope of issue #{ORIGINAL_ISSUE} which focused on {original scope}. Creating this separate issue to track it properly.

## Related

- Original issue: #{ORIGINAL_ISSUE}
- PR where discussed: #{PR_NUMBER}
- Suggested by: @{reviewer_username}
  "

  ```- Link back to these new issues in PR comments - Tag them appropriately (enhancement, tech-debt, etc.)

  ```

18. **Final Summary for User**
    - Provide a comprehensive summary to me:

      ```
      ## PR Comment Review Complete! ✓

      **Context:**
      - Original Issue: #{ISSUE_NUMBER}
      - PR: #{PR_NUMBER}
      - Branch: {head-branch-name}

      **Comments Processed:**
      - Total comments reviewed: {X}
      - Addressed with code changes: {X}
        - MUST ADDRESS: {X}
        - SHOULD ADDRESS: {X}
        - COULD ADDRESS: {X}
      - Responded without code changes: {X}
        - Out of scope: {X}
        - Contradicts approved plan: {X}
        - Already addressed: {X}

      **Commits Created:**
      1. {hash}: {commit message}
      2. {hash}: {commit message}
      ...

      **Quality Status:**
      ✓ All commits pass typecheck
      ✓ All commits pass build
      ✓ No new errors introduced

      **Actions Taken:**
      ✓ Pushed {X} commits to {branch-name}
      ✓ Posted summary comment on PR
      ✓ Requested re-review from {X} reviewers
      ✓ Created {X} follow-up issues

      **Follow-up Issues Created:**
      - #{XXX}: {Title}
      - #{YYY}: {Title}

      **Next Steps:**
      - Monitor for re-review feedback
      - Address any new comments if they arise
      - Once approved, merge to {base-branch}

      **Traceability:**
      - All addressed comments have commit links
      - All declined comments have explanations with context
      - Full audit trail in PR conversation
      ```

    - Mention any concerns or items that need attention
    - Suggest monitoring the PR for re-review feedback

## Important Notes

- **Context is king** - Always reference original issue and implementation plan when making decisions
- **Respect the reviewers** - All responses should be professional and appreciative
- **Quality checks are automatic** - Husky pre-commit hooks run appropriate checks based on changed files
- **Use Plan Mode for evaluation** - Extended thinking helps make better decisions about which comments to address
- **Scope discipline** - Don't address out-of-scope comments; create follow-up issues instead
- **Atomic commits when possible** - Each significant comment should get its own commit for traceability
- **Link commits to comments** - Always reply to addressed comments with commit hashes
- **Follow CLAUDE.md** - All changes must align with project conventions (ro/ru/en, tRPC patterns, etc.)
- **Be transparent** - Clearly explain reasoning for not addressing comments, with context references
- **Test thoroughly** - Ensure changes don't introduce new issues
- **Keep PR scope focused** - Resist scope creep; reference original issue requirements
- **Respond to everything** - Every comment should either get a code change or a thoughtful response
- **Create audit trail** - Link everything (commits, issues, comments, plans)
- **Request re-review** - Always request re-review after addressing comments
- **Follow-up issues** - Create issues for good suggestions that are out of scope
