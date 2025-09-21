import { generateSitemapEntries, SitemapEntry } from '@/lib/sitemap-generator';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlEntries = entries.map(entry => {
    let xml = '  <url>\n';
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;

    if (entry.lastModified) {
      const date = entry.lastModified instanceof Date
        ? entry.lastModified.toISOString()
        : entry.lastModified;
      xml += `    <lastmod>${date}</lastmod>\n`;
    }

    if (entry.changeFrequency) {
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }

    // Add hreflang annotations using xhtml:link
    if (entry.alternates?.languages) {
      for (const [lang, url] of Object.entries(entry.alternates.languages)) {
        xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url)}"/>\n`;
      }
    }

    xml += '  </url>';
    return xml;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>`;
}

export async function GET() {
  try {
    const entries = await generateSitemapEntries();
    const xml = generateSitemapXML(entries);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return a basic sitemap with just the homepage on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cado.md</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
      },
      status: 500,
    });
  }
}