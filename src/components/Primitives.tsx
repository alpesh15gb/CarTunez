'use client';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode, PointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { motionEnabled } from './MotionProvider';

export function Arrow({ size = 18 }: { size?: number }) { return <ArrowUpRight size={size} strokeWidth={1.6} aria-hidden="true" />; }

export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  function move(e: PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== 'mouse' || !motionEnabled()) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { x: (e.clientX - r.left - r.width / 2) * 0.13, y: (e.clientY - r.top - r.height / 2) * 0.18, duration: 0.4, ease: 'power3.out' });
  }
  return <span className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={e => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'expo.out' })}>{children}</span>;
}

export function TransitionLink({ href, className, children, onNavigate }: { href: string; className?: string; children: ReactNode; onNavigate?: () => void }) {
  const router = useRouter();
  return <a href={href} className={className} onClick={e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    // Same-route query changes use normal navigation so the form reads its new intent.
    // A same-route push would never trigger the pathname curtain cleanup effect.
    if (new URL(href, location.origin).pathname === location.pathname) { onNavigate?.(); return; }
    e.preventDefault();
    onNavigate?.();
    if (!motionEnabled()) { router.push(href); return; }
    gsap.fromTo('.route-curtain', { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut', onComplete: () => router.push(href) });
  }}>{children}</a>;
}

export function LineHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`line-mask ${className}`}><span data-line>{children}</span></span>;
}

export function ChapterLabel({ number, text }: { number: string; text: string }) {
  return <div className="eyebrow chapter-label"><span className="chapter-number">{number}<span>/04</span></span><span>{text}</span><span className="mini-cross">+</span></div>;
}
