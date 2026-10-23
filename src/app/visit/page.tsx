import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Breadcrumbs, ConsultationCta } from '@/components/ServiceContent';
import { JsonLd } from '@/components/JsonLd';
import { site } from '@/lib/site';
import { breadcrumbGraph, businessId, pageGraph, pageMetadata } from '@/lib/seo';

const title = 'Visit CARTUNEZ in Secunderabad, Hyderabad';
const description = 'Find CARTUNEZ at Shop 12 & 13, Veer Hanuman Temple, S.P. Road, Secunderabad 500003. Call +91 99496 95030 to arrange a car accessories consultation.';
export const metadata = pageMetadata(title, description, '/visit/');

export default function VisitPage() {
  return <><main id="main" className="service-page section-gutter">
    <Breadcrumbs items={[{ name: 'Visit the workshop', href: '/visit/' }]} />
    <header className="service-hero"><p className="v8-label">CARTUNEZ / SECUNDERABAD, HYDERABAD</p><h1>Your next upgrade.<br /><span>Starts here.</span></h1><p className="service-lead">Visit our car accessories and customisation workshop on S.P. Road in Secunderabad. Bring your car, a reference or simply an idea. We’ll help you explore the details.</p></header>
    <section className="service-visit" aria-labelledby="find-workshop-title"><div><p className="v8-label">COME BY THE WORKSHOP</p><h2 id="find-workshop-title">Find CARTUNEZ.</h2><address><strong>{site.name}</strong><br />{site.address}<br />{site.city}, Hyderabad<br />{site.region} {site.postalCode}, India</address><a className="v8-button" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">Find us on Google Maps <span aria-hidden="true">↗</span></a></div>
      <div className="service-contact"><h3>Let’s plan your visit.</h3><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><a href={`mailto:${site.email}`}>{site.email}</a><p>Call or WhatsApp to confirm opening hours, a suitable visit time and product availability before travelling.</p><Link className="service-inline-link" href="/enquire/?intent=visit" prefetch={false}>Request a workshop visit <span aria-hidden="true">↗</span></Link></div></section>
    <section className="service-process" aria-labelledby="visit-brief-title"><h2 id="visit-brief-title">Make the visit<br />work for you.</h2><ol><li><h3>Bring your vehicle details.</h3><p>Make, model, year, variant and photographs help the team assess fitment and existing equipment.</p></li><li><h3>Show us your direction.</h3><p>A reference image, preferred material or listening priority gives the conversation a useful starting point.</p></li><li><h3>Ask about the complete scope.</h3><p>Discuss products, installation, availability and applicable warranty terms before agreeing to any work.</p></li></ol></section>
    <ConsultationCta />
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [{ ...pageGraph('/visit/', title, description, 'ContactPage'), mainEntity: { '@id': businessId } }, breadcrumbGraph([{ name: 'Home', path: '/' }, { name: 'Visit the workshop', path: '/visit/' }])] }} />
  </main><Footer /></>;
}
