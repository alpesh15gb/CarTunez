import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SiteChrome } from '@/components/SiteChrome';
import { BuildProvider } from '@/components/BuildProvider';
import { MotionProvider } from '@/components/MotionProvider';
import { site } from '@/lib/site';
import { businessGraph, pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
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
import './services.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  ...pageMetadata('Car Accessories & Customisation in Hyderabad', 'CARTUNEZ, Secunderabad: car interiors, seat covers, body kits, Pioneer audio, floor mats and ambient lighting. Explore options and request a quote.', '/'),
  metadataBase: new URL(site.url),
  title: { default: 'Car Accessories & Customisation in Hyderabad | CARTUNEZ', template: '%s | CARTUNEZ' },
  applicationName: site.name, category: 'automotive',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true,
    'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};
export const viewport: Viewport = { themeColor: '#07090C', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN" className={inter.variable}><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <MotionProvider><BuildProvider><SiteChrome>{children}</SiteChrome></BuildProvider></MotionProvider>
    <JsonLd data={businessGraph} />
  </body></html>;
}
