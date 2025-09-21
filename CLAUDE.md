# CLAUDE.md

## Project Context
Next.js 15 e-commerce platform (Cado) with Romanian/Russian/English support, using MongoDB with Mongoose ODM, deployed on Vercel.

## Architecture Patterns

### Directory Structure
- `/src/app/[locale]/` - Internationalized pages with URL path translation
- `/src/server/procedures/` - tRPC procedures organized by feature domain
- `/src/models/` - Mongoose models with TypeScript interfaces
- `/src/components/ui/` - Reusable UI components (use these!)
- `/messages/` - Translation files for ro/ru/en locales
- `/scripts/` - Database sync and setup automation
- `/docs/` - All documentation MUST go here

### Database Patterns
- **Mongoose with TypeScript** interfaces (not Prisma)
- **Custom IDs**: Generated with nanoid (8 chars)
- **Multilingual fields**: Stored as `{ro: string, ru: string, en: string}`
- **Text normalization**: For search (removing diacritics)
- **Timestamps**: Enabled on all models

### API Patterns
- **tRPC** for type-safe APIs
- **Protected routes**: Using NextAuth session validation
- **Admin routes**: Protected under `/admin/*`
- **Payment callback**: `/paynet-callback/route.ts`

### Hardcoded Values
- **S3 Bucket**: 'cadomd' (hardcoded in image procedures)
- **AWS Region**: 'eu-north-1' (hardcoded)
- **CloudFront CDN**: d3rus23k068yq9.cloudfront.net

## Code Conventions
- **Path aliases**: `@/` maps to `/src/`
- **Multilingual data**: Always use `{ro: string, ru: string, en: string}` structure
- **Components**: Use existing ones from `/src/components/ui/`
- **tRPC procedures**: Follow existing patterns in `/src/server/procedures/`
- **TypeScript**: Strict mode enabled
- **File endings**: Always ensure files end with a newline

## Environment Context
- **Production**: Environment variables in Vercel Dashboard
- **Local**: `.env.local` with `mongodb://localhost:27017/cado`
- **Required vars**: MONGO_URI, NEXTAUTH_SECRET, AWS keys, email config, API credentials
- **Base URLs**: Local `http://localhost:3000`, Production `https://cado.md`

## Documentation Rules
- **ALL documentation MUST be saved in `/docs/` folder**
- Never create documentation files elsewhere
- Create `/docs/` if it doesn't exist
- This includes all markdown files, guides, and documentation artifacts

## Git Flow Workflow (Personal - Not Enforced on Others)

### ⚠️ IMPORTANT: Branch Protection Rules for Claude Code

**ALWAYS CHECK CURRENT BRANCH BEFORE MAKING CHANGES!**

When working with Claude Code, the following Git Flow discipline applies:

### Protected Branches - NO DIRECT COMMITS
- **`main`** - Production branch (NEVER commit directly)
- **`develop`** - Integration branch (NEVER commit directly)

**Claude Code must WARN when on these branches:**
```
⚠️ WARNING: You are on the 'main' or 'develop' branch!
Do NOT make direct changes. Create a feature branch first.
```

### Required Workflow Process

1. **Before Starting Any Work:**
   - Check for existing GitHub issue or create one
   - Note the issue number for branch naming
   - Switch to `develop` branch and pull latest
   - Create a feature branch

2. **Branch Naming Conventions:**
   - **Features**: `feature/issue-{number}-{brief-description}`
     - Example: `feature/issue-1-seo-sitemap`
   - **Hotfixes**: `hotfix/issue-{number}-{brief-description}`
     - Example: `hotfix/issue-99-payment-error`
   - **Releases**: `release/{version}`
     - Example: `release/1.2.0`

3. **Development Process:**
   ```bash
   # Start new feature
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue-1-seo-sitemap

   # Work on the feature
   # ... make changes ...

   # BEFORE committing: Run quality checks
   npm run typecheck  # Check for TypeScript errors
   npm run build      # Ensure build succeeds

   # Only if both pass, commit and push
   git push -u origin feature/issue-1-seo-sitemap

   # Create PR to develop (not main!)
   ```

4. **Merge Strategy:**
   - Features → `develop` (via PR)
   - Release → `main` (via PR from develop)
   - Hotfix → `main` AND `develop` (via PRs)

### Claude Code Behavioral Rules

**When user asks to make changes:**
1. First check current branch with `git branch --show-current`
2. If on `main` or `develop`, immediately warn:
   ```
   ⚠️ You're currently on the '{branch}' branch.
   According to Git Flow, we should not make direct changes here.

   Should I:
   1. Create a feature branch from develop? (recommended)
   2. Continue anyway? (not recommended)

   Is there a GitHub issue for this work? (Issue #___)
   ```

3. Suggest proper branch name based on the task
4. Only proceed after branch is confirmed

### Quick Reference Commands

```bash
# Check current branch
git branch --show-current

# Start new feature (from develop)
git checkout develop && git pull
git checkout -b feature/issue-XX-description

# Start hotfix (from main)
git checkout main && git pull
git checkout -b hotfix/issue-XX-description

# View all branches
git branch -a

# Delete local feature branch after merge
git branch -d feature/issue-XX-description
```

### Why This Workflow?

- **Personal Discipline**: Maintains clean history and organized development
- **Safety**: Prevents accidental commits to production
- **Traceability**: Every change linked to an issue
- **Flexibility**: Other contributors not forced to follow
- **Professional**: Follows industry best practices

### Note for Other Contributors

This Git Flow workflow is a personal preference and is NOT required for other contributors. Others may:
- Work directly on branches as needed
- Use their preferred workflow
- Submit PRs following the project's general guidelines

## Pull Request Guidelines

When creating pull requests, follow these formatting rules:

### Description Format
- **TLDR in the beginning**: Start with a concise summary of what was implemented/changed
- **Details afterwards**: Provide comprehensive information about the changes following the TLDR

### Emoji Usage
- **Allowed but don't overuse**: Emojis can enhance readability but should be used sparingly
- Use them to highlight key sections or important points, not in every sentence

## Quality Checks Before Commits & PRs

### ⚠️ MANDATORY: Pre-Push Checklist

**Claude Code MUST run these checks before pushing commits or creating PRs:**

1. **TypeScript Check** - MUST pass with no errors
   ```bash
   npm run typecheck
   ```

2. **Build Check** - MUST complete successfully
   ```bash
   npm run build
   ```

3. **Only proceed if BOTH checks pass!**

**If errors are found:**
- Fix all TypeScript errors first
- Resolve any build issues
- Re-run both checks
- Only push/create PR when everything passes

### Why This Matters

- **TypeScript errors** can cause runtime failures in production
- **Build failures** mean the code won't deploy
- **Early detection** saves time and prevents broken deployments
- **Clean PRs** are easier to review and merge

### Claude Code Behavior

When asked to commit/push/create PR, Claude Code should:
1. Automatically run `npm run typecheck`
2. If TypeScript check passes, run `npm run build`
3. If both pass, proceed with git operations
4. If either fails, stop and fix the issues first
5. Inform the user of any issues found and fixed
