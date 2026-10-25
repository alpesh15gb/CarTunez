import { Footer } from '@/components/Footer';
import { Breadcrumbs, ConsultationCta, ServiceCards } from '@/components/ServiceContent';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbGraph, pageGraph, pageMetadata } from '@/lib/seo';

const title = 'Car Accessories & Customisation Services in Hyderabad';
const description = 'Explore CARTUNEZ services in Secunderabad: interiors, body kits, Pioneer audio, floor mats, ambient lighting and utility accessories for your car.';
export const metadata = pageMetadata(title, description, '/services/');

export default function ServicesPage() {
  return <><main id="main" className="service-page section-gutter">
    <Breadcrumbs items={[{ name: 'Services', href: '/services/' }]} />
    <header className="service-hero"><p className="v8-label">CARTUNEZ / HYDERABAD &amp; SECUNDERABAD</p>
      <h1>Car accessories.<br /><span>Your signature.</span></h1>
      <p className="service-lead">Looking for seat covers, a new screen, better speakers or a body kit? Browse our services, then tell us your car’s make, model and year. Visit us in Secunderabad to discuss the options.</p>
    </header>
    <section aria-labelledby="all-services-title"><h2 className="service-small-heading" id="all-services-title">Explore our car customisation services</h2><ServiceCards /></section>
    <section className="service-process" aria-labelledby="plan-title"><h2 id="plan-title">How it works.</h2><ol>
      <li><h3>Share your car.</h3><p>Make, model, year, variant and photographs help us understand the starting point.</p></li>
      <li><h3>Discuss the details.</h3><p>Compare suitable materials and products, required installation and your budget direction.</p></li>
      <li><h3>Agree the scope.</h3><p>Confirm the quote, product availability, installation and applicable warranty terms before proceeding.</p></li>
    </ol></section><ConsultationCta />
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [pageGraph('/services/', title, description, 'CollectionPage'), breadcrumbGraph([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }])] }} />
  </main><Footer /></>;
}
