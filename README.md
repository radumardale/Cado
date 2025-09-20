# 🎁 CADO - E-commerce Gift Platform

<div align="center">
  <img src="public/logo/CADO-en.svg" alt="CADO Logo" width="200"/>

  **Premium gift sets and personalized products for Moldova**

  [![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61dafb)](https://reactjs.org/)
  [![License](https://img.shields.io/badge/license-Private-red)](LICENSE)
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
├── public/                # Static assets
├── docs/                  # Documentation
└── types/                # TypeScript type definitions
```

## 🛠️ Installation

### Prerequisites

- Node.js 20+
- MongoDB 6.0+ (local or MongoDB Atlas)
- AWS Account (for S3 storage)
- SMTP Server (Gmail, SendGrid, etc.)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-org/cado-site.git
cd cado-site
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database
MONGO_URI=mongodb://localhost:27017/cado

# Authentication
NEXTAUTH_SECRET=your-secret-key-here

# AWS S3
AWS_PUBLIC_ACCESS_KEY=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Email
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Application
BASE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

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

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are set in your hosting platform:
- Vercel, Netlify, or similar for the Next.js app
- MongoDB Atlas for database
- AWS S3 for image storage
- Production SMTP credentials

## 📈 Performance

- **Static Generation**: Product and category pages are statically generated
- **Image Optimization**: Next.js Image component with CDN delivery
- **Code Splitting**: Automatic with Next.js
- **Caching**: 1-hour revalidation for static pages
- **Bundle Size**: Optimized with tree-shaking

## 🤝 Contributing

This is a private repository. For contributions:

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

Private and Confidential - All Rights Reserved

## 📞 Support

For technical support or questions:
- Email: info@cado.md
- Phone: +373 69 645 153

## 🔗 Links

- **Production**: [https://cado.md](https://cado.md)
- **Documentation**: See `/docs` folder
- **API Documentation**: Available in tRPC procedures

---

<div align="center">
  Made with ❤️ for Moldova's gifting needs
</div>