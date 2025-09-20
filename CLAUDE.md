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