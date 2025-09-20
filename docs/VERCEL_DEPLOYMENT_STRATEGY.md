# Vercel Development Deployment Strategy

## Overview
This document outlines the strategy for setting up a secure, private development deployment from the `develop` branch that won't interfere with the production deployment on cado.md.

## Current Setup
- **Production**: `main` branch → cado.md (public)
- **Development**: `develop` branch → needs private deployment
- **Goal**: Isolated development environment with no public access or SEO indexing

## Recommended Approach: Branch Deployment with Password Protection

### How It Works
1. **Automatic URL**: Vercel will create a unique URL like `cado-develop-{hash}.vercel.app`
2. **Password Protection**: Enable Vercel Authentication for non-production deployments
3. **No Search Engine Indexing**: Protected deployments are automatically blocked from crawlers
4. **Separate Environment Variables**: Different configuration for development vs production

## Implementation Guide

### Step 1: Configure Branch Deployment in Vercel Dashboard

1. Navigate to your project in Vercel Dashboard
2. Go to **Settings → Git**
3. Add `develop` branch to **"Preview Branches"**
4. This enables automatic deployments when you push to `develop`

### Step 2: Enable Password Protection

1. Go to **Settings → Security**
2. Enable **"Vercel Authentication"** for Preview Deployments
3. This ensures only team members or people with shared links can access
4. No public access possible without authentication

### Step 3: Set Up Environment Variables

1. Go to **Settings → Environment Variables**
2. Add development-specific variables scoped to **"Preview"**
3. Examples:
   ```
   BASE_URL=https://cado-develop.vercel.app
   NEXT_PUBLIC_ENV=development
   MONGODB_URI=<development_database_if_different>
   ```

### Step 4: Add Deployment Protection Files

#### Create `vercel.json`
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

#### Create `src/middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isProduction = process.env.VERCEL_ENV === 'production';

  if (!isProduction) {
    // Add robots meta tag for non-production
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
```

#### Update `app/robots.ts`
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production';

  if (!isProduction) {
    // Block all crawlers in development
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Normal production robots.txt
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://cado.md/sitemap.xml',
  };
}
```

#### Add Development Indicator (Optional)
```typescript
// components/DevIndicator.tsx
export function DevIndicator() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm z-50">
      DEV ENVIRONMENT
    </div>
  );
}
```

## Alternative: Custom Subdomain

If you prefer a permanent development URL like `dev.cado.md`:

1. **In Vercel Dashboard**:
   - Add `dev.cado.md` as a domain
   - Assign it to `develop` branch deployments only
   - Enable password protection

2. **DNS Configuration**:
   - Add CNAME record: `dev.cado.md` → `cname.vercel-dns.com`

## Environment Variable Strategy

### Production Environment (main branch)
```env
BASE_URL=https://cado.md
NEXT_PUBLIC_ENV=production
MONGODB_URI=<production_mongodb_uri>
# Other production settings
```

### Development Environment (develop branch)
```env
BASE_URL=https://cado-develop.vercel.app
NEXT_PUBLIC_ENV=development
MONGODB_URI=<development_mongodb_uri_or_same>
ROBOTS_DISALLOW=true
# Other development settings
```

## Security Measures

### 1. Vercel Authentication (Recommended)
- Built-in Vercel feature
- Requires Vercel account login
- Can generate temporary shareable links
- No additional code needed

### 2. Basic Authentication (Alternative)
If you need custom authentication:

```typescript
// Add to middleware.ts
if (process.env.VERCEL_ENV === 'preview') {
  const auth = request.headers.get('authorization');
  const expectedAuth = 'Basic ' + Buffer.from('username:password').toString('base64');

  if (auth !== expectedAuth) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }
}
```

### 3. IP Whitelisting
- Available on Vercel Enterprise plans
- Can restrict access to specific IP addresses

## Workflow Benefits

1. **Automatic Deployments**
   - Every push to `develop` creates a new deployment
   - Unique URL for each commit
   - Easy rollback to previous deployments

2. **Pull Request Integration**
   - PRs from `develop` to `main` automatically get preview links
   - Team can review changes before merging to production
   - Comments on PR include deployment URLs

3. **Complete Environment Separation**
   - Different environment variables
   - Optional: Different database
   - Safe for experimental features
   - No risk to production

## What's Protected

✅ **No Production Impact**: Zero effect on cado.md
✅ **No Public Access**: Password protection prevents unauthorized access
✅ **No SEO Indexing**: Multiple layers preventing search engine crawling
✅ **No URL Conflicts**: Each deployment gets a unique URL
✅ **Data Isolation**: Can use separate database if needed

## Quick Setup Checklist

### In Vercel Dashboard:
- [ ] Enable `develop` branch in Git settings
- [ ] Turn on Vercel Authentication for preview deployments
- [ ] Configure environment variables for Preview environment
- [ ] (Optional) Add custom domain for development

### In Your Codebase:
- [ ] Create `vercel.json` with robot headers
- [ ] Add middleware.ts for additional protection
- [ ] Update/create robots.ts file
- [ ] (Optional) Add development indicator component
- [ ] Commit and push to `develop` branch

### Testing:
- [ ] Push a commit to `develop`
- [ ] Verify password protection is active
- [ ] Check robots headers in browser DevTools
- [ ] Test with Google's robots.txt tester
- [ ] Confirm environment variables are correct

## Deployment URLs

Once configured, your deployments will be available at:

- **Production**: https://cado.md (from `main` branch)
- **Development**: https://cado-git-develop-{project}.vercel.app (from `develop` branch)
- **Preview**: https://cado-{hash}.vercel.app (for each commit)

## Important Notes

1. **The Vercel-generated URL is perfectly fine** - You don't need a custom domain for development unless you want one for convenience.

2. **Password protection is automatic** - Once enabled in Vercel settings, all non-production deployments require authentication.

3. **Environment variables are scoped** - Variables set for "Preview" won't affect production.

4. **Each commit gets its own deployment** - This allows you to test specific versions and share them with others.

5. **No search engines will index development** - The combination of authentication, headers, and robots.txt ensures complete SEO isolation.

## Troubleshooting

### Issue: Development site is publicly accessible
- **Solution**: Verify Vercel Authentication is enabled for Preview Deployments in project settings

### Issue: Wrong environment variables in development
- **Solution**: Check that variables are scoped to "Preview" not "Production" in Vercel Dashboard

### Issue: Search engines might index development
- **Solution**: Verify middleware is running and X-Robots-Tag headers are present

### Issue: Can't access development site
- **Solution**: Make sure you're logged into Vercel or have a valid shareable link

## Conclusion

This setup provides a completely isolated development environment that:
- Is secure and private
- Won't affect production
- Won't be indexed by search engines
- Automatically deploys on every push to `develop`
- Requires minimal configuration

The standard Vercel preview URLs are sufficient for development purposes, and the built-in authentication provides all the security you need.