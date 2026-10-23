'use client';
import { Arrow, TransitionLink } from './Primitives';
import { site } from '@/lib/site';

export function Footer() {
  return <footer className="footer r-footer" id="visit">
    <div className="footer-top"><div><p className="eyebrow">GOOD CARS DESERVE A PERSONAL TOUCH.</p><p className="footer-phrase">Let’s make yours<br />unmistakably you.</p></div>
      <div className="footer-column"><span className="eyebrow">FIND YOUR WAY</span><a href="/#craft">Explore the craft <Arrow size={14} /></a><a href="/#builds">Your next chapter <Arrow size={14} /></a><TransitionLink href="/enquire/?intent=visit">Request a workshop visit <Arrow size={14} /></TransitionLink></div>
      <div className="footer-column"><span className="eyebrow">COME SAY HELLO</span><a href={`tel:${site.phone}`}>{site.phoneDisplay} <Arrow size={14} /></a>{site.address ? <address>{site.address}, {site.city}</address> : <span className="footer-muted">Workshop location shared on enquiry.</span>}{site.mapsUrl && <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps <Arrow size={14} /></a>}{site.instagramUrl && <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <Arrow size={14} /></a>}</div>
    </div>
    <div className="footer-wordmark r-footer-wordmark" aria-label="CARTUNEZ"><span>CARTUNEZ<span className="red">.</span></span></div>
    <p className="model-credit">3D study: <a href="https://sketchfab.com/3d-models/bmw-m6-gt3-shiny-evil-27956e4ebaaa468980bc48e50106d5c6" target="_blank" rel="noopener noreferrer">BMW M6 GT3 Shiny &amp; Evil by Alex.Ka.</a> · <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">Asset licence</a> · Model supplied by CARTUNEZ. Independent design visualisation.</p>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} CARTUNEZ. MAKE IT YOURS.</span><span>CAR CUSTOMISATION · INDIA</span><a href="#main">BACK TO TOP ↑</a></div>
  </footer>;
}
