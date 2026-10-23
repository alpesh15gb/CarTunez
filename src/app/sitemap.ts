import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/services/', ...services.map(service => `/services/${service.slug}/`), '/visit/', '/enquire/']
    .map(path => ({ url: `${site.url}${path}` }));
}
