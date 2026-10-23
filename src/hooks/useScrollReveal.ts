'use client';
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from '@/lib/site';
import { useMotion } from '@/components/MotionProvider';

export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  const { full } = useMotion();
  useEffect(() => {
    if (!full) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 0px)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 38, opacity: 0, duration: motion.entrance, ease: motion.ease,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-line]').forEach(el => {
          if (el.closest('.chapter, .footer-wordmark')) return;
          gsap.from(el, { yPercent: 110, duration: 1.15, ease: 'expo.out',
            scrollTrigger: { trigger: el.parentElement, start: 'top 93%', once: true } });
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [root, full]);
}
