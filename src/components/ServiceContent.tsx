import Link from 'next/link';
import { services, type Service } from '@/lib/services';
import { site, whatsappUrl } from '@/lib/site';
import { CampaignImage } from './CampaignImage';

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return <nav className="service-breadcrumbs" aria-label="Breadcrumb"><ol>
    <li><Link href="/" prefetch={false}>Home</Link></li>
    {items.map((item, index) => <li key={item.href}>{index === items.length - 1
      ? <span aria-current="page">{item.name}</span>
      : <Link href={item.href} prefetch={false}>{item.name}</Link>}</li>)}
  </ol></nav>;
}

export function ServiceCards({ exclude, compact = false }: { exclude?: string; compact?: boolean }) {
  return <div className={`service-cards ${compact ? 'service-cards-compact' : ''}`}>
    {services.filter(service => service.slug !== exclude).map((service, index) => <Link
      className="service-card" href={`/services/${service.slug}/`} prefetch={false} key={service.slug}>
      <span className="service-card-index">0{index + 1} / EXPLORE</span>
      <h3>{service.name}</h3>{compact ? null : <p>{service.answer}</p>}<span className="service-card-link">View options <span aria-hidden="true">↗</span></span>
    </Link>)}
  </div>;
}

export function ServiceDiscovery() {
  return <section className="service-discovery section-gutter" aria-labelledby="services-heading">
    <div className="service-section-heading"><div><p className="v8-label">CARTUNEZ / HYDERABAD &amp; SECUNDERABAD</p>
      <h2 id="services-heading">What would you<br />like to change?</h2></div>
      <p>Seat covers, floor mats, body kits, lighting and car audio. Find what you need, or visit our Secunderabad workshop to see the options.</p>
    </div><ServiceCards compact />
    <Link className="service-inline-link" href="/visit/" prefetch={false}>Find our S.P. Road workshop in Secunderabad <span aria-hidden="true">↗</span></Link>
  </section>;
}

export function ServiceVisual({ service }: { service: Service }) {
  return <figure className="service-visual">{service.image.startsWith('/')
    ? <img src={service.image} alt={service.imageAlt} width="1200" height="800" loading="lazy" decoding="async" />
    : <CampaignImage name={service.image} alt={service.imageAlt} sizes="(max-width: 760px) 100vw, 55vw" />}
  </figure>;
}

export function ConsultationCta({ topic = 'car accessories' }: { topic?: string }) {
  return <section className="service-cta" aria-labelledby="service-cta-title"><div>
    <p className="v8-label">GET IN TOUCH</p><h2 id="service-cta-title">Let’s talk<br />about your car.</h2>
    <p>Share your car’s make, model, year and your ideas. We’ll discuss the options and put together a vehicle-specific quote.</p>
    </div><div className="service-cta-actions"><a className="v8-button" href={whatsappUrl(`Hi CARTUNEZ! I’m interested in ${topic}. Please help me choose suitable options for my car and arrange a consultation.`)} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <span aria-hidden="true">↗</span></a>
      <Link className="service-inline-link" href="/enquire/" prefetch={false}>Write a build brief <span aria-hidden="true">↗</span></Link>
      <a className="service-inline-link" href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a></div>
  </section>;
}
