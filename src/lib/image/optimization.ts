/**
 * Image optimization utilities for Next.js Image component
 * Provides standardized sizes, quality settings, and configurations
 */

// Image size configurations for different contexts
export const imageSizes = {
  hero: {
    mobile: { width: 768, height: 432 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
  },
  product: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 300, height: 300 },
    detail: { width: 800, height: 800 },
    gallery: { width: 1200, height: 1200 },
  },
  category: {
    card: { width: 400, height: 300 },
    banner: { width: 1200, height: 400 },
  },
  blog: {
    card: { width: 400, height: 250 },
    featured: { width: 800, height: 450 },
    content: { width: 1200, height: 675 },
  },
  admin: {
    thumbnail: { width: 100, height: 100 },
    preview: { width: 200, height: 200 },
  },
  logo: {
    small: { width: 100, height: 40 },
    medium: { width: 150, height: 60 },
    large: { width: 200, height: 80 },
  },
  icon: {
    small: { width: 24, height: 24 },
    medium: { width: 32, height: 32 },
    large: { width: 48, height: 48 },
  },
} as const;

// Quality settings by image type
export const imageQuality = {
  hero: 85,          // Hero images: high quality but optimized
  product: 85,       // Product images: good quality for detail
  thumbnail: 75,     // Thumbnails: lower quality acceptable
  icon: 90,          // Icons: higher quality for sharpness
  logo: 90,          // Logos: higher quality for brand representation
  default: 80,       // Default quality
} as const;

// Responsive sizes attribute generator
export function generateSizes(context: 'full' | 'half' | 'third' | 'quarter' = 'full'): string {
  switch (context) {
    case 'full':
      return '100vw';
    case 'half':
      return '(max-width: 768px) 100vw, 50vw';
    case 'third':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'quarter':
      return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw';
    default:
      return '100vw';
  }
}

// Get appropriate image dimensions based on context
export function getImageDimensions(
  context: keyof typeof imageSizes,
  size: string = 'medium'
): { width: number; height: number } {
  const contextSizes = imageSizes[context];

  if (contextSizes && size in contextSizes) {
    return contextSizes[size as keyof typeof contextSizes];
  }

  // Default fallback dimensions
  return { width: 800, height: 600 };
}

// Get appropriate quality setting
export function getImageQuality(context: keyof typeof imageQuality): number {
  return imageQuality[context] || imageQuality.default;
}

// Loading priority helper
export function getLoadingPriority(
  isAboveFold: boolean = false,
  isHero: boolean = false
): 'eager' | 'lazy' {
  return isAboveFold || isHero ? 'eager' : 'lazy';
}

// Generate placeholder blur data URL (for static images)
// Note: For dynamic images, this would need to be generated server-side
export const staticBlurDataURLs = {
  // These would be pre-generated for static assets
  logo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
  // Add more as needed
};

// Helper to determine if image should remain unoptimized
// (e.g., for certain animated images that break with optimization)
export function shouldRemainUnoptimized(imagePath: string): boolean {
  // List any specific images that need to remain unoptimized
  // This should be minimal and well-documented
  const unoptimizedPaths: string[] = [
    // Add paths here only if absolutely necessary
  ];

  return unoptimizedPaths.includes(imagePath);
}