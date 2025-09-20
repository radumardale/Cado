# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15 e-commerce platform (Cado) with multilingual support (Romanian, Russian, English), built using TypeScript, React 19, and MongoDB with Mongoose ODM.

## Tech Stack
- **Framework**: Next.js 15 with Turbopack
- **UI**: React 19 RC, Tailwind CSS v4, Radix UI components
- **Database**: MongoDB with Mongoose ODM
- **API**: tRPC for type-safe APIs
- **Internationalization**: next-intl with three locales (ro, ru, en)
- **Rich Text**: Tiptap editor
- **Forms**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js
- **Testing**: Vitest with React Testing Library
- **Cloud Storage**: AWS S3 for images (served via CloudFront CDN)

## Development Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test
```

## Architecture

### Directory Structure
- `/src/app/` - Next.js app router pages and API routes
  - `[locale]/` - Locale-specific pages with i18n routing
  - `api/` - API endpoints
  - `_trpc/` - tRPC configuration
  - `paynet-callback/` - Payment gateway integration

- `/src/server/` - Backend logic
  - `procedures/` - tRPC procedures organized by feature
  - `trpc.ts` - tRPC initialization with auth middleware
  - `index.ts` - Main router combining all procedures

- `/src/models/` - Mongoose models
  - Each entity (product, order, blog, user, etc.) has its own directory
  - Models use TypeScript interfaces and schemas

- `/src/components/` - Reusable React components
- `/src/lib/` - Utilities, constants, validation schemas
- `/src/hooks/` - Custom React hooks
- `/src/states/` - State management (likely Zustand)
- `/messages/` - i18n translation files

### Key Patterns

#### Database Models
- Using Mongoose with TypeScript interfaces
- Custom IDs generated with nanoid
- Multilingual fields stored as objects with `ro`, `ru`, `en` keys
- Text normalization for search (removing diacritics)
- Timestamps enabled on all models

#### API Layer
- tRPC for type-safe API calls
- Protected procedures using NextAuth session validation
- Organized into routers by feature domain

#### Internationalization
- Three supported locales: Romanian (default), Russian, English
- URL path translation for SEO-friendly URLs
- Translation messages stored in `/messages/` directory

#### Authentication
- NextAuth.js for session management
- Protected admin routes under `/admin/*`

## Environment Variables
Required environment variables:
- `MONGO_URI` - MongoDB connection string
- `EMAIL_ADDRESS` - SMTP email account
- `EMAIL_PASSWORD` - SMTP password
- `BASE_URL` - Application base URL
- `FROM_EMAIL_ADDRESS` - Sender email
- `FEEDBACK_EMAIL_ADDRESS` - Feedback recipient
- `CONTACT_EMAIL_ADDRESS` - Contact form recipient
- `API_BASE_URL` - API endpoint base

## Testing
Tests are configured with Vitest and use:
- React Testing Library for component testing
- jsdom environment
- Path aliases configured to match TypeScript paths
- Test files located in `src/__tests__/`

## Code Conventions
- TypeScript strict mode
- ESLint for code quality
- Path aliases: `@/` maps to `/src/`
- Multilingual data stored as `{ro: string, ru: string, en: string}`
- Use existing UI components from `/src/components/ui/`
- Follow existing tRPC procedure patterns for new API endpoints

## Documentation Rules
- **ALL generated documentation MUST be saved in the `/docs` folder at the root of the project**
- Never create documentation files in any other location
- If the `/docs` folder doesn't exist, create it first
- This includes any markdown files, API documentation, guides, or other documentation artifacts