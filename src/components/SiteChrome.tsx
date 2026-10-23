'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Menu, X, ArrowDown, MessageCircle } from 'lucide-react';
import { Arrow, Magnetic, TransitionLink } from './Primitives';
import { categories, site, whatsappUrl } from '@/lib/site';
import { MobileBuildBar } from './BuildProvider';
import { MotionControl, motionEnabled, useMotion } from './MotionProvider';

export function Brand({ large = false }: { large?: boolean }) {
  return <a href="/" className={`brand ${large ? 'brand-large' : ''}`} aria-label="CARTUNEZ home">
    <img src="/images/cartunez-logo.webp" width="76" height="51" alt="" />
    <span>CARTUNEZ<small>MAKE IT YOURS.</small></span>
  </a>;
}

function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const { full } = useMotion();
  useEffect(() => {
    if (!full) return;
    const mm = gsap.matchMedia();
    mm.add('(pointer: fine)', () => {
      const x = gsap.quickTo(ring.current, 'x', { duration: 0.25, ease: 'power3.out' });
      const y = gsap.quickTo(ring.current, 'y', { duration: 0.25, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        if (!ring.current || !dot.current) return;
        x(e.clientX); y(e.clientY); gsap.set(dot.current, { x: e.clientX, y: e.clientY });
        const target = e.target as Element;
        const interactive = target.closest('a,button,input,[data-cursor]');
        ring.current.classList.toggle('cursor-active', Boolean(interactive));
        ring.current.textContent = target.closest('[data-cursor]')?.getAttribute('data-cursor') ?? '';
        ring.current.style.opacity = '1'; dot.current.style.opacity = '1';
      };
      const leave = () => { if (ring.current && dot.current) { ring.current.style.opacity = '0'; dot.current.style.opacity = '0'; } };
      window.addEventListener('pointermove', move); document.addEventListener('mouseleave', leave);
      return () => { window.removeEventListener('pointermove', move); document.removeEventListener('mouseleave', leave); };
    });
    return () => mm.revert();
  }, [full]);
  return <><div className="cursor-ring" ref={ring} aria-hidden="true" /><div className="cursor-dot" ref={dot} aria-hidden="true" /></>;
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const { full } = useMotion();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!full) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (pointer: fine)', () => {
      const instance = new Lenis({ duration: 0.9, smoothWheel: true, anchors: false, respectReducedMotion: false });
      lenis.current = instance;
      instance.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      return () => { gsap.ticker.remove(tick); instance.destroy(); lenis.current = null; };
    });
    return () => mm.revert();
  }, [full]);

  useEffect(() => {
    if (!full) return;
    // Pinned sections have their own scroll start; their transformed DOM position
    // is not a reliable destination while another scene is pinned.
    const position = (target: HTMLElement) => {
      const pin = ScrollTrigger.getAll().find(trigger => trigger.trigger === target && trigger.pin);
      return pin ? pin.start + 1 : target.getBoundingClientRect().top + window.scrollY - 80;
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank') return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id); if (!target) return;
      event.preventDefault();
      const next = new URL(location.href); next.hash = url.hash; history.pushState(history.state, '', next);
      const top = Math.max(0, position(target));
      if (lenis.current) lenis.current.scrollTo(top, { duration: .85, force: true });
      else window.scrollTo({ top, behavior: motionEnabled() ? 'smooth' : 'instant' });
    };
    const requestedScroll = (event: Event) => {
      const top = (event as CustomEvent<{ top: number }>).detail?.top;
      if (!Number.isFinite(top)) return;
      if (lenis.current) lenis.current.scrollTo(top, { duration: .85, force: true });
      else window.scrollTo({ top, behavior: motionEnabled() ? 'smooth' : 'instant' });
    };
    window.addEventListener('cartunez:scroll-to', requestedScroll);
    let aligned = false;
    const alignInitialHash = () => {
      if (aligned || !location.hash) return;
      let id: string; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id); if (!target) return;
      aligned = true;
      const top = Math.max(0, position(target));
      if (lenis.current) lenis.current.scrollTo(top, { immediate: true, force: true }); else window.scrollTo(0, top);
    };
    let userMoved = false, disposed = false;
    const intent = () => { userMoved = true; };
    window.addEventListener('wheel', intent, { passive: true });
    window.addEventListener('touchstart', intent, { passive: true });
    window.addEventListener('pointerdown', intent, { passive: true });
    const frame = requestAnimationFrame(() => { ScrollTrigger.refresh(); alignInitialHash(); });
    // Font swaps can change the start of a pinned scene after the first hash jump.
    document.fonts.ready.then(() => {
      if (!disposed && !userMoved && location.hash) { ScrollTrigger.refresh(); aligned = false; alignInitialHash(); }
    });
    document.addEventListener('click', click);
    return () => { disposed = true; cancelAnimationFrame(frame); document.removeEventListener('click', click); window.removeEventListener('cartunez:scroll-to', requestedScroll); window.removeEventListener('wheel', intent); window.removeEventListener('touchstart', intent); window.removeEventListener('pointerdown', intent); };
  }, [full, pathname]);

  useEffect(() => {
    gsap.to('.route-curtain', { yPercent: -101, duration: motionEnabled() ? 0.65 : 0, ease: 'expo.inOut' });
    let last = window.scrollY, frame = 0;
    const update = () => {
      const top = window.scrollY;
      nav.current?.classList.toggle('nav-hidden', top > last && top > 200);
      nav.current?.classList.toggle('nav-scrolled', top > 30);
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? top / distance : 0})`;
      last = top; frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true }); update();
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis.current?.stop();
    content.current?.setAttribute('inert', '');
    const ctx = gsap.context(() => {
      if (motionEnabled()) gsap.from('.menu-link', { y: 45, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' });
    }, menu);
    const links = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('a, button') ?? []);
    links()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key === 'Tab') {
        const focusable = [menuButton.current!, ...links()];
        const i = focusable.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); focusable.at(-1)?.focus(); }
        else if (!e.shiftKey && i === focusable.length - 1) { e.preventDefault(); focusable[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      ctx.revert(); document.body.style.overflow = previousOverflow; lenis.current?.start();
      content.current?.removeAttribute('inert'); document.removeEventListener('keydown', key); menuButton.current?.focus();
    };
  }, [menuOpen]);

  return <>
    <div className="scroll-progress" ref={progress} aria-hidden="true" />
    <header className={`nav ${menuOpen ? 'nav-menu-open' : ''}`} ref={nav} onFocusCapture={() => nav.current?.classList.remove('nav-hidden')}>
      <div inert={menuOpen}><Brand /></div><nav className="desktop-links" aria-label="Primary navigation" inert={menuOpen}><a href="/#workshop">The workshop</a><TransitionLink href="/services/">Services</TransitionLink><TransitionLink href="/visit/">Find us</TransitionLink></nav>
      <div className="nav-actions"><span inert={menuOpen}><MotionControl /></span><span inert={menuOpen}><Magnetic><TransitionLink href="/enquire/" className="nav-enquire">Let’s talk <Arrow size={15} /></TransitionLink></Magnetic></span><button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}<span>{menuOpen ? 'Close' : 'Menu'}</span></button></div>
    </header>
    {menuOpen && <div className="full-menu" id="site-menu" ref={menu} role="dialog" aria-modal="true" aria-label="Explore CARTUNEZ">
      <div className="menu-kicker eyebrow">FIND YOUR NEXT CHAPTER <ArrowDown size={16} /></div>
      <nav aria-label="All chapters"><a className="menu-link" href="/#workshop" onClick={() => setMenuOpen(false)}><small>00</small>The workshop<Arrow size={36} /></a>{categories.map(c => <a className="menu-link" key={c.id} href={`/#${c.id}`} onClick={() => setMenuOpen(false)}><small>{c.number}</small>{c.name}<Arrow size={36} /></a>)}<TransitionLink className="menu-link" href="/services/" onNavigate={() => setMenuOpen(false)}><small>05</small>All services<Arrow size={36} /></TransitionLink><TransitionLink className="menu-link" href="/visit/" onNavigate={() => setMenuOpen(false)}><small>06</small>Find us<Arrow size={36} /></TransitionLink><TransitionLink className="menu-link" href="/enquire/" onNavigate={() => setMenuOpen(false)}><small>07</small>Start your build<Arrow size={36} /></TransitionLink></nav>
      <div className="menu-bottom"><span>YOUR CAR. YOUR SIGNATURE.</span><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></div>
    </div>}
    <div ref={content}>{children}<MobileBuildBar /></div>
    <a className="floating-contact" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Enquire with CARTUNEZ on WhatsApp" tabIndex={menuOpen ? -1 : 0} aria-hidden={menuOpen}><MessageCircle size={18} /><span className="floating-contact-label">Let’s build yours</span><Arrow size={16} /></a>
    <div className="route-curtain" aria-hidden="true"><span>CARTUNEZ<span className="red">.</span></span></div><Cursor />
  </>;
}
