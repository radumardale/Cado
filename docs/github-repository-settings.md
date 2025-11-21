# GitHub Repository Settings for Maximum Control

This document provides recommended GitHub repository settings to enforce the contribution policies outlined in [CONTRIBUTING.md](../CONTRIBUTING.md) and [LICENSE](../LICENSE).

## 🎯 Overview

These settings ensure that:

- You maintain full control over all contributions
- All changes require your explicit approval
- Direct commits to protected branches are prevented
- Contributors must follow the proper workflow

---

## 🔧 Repository Settings

### General Settings

Navigate to: **Settings → General**

#### Basic Information

- **Visibility:** Public (as desired)
- **Features:**
  - ✅ Wikis: Disabled (unless needed)
  - ✅ Issues: Enabled (for contribution requests)
  - ✅ Sponsorships: Disabled
  - ✅ Projects: Optional
  - ✅ Discussions: Optional

#### Pull Requests

- ✅ **Allow merge commits:** Enabled
- ✅ **Allow squash merging:** Enabled (recommended)
- ✅ **Allow rebase merging:** Enabled
- ✅ **Always suggest updating pull request branches:** Enabled
- ✅ **Allow auto-merge:** Disabled (you want manual control)
- ✅ **Automatically delete head branches:** Enabled

---

## 🛡️ Branch Protection Rules

### Protecting `main` Branch

Navigate to: **Settings → Branches → Add branch protection rule**

**Branch name pattern:** `main`

#### Protect matching branches

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1 (from you)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed:** Enabled
  - ✅ **Require review from Code Owners:** Disabled (unless you set up CODEOWNERS)
  - ❌ **Restrict who can dismiss pull request reviews:** Optional
  - ✅ **Allow specified actors to bypass required pull requests:** Add your username (for emergency fixes)

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging:** Enabled
  - Add status checks if you have CI/CD:
    - Build
    - TypeScript check
    - Linting
    - Tests (if applicable)

- ✅ **Require conversation resolution before merging:** Enabled

- ✅ **Require signed commits:** Optional (recommended for security)

- ✅ **Require linear history:** Optional (keeps history clean)

- ❌ **Require deployments to succeed before merging:** Optional

- ✅ **Lock branch:** Disabled (you need to merge)

- ✅ **Do not allow bypassing the above settings:** Disabled
  - Add yourself to the bypass list if needed

- ✅ **Restrict who can push to matching branches:**
  - Add only your username
  - This prevents anyone else from pushing directly

#### Rules applied to everyone including administrators

- ✅ **Include administrators:** Enabled (enforce rules on everyone)

---

### Protecting `develop` Branch (if using Git Flow)

**Branch name pattern:** `develop`

Apply the same settings as `main` above, with these modifications:

- **Require approvals:** 1 (from you)
- **Restrict who can push to matching branches:** Add your username
- All other settings same as `main`

---

## 👥 Collaborators and Teams

Navigate to: **Settings → Collaborators and teams**

### Recommended Approach

1. **No Direct Collaborators (Most Restrictive)**
   - Do NOT add any collaborators
   - All contributions must come via forks
   - You review and approve everything
   - **Advantage:** Maximum control, no one can push directly

2. **Selective Collaborators (Slightly Less Restrictive)**
   - Add only trusted individuals with **Read** access
   - They can view private details but cannot push
   - Still requires forks and pull requests
   - **Advantage:** Can give access to issues/discussions

### Permission Levels Explained

- **Read:** Can read and clone, cannot push
- **Triage:** Can manage issues and PRs, cannot push code
- **Write:** Can push to repository (NOT RECOMMENDED unless fully trusted)
- **Maintain:** Can manage repository without pushing to protected branches
- **Admin:** Full access (only you should have this)

**Recommendation:** Keep all external contributors at **NO ACCESS** (fork-only model).

---

## 🔔 Notifications and Alerts

Navigate to: **Settings → Notifications**

Configure alerts for:

- ✅ All pull requests
- ✅ All issues
- ✅ All comments on your commits
- ✅ Security advisories
- ✅ Dependabot alerts

---

## 🤖 GitHub Actions (if using CI/CD)

Navigate to: **Settings → Actions → General**

### Actions permissions

- ✅ **Allow all actions and reusable workflows:** Or restrict as needed
- ✅ **Require approval for first-time contributors:** Enabled
- ✅ **Require approval for all outside collaborators:** Enabled

### Workflow permissions

- ✅ **Read repository contents and packages permissions:** Selected
- ✅ **Allow GitHub Actions to create and approve pull requests:** Disabled

---

## 📋 Issue Templates

Create issue templates to guide contribution requests.

### 1. Contribution Request Template

**File:** `.github/ISSUE_TEMPLATE/contribution-request.md`

```markdown
---
name: Contribution Request
about: Request permission to contribute to this project
title: '[CONTRIBUTION REQUEST] '
labels: contribution-request
assignees: ''
---

## 🚨 READ THIS FIRST

Before submitting this request, have you:

- [ ] Read the [CONTRIBUTING.md](../CONTRIBUTING.md) file?
- [ ] Read the [LICENSE](../LICENSE) file?
- [ ] Understand that all contributions become property of the copyright holder?
- [ ] Understand that there is no guarantee your contribution will be accepted?

## 📋 Contribution Details

### What do you want to contribute?

<!-- Describe your proposed contribution in detail -->

### Why is this contribution needed?

<!-- Explain the problem it solves or the value it adds -->

### How will you implement it?

<!-- Provide a high-level technical approach -->

### Estimated scope

<!-- How much work is involved? -->

## 🔒 Legal Acknowledgment

By submitting this request, I acknowledge:

- [ ] I have read and agree to the Contributor License Agreement (CLA)
- [ ] I will assign all rights to my contribution to the copyright holder
- [ ] I understand this contribution requires explicit written approval
- [ ] I will not begin work until I receive written approval

## 📧 Contact Information

- **Name:**
- **Email:**
- **GitHub Username:** @yourusername
```

### 2. Bug Report Template

**File:** `.github/ISSUE_TEMPLATE/bug-report.md`

```markdown
---
name: Bug Report
about: Report a bug (does not grant permission to fix it)
title: '[BUG] '
labels: bug
assignees: ''
---

## ⚠️ Note

Submitting a bug report does not grant you permission to fix it. If you wish to contribute a fix, you must submit a separate Contribution Request and receive approval.

## 🐛 Bug Description

<!-- A clear description of the bug -->

## 📋 Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior

<!-- What should happen -->

## ❌ Actual Behavior

<!-- What actually happens -->

## 🖥️ Environment

- OS:
- Browser:
- Node version:
- Any other relevant info:

## 📸 Screenshots

<!-- If applicable -->

## 📝 Additional Context

<!-- Any other information -->
```

### 3. Feature Request Template

**File:** `.github/ISSUE_TEMPLATE/feature-request.md`

```markdown
---
name: Feature Request
about: Suggest a feature (does not guarantee implementation)
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## ⚠️ Note

Feature suggestions do not guarantee acceptance or implementation. If you wish to implement this feature yourself, you must submit a separate Contribution Request and receive approval.

## 🎯 Feature Description

<!-- Clear description of the feature -->

## 💡 Use Case

<!-- Why is this feature needed? -->

## 📋 Proposed Solution

<!-- How would you implement this? -->

## 🔄 Alternatives Considered

<!-- Other approaches you've thought about -->

## 📸 Mockups/Examples

<!-- If applicable -->
```

---

## 🛠️ Pull Request Template

**File:** `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
# Pull Request

## ⚠️ STOP! Before submitting this PR:

- [ ] I have received **explicit written approval** for this contribution
- [ ] I have read and agreed to [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] I have read and agreed to the [LICENSE](../LICENSE)
- [ ] I understand that this contribution becomes property of the copyright holder
- [ ] I have run `npm run typecheck` and it passes
- [ ] I have run `npm run build` and it succeeds
- [ ] I have run `npm run format` to format my code

## 📋 Details

### Approved Issue Reference

**This PR is related to approved issue:** #000

### What does this PR do?

<!-- Describe the changes -->

### Why is this change needed?

<!-- Explain the reasoning -->

### How has this been tested?

<!-- Describe your testing process -->

## 📸 Screenshots (if applicable)

<!-- Before/after screenshots for UI changes -->

## 🔒 Legal Acknowledgment

By submitting this PR, I acknowledge:

- I assign all rights, title, and interest in this contribution to the copyright holder
- I waive any moral rights I may have in this contribution
- I have the legal right to make this assignment
- The copyright holder may use, modify, or reject this contribution at their sole discretion

## 📝 Additional Notes

<!-- Any other information -->
```

---

## 🔍 CODEOWNERS File (Optional)

If you want to be automatically requested for review on all PRs:

**File:** `.github/CODEOWNERS`

```
# Global code owner
* @yourusername

# Specific directories (examples)
/src/server/ @yourusername
/src/models/ @yourusername
/docs/ @yourusername
```

---

## 📊 Recommended GitHub Apps/Integrations

### 1. **Vercel** (Already integrated)

- Automatic preview deployments for PRs
- Shows deployment status in PR checks

### 2. **Dependabot** (Built-in)

- Settings → Security → Dependabot
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates
- ✅ Enable Dependabot version updates

### 3. **CodeQL Analysis** (Built-in)

- Settings → Security → Code security and analysis
- ✅ Enable Dependency graph
- ✅ Enable Dependabot alerts
- ✅ Enable Code scanning

---

## 📝 Summary Checklist

Use this checklist to configure your repository:

### Branch Protection

- [ ] `main` branch protected with required PR reviews
- [ ] `develop` branch protected (if using Git Flow)
- [ ] Only you can push to protected branches
- [ ] Require status checks to pass
- [ ] Require conversation resolution

### Access Control

- [ ] No collaborators added (fork-only model), OR
- [ ] Only trusted collaborators with Read access
- [ ] You are the only Admin

### Issue Templates

- [ ] Contribution Request template created
- [ ] Bug Report template created
- [ ] Feature Request template created

### Pull Request

- [ ] PR template created with legal acknowledgments
- [ ] Auto-merge disabled
- [ ] Auto-delete head branches enabled

### Security

- [ ] Dependabot enabled
- [ ] Code scanning enabled
- [ ] Security advisories configured

### Optional

- [ ] CODEOWNERS file created
- [ ] Required status checks configured (build, typecheck, etc.)
- [ ] Signed commits required

---

## 🚀 How to Apply These Settings

1. **Go to your repository on GitHub**
2. **Click Settings** (top right)
3. **Follow each section above** to configure
4. **Create the template files** in `.github/` directory
5. **Test the workflow** by creating a test PR

---

## 📧 Questions?

If you need help configuring these settings, refer to:

- [GitHub Documentation - Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub Documentation - Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)

---

**Remember:** These settings work in conjunction with your LICENSE and CONTRIBUTING.md files to create a complete legal and technical framework for controlling contributions to your repository.
