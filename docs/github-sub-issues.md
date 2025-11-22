# GitHub Sub-Issues: Technical Implementation Guide

## Overview

GitHub supports parent-child issue relationships (sub-issues) via the GraphQL API. This guide shows how to create and manage sub-issues using the `gh` CLI tool.

## Why Use Sub-Issues?

**Benefits over task lists:**
- Visual hierarchy in GitHub UI (indented sub-issues)
- Automatic progress tracking on parent issue
- "Parent issue" field visible on each sub-issue
- Better project planning and organization
- Integrates with GitHub Projects

## Prerequisites

- `gh` CLI tool installed and authenticated
- Repository access with issue management permissions
- GraphQL API knowledge (basic)

## Quick Start

### Step 1: Create Issues Normally

```bash
# Create parent issue
gh issue create --title "Parent: Feature Epic" --body "..."

# Create sub-issues
gh issue create --title "Sub-task 1" --body "..."
gh issue create --title "Sub-task 2" --body "..."
```

### Step 2: Get Node IDs

GitHub's GraphQL API uses **node IDs** (not issue numbers) for mutations.

```bash
gh api graphql -f query='
{
  repository(owner: "YOUR_ORG", name: "YOUR_REPO") {
    parent: issue(number: 79) {
      id
      number
    }
    sub1: issue(number: 81) {
      id
      number
    }
    sub2: issue(number: 82) {
      id
      number
    }
  }
}'
```

**Example output:**
```json
{
  "data": {
    "repository": {
      "parent": {
        "id": "I_kwDOO9Pqgs7Z05g0",
        "number": 79
      },
      "sub1": {
        "id": "I_kwDOO9Pqgs7Z06Y4",
        "number": 81
      },
      "sub2": {
        "id": "I_kwDOO9Pqgs7Z064N",
        "number": 82
      }
    }
  }
}
```

### Step 3: Link Sub-Issues to Parent

Use the `addSubIssue` mutation:

```bash
gh api graphql -f query='
mutation {
  addSubIssue(input: {
    issueId: "I_kwDOO9Pqgs7Z05g0"     # Parent issue node ID
    subIssueId: "I_kwDOO9Pqgs7Z06Y4"  # Sub-issue node ID
  }) {
    issue {
      number
      title
    }
  }
}'
```

**Success response:**
```json
{
  "data": {
    "addSubIssue": {
      "issue": {
        "number": 79,
        "title": "Parent: Feature Epic"
      }
    }
  }
}
```

### Step 4: Verify Relationship

```bash
gh api graphql -f query='
{
  repository(owner: "YOUR_ORG", name: "YOUR_REPO") {
    parent: issue(number: 79) {
      number
      trackedIssues(first: 10) {
        nodes {
          number
          title
        }
      }
    }
    sub: issue(number: 81) {
      number
      parent {
        number
        title
      }
    }
  }
}'
```

## Batch Operations

Link multiple sub-issues in one GraphQL call:

```bash
gh api graphql -f query='
mutation {
  sub1: addSubIssue(input: {
    issueId: "PARENT_NODE_ID"
    subIssueId: "SUB1_NODE_ID"
  }) {
    issue { number }
  }
  sub2: addSubIssue(input: {
    issueId: "PARENT_NODE_ID"
    subIssueId: "SUB2_NODE_ID"
  }) {
    issue { number }
  }
  sub3: addSubIssue(input: {
    issueId: "PARENT_NODE_ID"
    subIssueId: "SUB3_NODE_ID"
  }) {
    issue { number }
  }
}'
```

## Advanced Operations

### Remove Sub-Issue

```bash
gh api graphql -f query='
mutation {
  removeSubIssue(input: {
    issueId: "PARENT_NODE_ID"
    subIssueId: "SUB_ISSUE_NODE_ID"
  }) {
    issue {
      number
    }
  }
}'
```

### Replace Parent Issue

If a sub-issue already has a parent and you want to change it:

```bash
gh api graphql -f query='
mutation {
  addSubIssue(input: {
    issueId: "NEW_PARENT_NODE_ID"
    subIssueId: "SUB_ISSUE_NODE_ID"
    replaceParent: true
  }) {
    issue { number }
  }
}'
```

### Reprioritize Sub-Issues

Change the order of sub-issues in the parent list:

```bash
gh api graphql -f query='
mutation {
  reprioritizeSubIssue(input: {
    issueId: "PARENT_NODE_ID"
    subIssueId: "SUB_ISSUE_NODE_ID"
    afterId: "ANOTHER_SUB_ISSUE_NODE_ID"  # Insert after this issue
  }) {
    issue { number }
  }
}'
```

## Complete Example Workflow

Real-world example: Creating a feature epic with 3 sub-tasks

```bash
#!/bin/bash

# 1. Create parent issue
PARENT=$(gh issue create \
  --title "Epic: User Authentication" \
  --body "Implement complete auth system" \
  --label "enhancement" \
  --json number -q .number)

echo "Created parent issue #$PARENT"

# 2. Create sub-issues
SUB1=$(gh issue create \
  --title "Implement login flow" \
  --body "..." \
  --json number -q .number)

SUB2=$(gh issue create \
  --title "Add password reset" \
  --body "..." \
  --json number -q .number)

SUB3=$(gh issue create \
  --title "Implement 2FA" \
  --body "..." \
  --json number -q .number)

echo "Created sub-issues: #$SUB1, #$SUB2, #$SUB3"

# 3. Get all node IDs
NODES=$(gh api graphql -f query="
{
  repository(owner: \"radumardale\", name: \"Cado\") {
    parent: issue(number: $PARENT) { id }
    sub1: issue(number: $SUB1) { id }
    sub2: issue(number: $SUB2) { id }
    sub3: issue(number: $SUB3) { id }
  }
}")

PARENT_ID=$(echo "$NODES" | jq -r '.data.repository.parent.id')
SUB1_ID=$(echo "$NODES" | jq -r '.data.repository.sub1.id')
SUB2_ID=$(echo "$NODES" | jq -r '.data.repository.sub2.id')
SUB3_ID=$(echo "$NODES" | jq -r '.data.repository.sub3.id')

# 4. Link all sub-issues to parent
gh api graphql -f query="
mutation {
  sub1: addSubIssue(input: {
    issueId: \"$PARENT_ID\"
    subIssueId: \"$SUB1_ID\"
  }) { issue { number } }

  sub2: addSubIssue(input: {
    issueId: \"$PARENT_ID\"
    subIssueId: \"$SUB2_ID\"
  }) { issue { number } }

  sub3: addSubIssue(input: {
    issueId: \"$PARENT_ID\"
    subIssueId: \"$SUB3_ID\"
  }) { issue { number } }
}"

echo "✓ All sub-issues linked to parent #$PARENT"
```

## GraphQL Schema Reference

### addSubIssue Mutation

**Input fields:**
- `issueId` (required): Node ID of parent issue
- `subIssueId` (optional): Node ID of sub-issue
- `subIssueUrl` (optional): URL of sub-issue (alternative to subIssueId)
- `replaceParent` (optional): Replace existing parent if true
- `clientMutationId` (optional): Unique identifier for client

### Query Fields

**On Issue type:**
- `trackedIssues`: Connection to sub-issues (on parent)
- `parent`: Parent issue (on sub-issue)

## Troubleshooting

### Error: "Could not resolve to an Issue"

**Cause**: Invalid node ID or issue doesn't exist

**Solution**: Verify node ID with:
```bash
gh api graphql -f query='{
  repository(owner: "USER", name: "REPO") {
    issue(number: 123) { id, number }
  }
}'
```

### Error: "Resource not accessible by integration"

**Cause**: Insufficient permissions

**Solution**: Ensure GitHub token has `repo` scope:
```bash
gh auth status
gh auth refresh -s repo
```

### Sub-issue not showing in UI

**Cause**: GitHub UI cache

**Solution**:
1. Hard refresh browser (Cmd+Shift+R)
2. Wait a few seconds for GitHub to update
3. Verify via GraphQL query

## Best Practices

1. **Create issues first, link later** - Easier to batch operations
2. **Use descriptive titles** - Sub-issues show in collapsed view
3. **Limit nesting** - GitHub supports only 1 level (parent → child, no grandchildren)
4. **Track progress** - Close sub-issues to see parent progress bar
5. **Document in parent** - Use parent issue body to explain overall epic

## Resources

- [GitHub GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [gh CLI Manual](https://cli.github.com/manual/)

## Notes

- Sub-issues are a relatively new GitHub feature (2023+)
- Not available in all GitHub plans (check your plan)
- GitHub Projects v2 has better visual sub-issue support
- Can also use GitHub's web UI: "Add sub-issue" button on issues
