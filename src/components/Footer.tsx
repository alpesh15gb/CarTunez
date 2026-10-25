'use client';
import { Arrow, TransitionLink } from './Primitives';
import { serviceNavigation, site } from '@/lib/site';

export function Footer() {
  return <footer className="footer r-footer" id="visit">
    <div className="footer-top"><div><p className="eyebrow">LET’S TALK ABOUT YOUR CAR.</p><p className="footer-phrase">Have something in mind?<br />We’re here to help.</p></div>
      <div className="footer-column"><span className="eyebrow">FIND YOUR WAY</span><TransitionLink href="/services/">Explore all services <Arrow size={14} /></TransitionLink><a href="/#builds">Your next chapter <Arrow size={14} /></a><TransitionLink href="/visit/">Visit the workshop <Arrow size={14} /></TransitionLink><TransitionLink href="/enquire/?intent=visit">Request a workshop visit <Arrow size={14} /></TransitionLink></div>
      <div className="footer-column"><span className="eyebrow">COME SAY HELLO</span><a href={`tel:${site.phone}`}>{site.phoneDisplay} <Arrow size={14} /></a><address>{site.address}<br />{site.city}, Hyderabad<br />{site.region} {site.postalCode}, India</address><a href={`mailto:${site.email}`}>{site.email}</a><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps <Arrow size={14} /></a>{site.instagramUrl && <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <Arrow size={14} /></a>}</div>
    </div>
    <nav className="footer-services" aria-label="Car accessories and customisation services">{serviceNavigation.map(service => <TransitionLink href={`/services/${service.slug}/`} key={service.slug}>{service.label} <Arrow size={14} /></TransitionLink>)}</nav>
    <div className="footer-wordmark r-footer-wordmark" aria-label="CARTUNEZ"><span>CARTUNEZ<span className="red">.</span></span></div>
    <p className="model-credit">3D model: <a href="https://sketchfab.com/3d-models/bmw-m6-gt3-shiny-evil-27956e4ebaaa468980bc48e50106d5c6" target="_blank" rel="noopener noreferrer">BMW M6 GT3 Shiny &amp; Evil by Alex.Ka.</a> · <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">Asset licence</a> · Visual previews. Ask us about available products for your car.</p>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} CARTUNEZ. MAKE IT YOURS.</span><span>CAR CUSTOMISATION · HYDERABAD &amp; SECUNDERABAD</span><a href="#main">BACK TO TOP ↑</a></div>
  </footer>;
}
