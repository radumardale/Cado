# Code Formatting Guide

## Overview

This project uses Prettier for consistent code formatting across the entire codebase. Prettier is an opinionated code formatter that supports multiple languages and integrates with most editors.

## Configuration

Our Prettier configuration is defined in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

### Key Rules:

- **Semicolons**: Always used
- **Quotes**: Single quotes for JavaScript/TypeScript and JSX
- **Indentation**: 2 spaces
- **Line width**: 100 characters maximum
- **Trailing commas**: ES5 style (multiline objects/arrays)
- **Line endings**: Unix-style (LF)

## Available Scripts

```bash
# Format all files
npm run format

# Check if files are formatted (doesn't modify files)
npm run format:check
```

## VS Code Integration

### Install Prettier Extension

1. Open VS Code Extensions (Cmd+Shift+X on Mac, Ctrl+Shift+X on Windows/Linux)
2. Search for "Prettier - Code formatter"
3. Install the extension by Prettier

### Configure VS Code Settings

Add to your VS Code settings (`.vscode/settings.json` or user settings):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Ignored Files

Files and directories listed in `.prettierignore` are not formatted:

- `node_modules/` - Dependencies
- `.next/` - Build output
- `dist/`, `build/`, `out/` - Build artifacts
- `.env*` - Environment files
- `*.min.js`, `*.min.css` - Minified files
- `scripts/db-exports/` - Database exports
- Lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)

## ESLint Integration

Prettier is integrated with ESLint through:

- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

This means running `npm run lint` will also check Prettier formatting.

## Workflow

### Before Committing

1. Run formatting: `npm run format`
2. Run TypeScript check: `npm run typecheck`
3. Run build: `npm run build`
4. Commit your changes

### Checking Formatting

To check if your code is properly formatted without modifying files:

```bash
npm run format:check
```

## Troubleshooting

### Common Issues

**1. Prettier not formatting on save in VS Code**

- Ensure Prettier extension is installed
- Check that `editor.formatOnSave` is `true`
- Verify Prettier is set as the default formatter

**2. Conflicts with ESLint**

- Run `npm run lint` to see specific errors
- Prettier rules take precedence over formatting-related ESLint rules

**3. Line ending issues**

- Configure Git to handle line endings: `git config core.autocrlf false`
- Ensure your editor is set to use LF line endings

**4. Different formatting locally vs CI**

- Ensure you're using the same Prettier version: `npm ci`
- Run `npm run format` before pushing

### Manual Formatting

Format specific files or directories:

```bash
# Format a single file
npx prettier --write src/components/MyComponent.tsx

# Format a directory
npx prettier --write "src/components/**/*.{ts,tsx}"

# Check a file without modifying
npx prettier --check src/components/MyComponent.tsx
```

## Best Practices

1. **Format regularly**: Run `npm run format` before committing
2. **Enable format on save**: Configure your editor for automatic formatting
3. **Check formatting in PR**: Run `npm run format:check` before creating PRs
4. **Keep Prettier updated**: Regular updates ensure consistency and bug fixes
5. **Don't fight Prettier**: Accept its opinionated choices for consistency

## Additional Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Editor Integration](https://prettier.io/docs/en/editors.html)
- [Prettier Playground](https://prettier.io/playground/) - Test configurations online
