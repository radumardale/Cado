import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSitemapEntries } from '@/lib/sitemap-generator';
import { GET } from '@/app/sitemap.xml/route';
import { Product } from '@/models/product/product';
import { Blog } from '@/models/blog/blog';
import connectMongo from '@/lib/connect-mongo';
import { StockState } from '@/lib/enums/StockState';
import type { Query } from 'mongoose';

// Mock the database connection and models
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/blog/blog');

// Helper to create mock query chain
function createMockQuery<T>(data: T[]): Partial<Query<unknown, unknown>> {
  return {
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(data),
    }),
  };
}

function createMockQueryWithError(error: Error): Partial<Query<unknown, unknown>> {
  return {
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockRejectedValue(error),
    }),
  };
}

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful DB connection
    vi.mocked(connectMongo).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof connectMongo>>
    );
  });

  it('should generate sitemap with static pages', async () => {
    // Mock empty product and blog responses
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check that static pages are included
    const urls = result.map(entry => entry.url);

    // Check for homepage in all languages
    expect(urls).toContain('http://localhost:3000/ro');
    expect(urls).toContain('http://localhost:3000/ru');
    expect(urls).toContain('http://localhost:3000/en');

    // Check for catalog page
    expect(urls.some(url => url.includes('/catalog'))).toBe(true);

    // Check for about-us page
    expect(urls.some(url => url.includes('/about-us'))).toBe(true);

    // Check for contacts page
    expect(urls.some(url => url.includes('/contacts'))).toBe(true);
  });

  it('should include hreflang annotations for all pages', async () => {
    // Mock empty responses
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check first entry (homepage) has hreflang
    const homepage = result.find(entry => entry.url === 'http://localhost:3000/ro');
    expect(homepage?.alternates?.languages).toBeDefined();
    expect(homepage?.alternates?.languages?.ro).toBe('http://localhost:3000/ro');
    expect(homepage?.alternates?.languages?.ru).toBe('http://localhost:3000/ru');
    expect(homepage?.alternates?.languages?.en).toBe('http://localhost:3000/en');
  });

  it('should only include in-stock products', async () => {
    const mockProducts = [
      { custom_id: 'prod1', updatedAt: new Date() },
      { custom_id: 'prod2', updatedAt: new Date() },
    ];

    // Mock Product.find to return in-stock products
    const mockFind = vi.fn().mockReturnValue(createMockQuery(mockProducts));
    vi.mocked(Product.find).mockImplementation(mockFind as typeof Product.find);

    // Mock empty blogs
    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    await generateSitemapEntries();

    // Verify that Product.find was called with the correct filter
    expect(mockFind).toHaveBeenCalledWith({
      'stock_availability.state': StockState.IN_STOCK,
    });
  });

  it('should include products with proper URLs', async () => {
    const mockProducts = [{ custom_id: 'test123', updatedAt: new Date('2024-01-01') }];

    vi.mocked(Product.find).mockReturnValue(
      createMockQuery(mockProducts) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check that product URLs are generated correctly for all languages
    const productUrls = result.filter(entry => entry.url.includes('/catalog/product/'));

    expect(productUrls).toHaveLength(3); // 3 languages
    expect(
      productUrls.some(entry => entry.url === 'http://localhost:3000/ro/catalog/product/test123')
    ).toBe(true);
    expect(
      productUrls.some(entry => entry.url === 'http://localhost:3000/ru/catalog/product/test123')
    ).toBe(true);
    expect(
      productUrls.some(entry => entry.url === 'http://localhost:3000/en/catalog/product/test123')
    ).toBe(true);
  });

  it('should include blog posts with proper URLs', async () => {
    const mockBlogs = [{ _id: 'blog123', date: new Date('2024-01-01') }];

    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery(mockBlogs) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check that blog URLs are generated correctly
    const blogUrls = result.filter(entry => entry.url.includes('/blog/'));

    expect(blogUrls).toHaveLength(3); // 3 languages
    expect(blogUrls.some(entry => entry.url === 'http://localhost:3000/ro/blog/blog123')).toBe(
      true
    );
  });

  it('should include category and occasion filter pages', async () => {
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check for category pages
    const categoryUrls = result.filter(entry => entry.url.includes('category='));
    expect(categoryUrls.length).toBeGreaterThan(0);

    // Check for specific category
    expect(categoryUrls.some(entry => entry.url.includes('category=FOR_HER'))).toBe(true);

    // Check for occasion pages
    const occasionUrls = result.filter(entry => entry.url.includes('occasion='));
    expect(occasionUrls.length).toBeGreaterThan(0);

    // Check for specific occasion
    expect(occasionUrls.some(entry => entry.url.includes('occasion=VALENTINES_DAY'))).toBe(true);
  });

  it('should handle database errors gracefully', async () => {
    // Mock Product.find to throw an error
    vi.mocked(Product.find).mockReturnValue(
      createMockQueryWithError(new Error('Database connection failed')) as unknown as ReturnType<
        typeof Product.find
      >
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQueryWithError(new Error('Database connection failed')) as unknown as ReturnType<
        typeof Blog.find
      >
    );

    // Should not throw, but continue with static pages
    const result = await generateSitemapEntries();

    // Should still have static pages even if dynamic content fails
    expect(result.length).toBeGreaterThan(0);
    const urls = result.map(entry => entry.url);
    expect(urls.some(url => url.includes('/ro'))).toBe(true);
  });

  it('should set correct changeFrequency and priority values', async () => {
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await generateSitemapEntries();

    // Check homepage has highest priority
    const homepage = result.find(entry => entry.url === 'http://localhost:3000/ro');
    expect(homepage?.priority).toBe(1.0);
    expect(homepage?.changeFrequency).toBe('daily');

    // Check catalog has high priority
    const catalog = result.find(
      entry => entry.url.includes('/catalog') && !entry.url.includes('?')
    );
    expect(catalog?.priority).toBe(0.9);
    expect(catalog?.changeFrequency).toBe('daily');
  });

  it('should use environment BASE_URL when available', async () => {
    // Set BASE_URL environment variable
    const originalBaseUrl = process.env.BASE_URL;
    process.env.BASE_URL = 'https://example.com';

    // Need to re-import to get the new BASE_URL
    vi.resetModules();
    const { generateSitemapEntries: sitemapWithEnv } = await import('@/lib/sitemap-generator');

    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const result = await sitemapWithEnv();

    // Check that URLs use the environment BASE_URL
    expect(result[0].url).toContain('https://example.com');

    // Restore original BASE_URL
    process.env.BASE_URL = originalBaseUrl;
  });
});

describe('Sitemap Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful DB connection
    vi.mocked(connectMongo).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof connectMongo>>
    );
  });

  it('should return XML with correct content-type header', async () => {
    // Mock empty product and blog responses
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const response = await GET();

    // Check content-type header
    expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');
    expect(response.headers.get('cache-control')).toBe(
      'public, s-maxage=86400, stale-while-revalidate'
    );
    expect(response.status).toBe(200);
  });

  it('should return valid XML structure', async () => {
    // Mock empty product and blog responses
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const response = await GET();
    const xmlContent = await response.text();

    // Check XML structure
    expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xmlContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xmlContent).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xmlContent).toContain('</urlset>');

    // Check for URLs
    expect(xmlContent).toContain('<url>');
    expect(xmlContent).toContain('<loc>');
    expect(xmlContent).toContain('</url>');
  });

  it('should include hreflang annotations in XML', async () => {
    // Mock empty product and blog responses
    vi.mocked(Product.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const response = await GET();
    const xmlContent = await response.text();

    // Check for hreflang annotations
    expect(xmlContent).toContain('<xhtml:link rel="alternate" hreflang="ro"');
    expect(xmlContent).toContain('<xhtml:link rel="alternate" hreflang="ru"');
    expect(xmlContent).toContain('<xhtml:link rel="alternate" hreflang="en"');
  });

  it('should properly escape XML entities', async () => {
    const mockProducts = [{ custom_id: 'test&123', updatedAt: new Date() }];

    vi.mocked(Product.find).mockReturnValue(
      createMockQuery(mockProducts) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery([]) as unknown as ReturnType<typeof Blog.find>
    );

    const response = await GET();
    const xmlContent = await response.text();

    // Check that & is properly escaped
    expect(xmlContent).toContain('test&amp;123');
    expect(xmlContent).not.toContain('test&123');
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    vi.mocked(Product.find).mockReturnValue(
      createMockQueryWithError(new Error('Database error')) as unknown as ReturnType<
        typeof Product.find
      >
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQueryWithError(new Error('Database error')) as unknown as ReturnType<
        typeof Blog.find
      >
    );

    const response = await GET();

    // Should still return XML response even on error
    expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');

    const xmlContent = await response.text();
    expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xmlContent).toContain('<urlset');
  });

  it('should include products and blogs in XML output', async () => {
    const mockProducts = [{ custom_id: 'product123', updatedAt: new Date('2024-01-01') }];

    const mockBlogs = [{ _id: 'blog456', date: new Date('2024-01-01') }];

    vi.mocked(Product.find).mockReturnValue(
      createMockQuery(mockProducts) as unknown as ReturnType<typeof Product.find>
    );

    vi.mocked(Blog.find).mockReturnValue(
      createMockQuery(mockBlogs) as unknown as ReturnType<typeof Blog.find>
    );

    const response = await GET();
    const xmlContent = await response.text();

    // Check for product URLs
    expect(xmlContent).toContain('<loc>http://localhost:3000/ro/catalog/product/product123</loc>');
    expect(xmlContent).toContain('<loc>http://localhost:3000/ru/catalog/product/product123</loc>');
    expect(xmlContent).toContain('<loc>http://localhost:3000/en/catalog/product/product123</loc>');

    // Check for blog URLs
    expect(xmlContent).toContain('<loc>http://localhost:3000/ro/blog/blog456</loc>');
    expect(xmlContent).toContain('<loc>http://localhost:3000/ru/blog/blog456</loc>');
    expect(xmlContent).toContain('<loc>http://localhost:3000/en/blog/blog456</loc>');
  });
});
