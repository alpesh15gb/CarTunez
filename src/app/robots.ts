import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  // Search and AI search crawlers can read public pages and all rendering assets.
  // These are crawl controls, not authentication for the separately hosted backend.
  return { rules: { userAgent: '*', allow: '/', disallow: ['/app', '/admin', '/store', '/healthz', '/release.json'] }, sitemap: `${site.url}/sitemap.xml` };
}
