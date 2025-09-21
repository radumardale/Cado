# Comprehensive SEO Audit & Implementation Plan for Cado.md

## Executive Summary

Your e-commerce site targeting the Moldovan market (Romanian/Russian speakers) has solid foundations but lacks critical SEO infrastructure. Priority improvements focus on technical SEO, local market optimization, and performance enhancements.

## Current State Analysis

### ✅ Strengths

- **Multi-language support**: Proper i18n with Romanian (default), Russian, and English
- **SEO-friendly URLs**: Localized paths (/catalog vs /katalog)
- **Basic meta tags**: Title and description implementation exists
- **OpenGraph implementation**: Basic social sharing setup
- **Mobile-responsive**: Tailwind CSS ensures mobile compatibility
- **Fast framework**: Next.js 15 with Turbopack
- **CDN for images**: CloudFront distribution

### ❌ Critical Issues

#### 1. **Missing Technical SEO Infrastructure**

- No sitemap.xml (critical for Google/Yandex indexing)
- No robots.txt file
- No canonical URLs
- No hreflang tags for language alternatives
- No structured data (JSON-LD)

#### 2. **Performance Issues**

- 59 instances of `unoptimized` flag on Next.js images
- No lazy loading configuration
- Missing WebP/AVIF format support
- Inconsistent image sizing

#### 3. **International SEO Problems**

- Missing hreflang annotations
- No language-specific sitemaps
- Default locale not properly declared
- No alternate language links in HTML

#### 4. **Local SEO Gaps**

- No LocalBusiness schema
- Missing NAP (Name, Address, Phone) consistency
- No Google My Business integration signals
- Missing regional targeting

## Moldovan Market-Specific Insights

### Search Engine Landscape

- **Primary**: Google (75% market share)
- **Secondary**: Yandex (15% - important for Russian speakers)
- **Local**: Search patterns split between Romanian and Russian

### Keyword Strategy for Moldova

- Target bilingual searches (RO/RU)
- Include Cyrillic variations for Russian content
- Focus on local terms: "Chișinău", "Moldova", "livrare rapidă"
- Emphasize corporate gifting (B2B is strong in Moldova)

## Step-by-Step Implementation Plan

### Phase 1: Critical Technical Fixes (Week 1)

#### Step 1.1: Create Sitemap Infrastructure

```xml
/public/sitemap.xml (main index)
/public/sitemap-ro.xml
/public/sitemap-ru.xml
/public/sitemap-en.xml
/public/sitemap-products.xml
/public/sitemap-categories.xml
```

#### Step 1.2: Implement Robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /confirmation/
Sitemap: https://cado.md/sitemap.xml
```

#### Step 1.3: Add Hreflang Tags

- Implement in layout.tsx
- Add link tags for each language version
- Include x-default for language selection page

### Phase 2: Structured Data Implementation (Week 2)

#### Step 2.1: Organization Schema

```json
{
  "@type": "Organization",
  "name": "CADO",
  "url": "https://cado.md",
  "logo": "https://cado.md/logo/CADO-ro.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+373-69-645-153",
    "contactType": "sales",
    "areaServed": "MD",
    "availableLanguage": ["Romanian", "Russian"]
  }
}
```

#### Step 2.2: Product Schema

- Add to product pages
- Include price, availability, reviews
- Add merchant return policy

#### Step 2.3: LocalBusiness Schema

```json
{
  "@type": "LocalBusiness",
  "name": "CADO Gift Shop",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "str. Alecu Russo, 15",
    "addressLocality": "Chișinău",
    "addressCountry": "MD"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.0105,
    "longitude": 28.8638
  }
}
```

### Phase 3: Performance Optimization (Week 3)

#### Step 3.1: Image Optimization

- Remove all `unoptimized` flags
- Implement responsive images with srcset
- Add WebP format support
- Configure proper lazy loading

#### Step 3.2: Core Web Vitals

- Optimize Largest Contentful Paint (LCP)
- Minimize Cumulative Layout Shift (CLS)
- Improve First Input Delay (FID)

### Phase 4: Content & Meta Enhancements (Week 4)

#### Step 4.1: Meta Description Templates

**Romanian Pattern**:
"[Product] - Livrare rapidă în Chișinău și Moldova. Comandă online cadouri corporate și personale. Preț: [price] MDL"

**Russian Pattern**:
"[Product] - Быстрая доставка в Кишиневе и Молдове. Заказать корпоративные и личные подарки онлайн. Цена: [price] MDL"

#### Step 4.2: Title Tag Optimization

- Keep under 60 characters
- Include location (Moldova/Chișinău)
- Add price for products
- Include "cadouri corporate" or "корпоративные подарки"

### Phase 5: Local SEO Enhancement (Week 5)

#### Step 5.1: NAP Consistency

- Standardize business info across all pages
- Add schema markup for multiple locations
- Ensure phone numbers are clickable

#### Step 5.2: Local Content Strategy

- Create location-specific landing pages
- Add delivery information by region
- Include local payment methods (Paynet)

### Phase 6: Advanced Optimizations (Week 6+)

#### Step 6.1: Search Enhancement

- Implement search autocomplete
- Add search suggestions in both languages
- Create search results page with filters
- Add "no results" suggestions

#### Step 6.2: URL Structure Improvements

- Add breadcrumb navigation
- Implement category/subcategory URLs
- Create clean product URLs with slugs

#### Step 6.3: Internal Linking

- Add related products
- Implement category cross-links
- Create content hubs for gift guides

## Priority Matrix

### 🔴 Critical (Do First)

1. Create sitemap.xml
2. Add robots.txt
3. Implement hreflang tags
4. Fix image optimization

### 🟡 High Priority

5. Add structured data
6. Optimize meta descriptions
7. Implement canonical URLs
8. Improve Core Web Vitals

### 🟢 Medium Priority

9. Enhance search functionality
10. Add breadcrumb schema
11. Create local landing pages
12. Implement FAQ schema

### 🔵 Nice to Have

13. Add review schema
14. Implement AMP pages
15. Create video sitemaps
16. Add RSS feeds

## Monitoring & KPIs

### Tools Setup

- Google Search Console (verify all language versions)
- Yandex Webmaster Tools
- Google Analytics 4 with Enhanced E-commerce
- Core Web Vitals monitoring

### Key Metrics to Track

- Organic traffic by language
- Rankings for "cadouri corporate Moldova"
- Local pack visibility
- Page speed scores
- Crawl errors and indexation

## Competitor Analysis

### Main Competitors in Moldova

1. **Floaria.md** - Strong local SEO, good schema implementation
2. **Cadouri.md** - Better content strategy, weak technical SEO
3. **Gifts.md** - Good site structure, poor mobile experience

### Competitive Advantages to Leverage

- Bilingual content (RO/RU)
- Corporate gifting focus
- Fast delivery in Chișinău
- Personalization options

## Content Recommendations

### Blog Topics for Moldova Market

1. "Ghid cadouri corporate pentru echipe din Moldova"
2. "Топ-10 подарков для бизнес-партнеров"
3. "Tradiții de cadouri moldovenești pentru sărbători"
4. "Cum să alegi cadoul perfect pentru Mărțișor"

### Landing Pages to Create

- /cadouri-corporate-chisinau
- /livrare-rapida-moldova
- /cadouri-personalizate
- /ru/korporativnye-podarki

## Technical Implementation Details

### Files to Create/Modify

1. **`/public/robots.txt`** - New file
2. **`/app/sitemap.ts`** - Dynamic sitemap generation
3. **`/components/SEO/StructuredData.tsx`** - Schema components
4. **`/lib/seo/hreflang.ts`** - Hreflang utilities
5. **Update all `layout.tsx`** - Add SEO enhancements

### Code Patterns to Implement

#### Canonical URL Pattern

```typescript
const canonical = `https://cado.md/${locale}${pathname}`;
```

#### Hreflang Pattern

```typescript
const alternates = {
  languages: {
    ro: '/ro/catalog',
    ru: '/ru/katalog',
    en: '/en/catalog',
  },
};
```

## Risk Mitigation

### Potential Issues

- **Duplicate content** - Implement proper canonicals
- **Thin content** - Enhance product descriptions
- **Slow mobile speed** - Optimize images first
- **Low crawl budget** - Clean up URL parameters

## Success Metrics

### 3-Month Goals

- 50% increase in organic traffic
- Top 3 rankings for "cadouri corporate Chișinău"
- 30% improvement in Core Web Vitals
- 100% indexation of product pages

### 6-Month Goals

- Double organic conversions
- Achieve position 0 (featured snippets)
- 40% of traffic from local searches
- Establish domain authority above 30

## Next Steps

1. **Immediate**: Create robots.txt and basic sitemap
2. **This Week**: Implement hreflang and canonical tags
3. **Next Week**: Add structured data to key pages
4. **Ongoing**: Monitor and iterate based on Search Console data

This comprehensive plan provides a roadmap for transforming your site into a dominant player in Moldova's e-commerce gift market. Each phase builds upon the previous one, ensuring sustainable SEO growth.
