# 🎁 CADO - E-commerce Gift Platform

<div align="center">
  <img src="public/logo/CADO-en.svg" alt="CADO Logo" width="200"/>

**Premium gift sets and personalized products for Moldova**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

</div>

## 📋 Overview

CADO is a modern e-commerce platform specializing in corporate and personal gift sets, serving the Moldovan market with support for Romanian, Russian, and English languages. Built with cutting-edge web technologies, it offers a seamless shopping experience with advanced features for both customers and administrators.

### 🌟 Key Features

- **🌐 Multi-language Support**: Full internationalization (RO/RU/EN) with SEO-friendly URLs
- **🛍️ Product Management**: Dynamic catalog with categories, occasions, and filtering
- **🎨 Rich Content Editor**: Tiptap-based editor for product descriptions and blogs
- **💳 Payment Integration**: Secure payment gateway with Paynet support
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔍 Smart Search**: Normalized search with diacritic support for Romanian/Russian
- **👤 Admin Dashboard**: Comprehensive admin panel for content and order management
- **📧 Email Notifications**: Automated order confirmations and contact forms
- **🖼️ Cloud Storage**: AWS S3 integration with CloudFront CDN for images
- **⚡ Performance**: Next.js 15 with Turbopack for blazing-fast development

## 🚀 Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19 RC](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation

### Backend

- **API**: [tRPC](https://trpc.io/) for type-safe APIs
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: AWS S3 + CloudFront CDN
- **Email**: SMTP integration with Nodemailer

### Development

- **Package Manager**: npm
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library
- **Linting**: ESLint with Next.js config
- **Code Formatting**: [Prettier](https://prettier.io/) with ESLint integration
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) for automated pre-commit checks
- **Dev Server**: Turbopack for fast HMR

## 📁 Project Structure

```
cado-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # Internationalized pages
│   │   ├── api/               # API routes
│   │   └── _trpc/             # tRPC configuration
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   ├── admin/            # Admin dashboard components
│   │   ├── product/          # Product-related components
│   │   └── ...
│   ├── server/               # Backend logic
│   │   ├── procedures/       # tRPC procedures
│   │   └── trpc.ts          # tRPC setup
│   ├── models/              # Mongoose database models
│   ├── lib/                 # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── states/             # Global state management
│   └── i18n/               # Internationalization config
├── messages/               # Translation files (ro/ru/en)
├── scripts/               # Automation and database scripts
│   ├── setup-local.sh    # Automated setup script
│   ├── db-export.sh     # Export production database
│   ├── db-import.sh     # Import to local MongoDB
│   └── db-sync.sh       # Sync production to local
├── public/                # Static assets
├── docs/                  # Documentation
│   └── LOCAL_SETUP.md   # Detailed local setup guide
├── db-backup/            # Database backups (gitignored)
└── types/                # TypeScript type definitions
```

## 🛠️ Installation

### Prerequisites

- Node.js 20+
- MongoDB 6.0+ (local or MongoDB Atlas)
- AWS Account (for S3 storage)
- SMTP Server (Gmail, SendGrid, etc.)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/your-org/cado-site.git
cd cado-site
```

2. **Run automated setup** (Recommended)

```bash
npm run setup
```

This will automatically:

- ✅ Check prerequisites (Node.js, MongoDB)
- ✅ Start MongoDB locally
- ✅ Create `.env.local` from production template
- ✅ Install dependencies
- ✅ Optionally sync production database

3. **Start development**

```bash
npm run dev
```

### Manual Setup

For manual configuration:

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

3. **Sync database** (optional)

```bash
npm run db:sync  # Sync production data to local MongoDB
```

4. **Start server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

For detailed setup instructions, see [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md).

## 🔄 Local Development

### Database Synchronization

Sync production data to your local environment:

```bash
# Complete sync (export + import)
npm run db:sync

# With automatic confirmations
npm run db:sync -- -y

# Use existing backup
npm run db:sync -- --skip-export
```

**Features:**

- 🔒 **Safe exports** - Production database is never modified
- 💾 **Local MongoDB** - Complete isolation from production
- 🖼️ **CDN assets** - Images load from CloudFront
- 📦 **Timestamped backups** - Stored in `/db-backup/`

### Environment Configuration

**Local development** uses modified settings:

- MongoDB: `mongodb://localhost:27017/cado`
- Base URL: `http://localhost:3000`
- Assets: Production CDN (automatic)
- Email/Payments: Can be mocked

## 📝 Available Scripts

### Development

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Database Management

```bash
# Automated local setup
npm run setup

# Sync production database to local
npm run db:sync

# Export production database
npm run db:export

# Import to local MongoDB
npm run db:import
```

## 🎨 Code Formatting

This project uses **Prettier** for consistent code formatting across the entire codebase.

### Quick Commands

```bash
# Format all files
npm run format

# Check if files are formatted (CI/PR checks)
npm run format:check
```

### IDE Setup for Format on Save

#### VS Code

1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. Add to your settings (`.vscode/settings.json` or User Settings):

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
  }
}
```

#### WebStorm / IntelliJ IDEA

1. Prettier is built-in (no plugin needed)
2. Go to **Settings → Languages & Frameworks → JavaScript → Prettier**
3. Set Prettier package path: `./node_modules/prettier`
4. Check **On save** to enable format on save
5. Configure file patterns: `{**/*,*}.{js,ts,jsx,tsx,json,css,scss,md}`

#### Sublime Text

1. Install [JsPrettier package](https://packagecontrol.io/packages/JsPrettier)
2. Set `"auto_format_on_save": true` in JsPrettier settings

#### Vim/Neovim

1. Install [vim-prettier plugin](https://github.com/prettier/vim-prettier)
2. Add to your config: `let g:prettier#autoformat = 1`

#### Cursor

1. Prettier support is built-in
2. Add to settings: `"editor.formatOnSave": true`

### Formatting Rules

Our Prettier configuration (`.prettierrc`) enforces:

- ✅ Single quotes for strings
- ✅ Semicolons always
- ✅ 2-space indentation
- ✅ 100 character line width
- ✅ Trailing commas (ES5 style)
- ✅ Unix line endings (LF)

For detailed configuration and troubleshooting, see [docs/code-formatting.md](docs/code-formatting.md).

## 🌍 Internationalization

The application supports three languages with SEO-friendly URLs:

- **Romanian** (default): `/ro/catalog`
- **Russian**: `/ru/katalog`
- **English**: `/en/catalog`

Translation files are located in `/messages/` and managed through `next-intl`.

## 👨‍💼 Admin Dashboard

Access the admin panel at `/admin` with features for:

- **Product Management**: Add, edit, delete products with multilingual content
- **Order Processing**: View and manage customer orders
- **Blog Management**: Create and edit blog posts
- **Home Page**: Customize hero banners and featured products
- **Client Data**: Export customer information
- **Season Catalogs**: Manage seasonal collections

## 🔒 Security

- Session-based authentication with NextAuth.js
- Protected API routes with tRPC middleware
- Secure payment processing through Paynet
- Environment variables for sensitive data
- CORS and CSRF protection

## 📊 Database Schema

### Core Models

- **Product**: Multi-language titles/descriptions, pricing, stock, categories
- **Order**: Customer info, products, payment status, delivery details
- **User**: Admin authentication and roles
- **Blog**: Multi-language content with rich text
- **Client**: Customer contact information

## 🚢 Deployment

### Platform: Vercel

This application is deployed on [Vercel](https://vercel.com), the platform built by the creators of Next.js.

### Production Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

### Vercel Deployment Process

1. **Automatic Deployments**
   - Push to `main` branch triggers production deployment
   - Pull requests create preview deployments automatically
   - Each commit gets a unique deployment URL

2. **Environment Variables**

   Set these in Vercel Dashboard (Settings → Environment Variables):

   ```
   MONGO_URI              # MongoDB Atlas connection string
   NEXTAUTH_SECRET        # Authentication secret key
   AWS_PUBLIC_ACCESS_KEY  # AWS S3 access key
   AWS_SECRET_ACCESS_KEY  # AWS S3 secret key
   EMAIL_ADDRESS          # SMTP email
   EMAIL_PASSWORD         # SMTP password
   BASE_URL               # https://cado.md
   # ... and all other env variables
   ```

3. **Build Settings in Vercel**
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`
   - **Node.js Version**: 20.x

### Deploying with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Preview Deployments

- Every pull request gets a preview deployment
- Preview URLs format: `https://cado-pr-{number}.vercel.app`
- Preview deployments have separate environment variables
- Comments are automatically added to PRs with deployment URLs

## 📈 Performance

- **Static Generation**: Product and category pages are statically generated
- **Image Optimization**: Next.js Image component with CDN delivery
- **Code Splitting**: Automatic with Next.js
- **Caching**: 1-hour revalidation for static pages
- **Bundle Size**: Optimized with tree-shaking

## 🤝 Contributing

**⚠️ IMPORTANT:** This is a proprietary project with restricted contribution rights.

**Before contributing, you MUST:**

- Read the [CONTRIBUTING.md](CONTRIBUTING.md) file
- Obtain explicit written approval from the project owner
- Agree to the Contributor License Agreement (CLA)

**Unauthorized contributions will be rejected.**

For approved contributions:

1. Request permission via email (info@cado.md) or GitHub Issues
2. Wait for explicit written approval
3. Create a feature branch from `develop`
4. Follow code standards and run quality checks
5. Submit a pull request referencing your approved request
6. Vercel will automatically create a preview deployment
7. Code review and final approval at owner's discretion

See [CONTRIBUTING.md](CONTRIBUTING.md) for complete details.

## 📄 License

**Proprietary License - All Rights Reserved**

Copyright (c) 2024-present, Cado MD

This software is proprietary and confidential. While the source code is publicly visible for reference purposes, you may NOT use, copy, modify, distribute, or create derivative works without explicit written permission from the copyright holder.

**Key Points:**

- ✅ Viewing for educational/reference purposes is permitted
- ❌ Using, copying, or modifying requires written permission
- ❌ Forking or creating derivative works is prohibited
- ❌ Commercial use requires a separate license agreement
- 🔒 All contributions become property of the copyright holder

See [LICENSE](LICENSE) file for complete terms.

**To request permission:** info@cado.md

## 📞 Support

For technical support or questions:

- Email: info@cado.md
- Phone: +373 69 645 153

## 🔗 Links

- **Production**: [https://cado.md](https://cado.md) (Vercel deployment)
- **Documentation**: See `/docs` folder
- **API Documentation**: Available in tRPC procedures
- **Vercel Dashboard**: Manage deployments and environment variables

---

<div align="center">
  Made with ❤️ for Moldova's gifting needs
</div>
