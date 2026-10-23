import { HomeExperience } from '@/components/HomeExperience';
import type { Metadata } from 'next';
import { ServiceDiscovery } from '@/components/ServiceContent';
import { JsonLd } from '@/components/JsonLd';
import { pageGraph } from '@/lib/seo';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default function HomePage() { return <>
  <link rel="preload" as="image" type="image/webp" href="/images/bmw-studio-poster.webp" fetchPriority="high" />
  <HomeExperience serviceContent={<ServiceDiscovery />} />
  <JsonLd data={{ '@context': 'https://schema.org', ...pageGraph('/', 'Car Accessories & Customisation in Hyderabad | CARTUNEZ', 'Explore car accessories, customisation and the CARTUNEZ workshop in Secunderabad, Hyderabad.') }} />
</>; }
