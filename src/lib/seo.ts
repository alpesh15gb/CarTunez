import type { Metadata } from 'next';
import { site } from './site';
import { services } from './services';

export const businessId = `${site.url}/#business`;
export const websiteId = `${site.url}/#website`;
export const absoluteUrl = (path: string) => new URL(path, `${site.url}/`).href;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} | ${site.name}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: {
      type: 'website', locale: 'en_IN', siteName: site.name, url,
      title: socialTitle, description,
      images: [{ url: absoluteUrl('/images/campaign/og-v8.jpg'), width: 1200, height: 630,
        alt: 'CARTUNEZ car accessories and customisation in Hyderabad' }],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description,
      images: [absoluteUrl('/images/campaign/og-v8.jpg')] },
  };
}

export const businessGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['AutoPartsStore', 'AutomotiveBusiness'], '@id': businessId,
      name: site.name, alternateName: 'CarTunez', url: `${site.url}/`,
      description: 'Car accessories and customisation in Secunderabad, Hyderabad: interiors, seat covers, body kits, Pioneer infotainment, car audio, floor mats, ambient lighting and utility accessories.',
      telephone: site.phone, email: site.email,
      logo: absoluteUrl('/images/cartunez-logo.webp'),
      image: absoluteUrl('/images/cartunez-logo.webp'),
      address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: site.city,
        addressRegion: site.region, postalCode: site.postalCode, addressCountry: 'IN' },
      areaServed: [{ '@type': 'City', name: 'Hyderabad' }, { '@type': 'City', name: 'Secunderabad' }],
      hasMap: site.mapsUrl,
      ...(site.instagramUrl ? { sameAs: [site.instagramUrl] } : {}),
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Car customisation services',
        itemListElement: services.map(service => ({ '@type': 'Offer', itemOffered: {
          '@type': 'Service', '@id': absoluteUrl(`/services/${service.slug}/#service`),
          name: service.name, url: absoluteUrl(`/services/${service.slug}/`), provider: { '@id': businessId },
        } })),
      },
    },
    { '@type': 'WebSite', '@id': websiteId, name: site.name, alternateName: 'CarTunez',
      url: `${site.url}/`, inLanguage: 'en-IN', publisher: { '@id': businessId } },
  ],
};

export function pageGraph(path: string, name: string, description: string, type = 'WebPage') {
  return { '@type': type, '@id': absoluteUrl(`${path}#webpage`), url: absoluteUrl(path),
    name, description, inLanguage: 'en-IN', isPartOf: { '@id': websiteId }, about: { '@id': businessId } };
}

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({
    '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path),
  })) };
}
