import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs, ConsultationCta, ServiceCards, ServiceVisual } from '@/components/ServiceContent';
import { findService, services } from '@/lib/services';
import { absoluteUrl, breadcrumbGraph, businessId, pageGraph, pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  return pageMetadata(service.title, service.description, `/services/${service.slug}/`);
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  const path = `/services/${service.slug}/`;
  return <><main id="main" className="service-page section-gutter">
    <Breadcrumbs items={[{ name: 'Services', href: '/services/' }, { name: service.name, href: path }]} />
    <header className="service-hero"><p className="v8-label">{service.eyebrow}</p>
      <h1>{service.name}<span> in Hyderabad.</span></h1><p className="service-lead">{service.answer}</p>
      <Link className="service-inline-link" href={`/#${service.chapter}`} prefetch={false}>Explore the interactive experience <span aria-hidden="true">↗</span></Link>
    </header>
    <div className="service-editorial"><ServiceVisual service={service} /><aside className="service-brief"><p className="v8-label">YOUR ENQUIRY CHECKLIST</p><h2>{service.headline}</h2><p>For a useful recommendation, share:</p><ul>{service.checklist.map(item => <li key={item}>{item}</li>)}</ul><Link className="service-inline-link" href="/visit/" prefetch={false}>Visit our Secunderabad workshop <span aria-hidden="true">↗</span></Link></aside></div>
    <div className="service-articles">{service.sections.map((section, index) => <section key={section.title} aria-labelledby={`detail-${index}`}><span className="v8-label">0{index + 1} / THE DETAILS</span><div><h2 id={`detail-${index}`}>{section.title}</h2><p>{section.text}</p></div></section>)}</div>
    <section className="service-questions" aria-labelledby="service-questions-title"><h2 id="service-questions-title">Before you decide.</h2><div>{service.questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    <ConsultationCta topic={service.name} />
    <section className="service-related" aria-labelledby="related-title"><h2 id="related-title">Complete the picture.</h2><ServiceCards exclude={service.slug} compact /></section>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      { ...pageGraph(path, service.title, service.description), mainEntity: { '@id': absoluteUrl(`${path}#service`) } },
      { '@type': 'Service', '@id': absoluteUrl(`${path}#service`), name: service.name,
        description: service.answer, url: absoluteUrl(path), serviceType: service.name,
        provider: { '@id': businessId }, areaServed: [{ '@type': 'City', name: 'Hyderabad' }, { '@type': 'City', name: 'Secunderabad' }] },
      breadcrumbGraph([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }, { name: service.name, path }]),
    ] }} />
  </main><Footer /></>;
}
