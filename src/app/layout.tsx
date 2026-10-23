import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SiteChrome } from '@/components/SiteChrome';
import { BuildProvider } from '@/components/BuildProvider';
import { MotionProvider } from '@/components/MotionProvider';
import { site } from '@/lib/site';
import './globals.css';
import './refinement.css';
import './infotainment.css';
import './cabin-studio.css';
import './pioneer.css';
import './revamp.css';
import './midnight.css';
import './campaign.css';
import './scroll-experience.css';
import './hero-3d.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'CARTUNEZ — The Midnight Workshop.', template: '%s | CARTUNEZ' },
  description: 'Ordinary ends here. Explore the CARTUNEZ Midnight Workshop, configure your upgrade preferences and request a quote for your car.',
  openGraph: { title: 'CARTUNEZ — The Midnight Workshop.', description: 'Car customisation. Personal by design.', url: site.url, siteName: site.name,
    locale: 'en_IN', type: 'website', images: [{ url: '/images/campaign/og-v8.jpg', width: 1200, height: 630, alt: 'Silver custom coupe in the CARTUNEZ concept garage' }] },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#07090C', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const business = { '@context': 'https://schema.org', '@type': 'AutomotiveBusiness', name: site.name,
    url: site.url, telephone: site.phone, image: `${site.url}/images/cartunez-logo.webp`,
    description: 'Car accessories and customisation: interiors, body kits, infotainment, audio, performance and utility.',
    ...(site.address && site.city ? { address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: site.city, addressCountry: 'IN' } } : {}),
    ...(site.instagramUrl ? { sameAs: [site.instagramUrl] } : {}),
  };
  return <html lang="en" className={inter.variable}><head>
    <link rel="preload" as="image" type="image/webp" href="/images/bmw-studio-poster.webp" fetchPriority="high" />
  </head><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <MotionProvider><BuildProvider><SiteChrome>{children}</SiteChrome></BuildProvider></MotionProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }} />
  </body></html>;
}
