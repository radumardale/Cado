import { describe, it, expect, vi, beforeEach } from 'vitest';
import sitemap from '@/app/sitemap';
import { Product } from '@/models/product/product';
import { Blog } from '@/models/blog/blog';
import connectMongo from '@/lib/connect-mongo';
import { StockState } from '@/lib/enums/StockState';

// Mock the database connection and models
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/blog/blog');

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful DB connection
    vi.mocked(connectMongo).mockResolvedValue({} as any);
  });

  it('should generate sitemap with static pages', async () => {
    // Mock empty product and blog responses
    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemap();

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
    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemap();

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
      { custom_id: 'prod2', updatedAt: new Date() }
    ];

    // Mock Product.find to return in-stock products
    const mockFind = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProducts)
      })
    });
    vi.mocked(Product.find).mockImplementation(mockFind);

    // Mock empty blogs
    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    await sitemap();

    // Verify that Product.find was called with the correct filter
    expect(mockFind).toHaveBeenCalledWith({
      'stock_availability.state': StockState.IN_STOCK
    });
  });

  it('should include products with proper URLs', async () => {
    const mockProducts = [
      { custom_id: 'test123', updatedAt: new Date('2024-01-01') }
    ];

    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProducts)
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemap();

    // Check that product URLs are generated correctly for all languages
    const productUrls = result.filter(entry =>
      entry.url.includes('/catalog/product/')
    );

    expect(productUrls).toHaveLength(3); // 3 languages
    expect(productUrls.some(entry =>
      entry.url === 'http://localhost:3000/ro/catalog/product/test123'
    )).toBe(true);
    expect(productUrls.some(entry =>
      entry.url === 'http://localhost:3000/ru/catalog/product/test123'
    )).toBe(true);
    expect(productUrls.some(entry =>
      entry.url === 'http://localhost:3000/en/catalog/product/test123'
    )).toBe(true);
  });

  it('should include blog posts with proper URLs', async () => {
    const mockBlogs = [
      { _id: 'blog123', date: new Date('2024-01-01') }
    ];

    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockBlogs)
      })
    } as any);

    const result = await sitemap();

    // Check that blog URLs are generated correctly
    const blogUrls = result.filter(entry =>
      entry.url.includes('/blog/')
    );

    expect(blogUrls).toHaveLength(3); // 3 languages
    expect(blogUrls.some(entry =>
      entry.url === 'http://localhost:3000/ro/blog/blog123'
    )).toBe(true);
  });

  it('should include category and occasion filter pages', async () => {
    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemap();

    // Check for category pages
    const categoryUrls = result.filter(entry =>
      entry.url.includes('category=')
    );
    expect(categoryUrls.length).toBeGreaterThan(0);

    // Check for specific category
    expect(categoryUrls.some(entry =>
      entry.url.includes('category=FOR_HER')
    )).toBe(true);

    // Check for occasion pages
    const occasionUrls = result.filter(entry =>
      entry.url.includes('occasion=')
    );
    expect(occasionUrls.length).toBeGreaterThan(0);

    // Check for specific occasion
    expect(occasionUrls.some(entry =>
      entry.url.includes('occasion=VALENTINES_DAY')
    )).toBe(true);
  });

  it('should handle database errors gracefully', async () => {
    // Mock Product.find to throw an error
    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error('Database connection failed'))
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error('Database connection failed'))
      })
    } as any);

    // Should not throw, but continue with static pages
    const result = await sitemap();

    // Should still have static pages even if dynamic content fails
    expect(result.length).toBeGreaterThan(0);
    const urls = result.map(entry => entry.url);
    expect(urls.some(url => url.includes('/ro'))).toBe(true);
  });

  it('should set correct changeFrequency and priority values', async () => {
    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemap();

    // Check homepage has highest priority
    const homepage = result.find(entry =>
      entry.url === 'http://localhost:3000/ro' && !entry.url.includes('/')
    );
    expect(homepage?.priority).toBe(1.0);
    expect(homepage?.changeFrequency).toBe('daily');

    // Check catalog has high priority
    const catalog = result.find(entry =>
      entry.url.includes('/catalog') && !entry.url.includes('?')
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
    const { default: sitemapWithEnv } = await import('@/app/sitemap');

    vi.mocked(Product.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    vi.mocked(Blog.find).mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    } as any);

    const result = await sitemapWithEnv();

    // Check that URLs use the environment BASE_URL
    expect(result[0].url).toContain('https://example.com');

    // Restore original BASE_URL
    process.env.BASE_URL = originalBaseUrl;
  });
});