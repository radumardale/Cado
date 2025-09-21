import { BreadcrumbListSchema } from '@/lib/seo/breadcrumb-schema';

interface BreadcrumbJsonLdProps {
  breadcrumbSchema: BreadcrumbListSchema;
}

/**
 * Server Component that renders BreadcrumbList JSON-LD structured data
 * This component should be placed in the <head> section of pages
 */
export default function BreadcrumbJsonLd({ breadcrumbSchema }: BreadcrumbJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema, null, 0)
      }}
    />
  );
}