import { Product } from '@/models/product/product';
import { Blog } from '@/models/blog/blog';
import connectMongo from '@/lib/connect-mongo';
import type { MetadataRoute } from 'next';
import { CategoriesArr } from '@/lib/enums/Categories';
import { OcasionsArr } from '@/lib/enums/Ocasions';
import { StockState } from '@/lib/enums/StockState';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

const BASE_URL = process.env.BASE_URL || (process.env.NODE_ENV === 'production'
  ? 'https://cado.md'
  : 'http://localhost:3000');

const SUPPORTED_LOCALES = ['ro', 'ru', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectMongo();

  const sitemapEntries: SitemapEntry[] = [];

  // Static pages with multilingual support
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: 'catalog', priority: 0.9, changeFreq: 'daily' as const },
    { path: 'about-us', priority: 0.7, changeFreq: 'monthly' as const },
    { path: 'blogs', priority: 0.8, changeFreq: 'weekly' as const },
    { path: 'contacts', priority: 0.6, changeFreq: 'monthly' as const },
    { path: 'terms', priority: 0.5, changeFreq: 'yearly' as const },
  ];

  // Generate static pages with hreflang
  for (const page of staticPages) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = `${BASE_URL}/${locale}${page.path ? `/${page.path}` : ''}`;

      // Create alternates for hreflang
      const alternates: Record<string, string> = {};
      SUPPORTED_LOCALES.forEach(altLocale => {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${page.path ? `/${page.path}` : ''}`;
      });

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: { languages: alternates }
      });
    }
  }

  // Dynamic product pages - only IN_STOCK products
  try {
    const products = await Product.find({
      'stock_availability.state': StockState.IN_STOCK
    }).select('custom_id updatedAt').lean() as Array<{ custom_id: string; updatedAt?: Date }>;

    for (const product of products) {
      for (const locale of SUPPORTED_LOCALES) {
        const url = `${BASE_URL}/${locale}/catalog/product/${product.custom_id}`;

        const alternates: Record<string, string> = {};
        SUPPORTED_LOCALES.forEach(altLocale => {
          alternates[altLocale] = `${BASE_URL}/${altLocale}/catalog/product/${product.custom_id}`;
        });

        sitemapEntries.push({
          url,
          lastModified: product.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: { languages: alternates }
        });
      }
    }
  } catch (error) {
    console.warn('Error fetching products for sitemap:', error);
  }

  // Dynamic blog pages
  try {
    const blogs = await Blog.find({})
      .select('_id date')
      .lean() as Array<{ _id: string; date?: Date }>;

    for (const blog of blogs) {
      for (const locale of SUPPORTED_LOCALES) {
        const url = `${BASE_URL}/${locale}/blog/${blog._id}`;

        const alternates: Record<string, string> = {};
        SUPPORTED_LOCALES.forEach(altLocale => {
          alternates[altLocale] = `${BASE_URL}/${altLocale}/blog/${blog._id}`;
        });

        sitemapEntries.push({
          url,
          lastModified: blog.date || new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: { languages: alternates }
        });
      }
    }
  } catch (error) {
    console.warn('Error fetching blogs for sitemap:', error);
  }

  // Category pages
  for (const category of CategoriesArr) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = `${BASE_URL}/${locale}/catalog?category=${encodeURIComponent(category)}`;

      const alternates: Record<string, string> = {};
      SUPPORTED_LOCALES.forEach(altLocale => {
        alternates[altLocale] = `${BASE_URL}/${altLocale}/catalog?category=${encodeURIComponent(category)}`;
      });

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: { languages: alternates }
      });
    }
  }

  // Occasion pages
  for (const occasion of OcasionsArr) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = `${BASE_URL}/${locale}/catalog?occasion=${encodeURIComponent(occasion)}`;

      const alternates: Record<string, string> = {};
      SUPPORTED_LOCALES.forEach(altLocale => {
        alternates[altLocale] = `${BASE_URL}/${altLocale}/catalog?occasion=${encodeURIComponent(occasion)}`;
      });

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: { languages: alternates }
      });
    }
  }

  return sitemapEntries;
}