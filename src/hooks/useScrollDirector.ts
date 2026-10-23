'use client';
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '@/components/MotionProvider';
import { world } from '@/lib/world';

// Scroll position owns these poses in both directions. UI controls stay in flow.
export function useScrollDirector(root: RefObject<HTMLElement | null>) {
  const { full } = useMotion();
  useEffect(() => {
    if (!full || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const page = root.current;
    let disposed = false;
    const mm = gsap.matchMedia();
    const workshop = page.querySelector<HTMLElement>('#workshop');
    let userCamera = false;
    const takeCamera = () => { userCamera = true; };
    workshop?.addEventListener('pointerdown', takeCamera);
    workshop?.addEventListener('keydown', takeCamera);
    const ctx = gsap.context(() => {
      mm.add({ wide: '(min-width: 960px)', compact: '(max-width: 959px)', short: '(max-height: 559px)' }, media => {
        const wide = !!media.conditions?.wide;
        const hero = page.querySelector<HTMLElement>('.v8-hero')!;
        gsap.from('.v8-hero-line > span', { yPercent: 105, duration: 1.1, stagger: .09, ease: 'expo.out' });
        // Pinning adds ordinary scroll distance; wheel and touch remain native.
        const reveal = gsap.timeline({ scrollTrigger: {
          id: 'ctz-hero', trigger: hero, pin: hero, start: 'top top', end: () => '+=' + innerHeight * 2.4,
          scrub: .7, anticipatePin: 1, refreshPriority: 20, invalidateOnRefresh: true,
          onUpdate: self => { hero.dataset.scrollProgress = String(Math.round(self.progress * 100)); },
        } });
        reveal.fromTo(world, { hero: 0 }, { hero: 1, duration: 1, ease: 'none', onUpdate: () => {
          const progress = world.hero;
          hero.dataset.cameraProgress = progress.toFixed(3);
          const label = hero.querySelector('[data-hero-shot]');
          if (label) label.textContent = progress < .3 ? '01 / THE REVEAL' : progress < .7 ? '02 / THE LOW ORBIT' : '03 / THE DEPARTURE';
        } }, 0)
          .to('.v8-hero-line:first-child', { xPercent: -70, y: -35, opacity: 0, duration: .30, ease: 'none' }, .04)
          .to('.v8-hero-line:last-child', { xPercent: 55, y: 30, opacity: 0, duration: .30, ease: 'none' }, .04)
          .to('.v8-hero-description, .v8-hero-actions, .v8-hero-content > .v8-label', { y: -25, autoAlpha: 0, duration: .24, ease: 'none' }, .03)
          .fromTo('.v10-hero-orbit', { y: 25, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .12, ease: 'none' }, .36)
          .to('.v10-hero-orbit', { y: -25, autoAlpha: 0, duration: .08, ease: 'none' }, .61)
          .fromTo('.v9-hero-after', { y: 45, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .22, ease: 'none' }, .72)
          .fromTo('.v9-hero-meter i', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
        gsap.fromTo('.v8-intro .split-word', { opacity: .14, y: 22 }, { opacity: 1, y: 0, stagger: .07, ease: 'none', scrollTrigger: { trigger: '.v8-intro', start: 'top 85%', end: 'bottom 55%', scrub: .25 } });
        gsap.fromTo('.v8-directory > a > span', { y: 35, opacity: .15 }, { y: 0, opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.v8-directory', start: 'top 95%', end: 'top 55%', scrub: .3 } });
        page.querySelectorAll<HTMLElement>('[data-line]').forEach(line => {
          if (line.closest('.v8-signature, .v9-cabin-scroll')) return;
          gsap.fromTo(line, { yPercent: 115 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 97%', end: 'top 67%', scrub: .25 } });
        });
        page.querySelectorAll<HTMLElement>('[data-v8-parallax]').forEach(frame => {
          const image = frame.querySelector('img'); if (!image) return;
          gsap.fromTo(image, { scale: 1.26, yPercent: -10, rotation: wide ? -1.5 : -1 }, { scale: 1.05, yPercent: 9, rotation: 0, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: .45 } });
        });
        gsap.fromTo('.v8-interior-main', { rotationY: wide ? -9 : -4, rotationX: 5, transformPerspective: 1100 }, { rotationY: 0, rotationX: 0, ease: 'none', scrollTrigger: { trigger: '.v8-interior-layout', start: 'top 95%', end: 'top 25%', scrub: .4 } });
        gsap.fromTo('.v8-material-story', { y: 110 }, { y: -35, ease: 'none', scrollTrigger: { trigger: '.v8-interior-layout', start: 'top bottom', end: 'bottom top', scrub: .45 } });
        const audio = page.querySelector<HTMLElement>('#audio')!;
        gsap.fromTo('.v9-sound-waves span', { scale: .3, opacity: 0 }, { scale: 1.8, opacity: .5, stagger: .12, ease: 'none', scrollTrigger: { trigger: '.v8-audio-header', start: 'top 80%', end: 'bottom 15%', scrub: .35, onUpdate: self => { audio.dataset.scrollProgress = String(Math.round(self.progress * 100)); } } });
        // Move a decorative frame, never the receiver or its app launch targets.
        gsap.fromTo('.v9-receiver-halo', { y: 60, scale: .9, rotationX: 9, transformPerspective: 1200, opacity: 0 }, { y: 0, scale: 1, rotationX: 0, opacity: .7, ease: 'none', scrollTrigger: { trigger: '.r-audio-stage', start: 'top 98%', end: 'top 28%', scrub: .35 } });
        page.querySelectorAll<HTMLElement>('.v8-performance-grid > article').forEach((card, index) => gsap.fromTo(card.querySelector('.v8-performance-photo'), { y: 70, x: (index ? 1 : -1) * (wide ? 55 : 20), rotation: index ? 4 : -4, opacity: .2 }, { y: 0, x: 0, rotation: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 32%', scrub: .35 } }));
        gsap.fromTo('.v8-craft-copy > article', { y: 95, rotationX: -12, transformPerspective: 900, opacity: .15 }, { y: 0, rotationX: 0, opacity: 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: '.v8-craft-copy', start: 'top 95%', end: 'bottom 65%', scrub: .3 } });
        gsap.fromTo('.mw-section-head', { y: 90, opacity: .15 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.mw-workshop', start: 'top 90%', end: 'top 25%', scrub: .3,
          onUpdate: self => { if (!userCamera) world.workshopAngle = .25 + self.progress * 1.05; },
        } });
        gsap.fromTo('.v8-builds h2, .v8-builds .mw-project-empty', { y: 70, opacity: .3 }, { y: 0, opacity: 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: '.v8-builds', start: 'top 95%', end: 'top 35%', scrub: .3 } });
        gsap.fromTo('.v8-closing-image img', { scale: 1.3, yPercent: -9 }, { scale: 1, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.v8-closing', start: 'top bottom', end: 'bottom bottom', scrub: .4 } });
        gsap.fromTo('.v8-closing-copy > p', { y: 65, opacity: .2 }, { y: 0, opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.v8-closing', start: 'top 80%', end: 'top 5%', scrub: .3 } });
        gsap.fromTo('.r-footer-wordmark > span', { yPercent: 110 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.r-footer-wordmark', start: 'top 100%', end: 'bottom 90%', scrub: .3 } });
        gsap.fromTo('.v8-marquee-track', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.v8-marquee', start: 'top bottom', end: 'bottom top', scrub: .25 } });
      });
    }, page);
    const refresh = () => { if (!disposed) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } };
    const frame = requestAnimationFrame(refresh);
    document.fonts.ready.then(refresh);
    window.addEventListener('cartunez:world-ready', refresh);
    const observer = new ResizeObserver(refresh);
    const receiver = page.querySelector('.r-audio-stage'); if (receiver) observer.observe(receiver);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('cartunez:world-ready', refresh);
      workshop?.removeEventListener('pointerdown', takeCamera); workshop?.removeEventListener('keydown', takeCamera);
      mm.revert(); ctx.revert(); world.hero = 0; page.querySelectorAll('[data-scroll-progress], [data-camera-progress]').forEach(node => { node.removeAttribute('data-scroll-progress'); node.removeAttribute('data-camera-progress'); });
    };
  }, [full, root]);
}
