'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from './MotionProvider';
import { Arrow } from './Primitives';

const chapters = [
  { title: 'YOUR CABIN, AS IT IS.', label: '01 / STANDARD MATS', image: 'factory', copy: 'Start with the original interior.', alt: 'Car cabin with standard floor mats' },
  { title: 'ADD CUSTOM MATTING.', label: '02 / COCOA QUILT', image: 'matting-cocoa', copy: 'Compare the coverage, colour and quilted finish.', alt: 'The same cabin with cocoa quilt floor mats' },
  { title: 'NOW ADD SOME LIGHT.', label: '03 / AMBIENT LIGHTING', image: 'lighting-amber', copy: 'Warm amber lighting along the dashboard and doors.', alt: 'The cabin with warm amber dashboard and door lighting' },
];

export function CabinScrollStory() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const { full } = useMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!full || !root.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const mm = gsap.matchMedia();
    mm.add('(min-height: 560px)', () => {
      section.dataset.pinned = 'true';
      const panels = Array.from(section.querySelectorAll<HTMLElement>('.v9-cabin-frame'));
      let previous = -1;
      const ctx = gsap.context(() => {
        gsap.set(panels, { autoAlpha: 0 }); gsap.set(panels[0], { autoAlpha: 1 });
        const timeline = gsap.timeline({ scrollTrigger: {
          id: 'ctz-cabin', trigger: section, pin: stage.current, start: 'top top', end: () => `+=${innerHeight * 2.2}`,
          scrub: .4, anticipatePin: 1, refreshPriority: 5, invalidateOnRefresh: true,
          onUpdate: self => { section.dataset.scrollProgress = String(Math.round(self.progress * 100)); const next = self.progress < .34 ? 0 : self.progress < .68 ? 1 : 2; if (next !== previous) { previous = next; setActive(next); } },
        } });
        panels.forEach((panel, index) => {
          if (index) timeline.to(panel, { autoAlpha: 1, duration: .38, ease: 'none' }, index * 1.1);
          timeline.fromTo(panel.querySelector('img'), { scale: 1.13 }, { scale: 1, duration: 1.1, ease: 'none' }, index * 1.1);
          if (index) timeline.to(panels[index - 1].querySelector('.v9-cabin-caption'), { opacity: 0, y: -25, duration: .2 }, index * 1.1)
            .fromTo(panel.querySelector('.v9-cabin-caption'), { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, index * 1.1 + .1);
        });
        timeline.fromTo('.v9-cabin-stitch', { opacity: 0, scaleX: .2 }, { opacity: .7, scaleX: 1, duration: .5 }, 1.12)
          .to('.v9-cabin-stitch', { opacity: 0, duration: .3 }, 2.2)
          .fromTo('.v9-cabin-meter i', { scaleX: 0 }, { scaleX: 1, duration: 3.3, ease: 'none' }, 0);
      }, section);
      return () => { ctx.revert(); delete section.dataset.pinned; delete section.dataset.scrollProgress; setActive(0); };
    });
    return () => mm.revert();
  }, [full]);
  function go(index: number) {
    const trigger = ScrollTrigger.getById('ctz-cabin');
    if (trigger) window.dispatchEvent(new CustomEvent('cartunez:scroll-to', { detail: { top: trigger.start + (trigger.end - trigger.start) * [.15, .49, .85][index] } }));
    else {
      const target = document.getElementById(`cabin-scroll-${index}`);
      if (full && target) window.dispatchEvent(new CustomEvent('cartunez:scroll-to', { detail: { top: target.getBoundingClientRect().top + window.scrollY - 100 } }));
      else target?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
  return <section className="v9-cabin-scroll" id="cabin-reveal" ref={root} aria-label="Scroll through a cabin transformation">
    <div className="v9-cabin-stage" ref={stage}>
      <header className="v9-cabin-top"><p className="v8-label">THE TRANSFORMATION / SCROLL TO DISCOVER</p><nav aria-label="Cabin transformation chapters">{['Factory', 'Matting', 'Lighting'].map((label, index) => <button key={label} aria-pressed={active === index} onClick={() => go(index)}>0{index + 1}<span>{label}</span></button>)}</nav></header>
      <div className="v9-cabin-frames">{chapters.map((chapter, index) => <article key={chapter.image} className="v9-cabin-frame" id={`cabin-scroll-${index}`}>
        <div className="v9-cabin-photo"><img src={`/images/cabin/${chapter.image}.webp`} width="1200" height="800" loading="lazy" alt={chapter.alt} /></div>
        <div className="v9-cabin-caption"><p className="v8-label">{chapter.label}</p><h2>{chapter.title}</h2><p>{chapter.copy}</p></div>
      </article>)}</div>
      <svg className="v9-cabin-stitch" viewBox="0 0 1200 800" aria-hidden="true"><path d="M80 690 Q130 520 380 540 L470 755 M670 755 L765 530 Q960 500 1130 650" fill="none" stroke="#ffc787" strokeWidth="2" strokeDasharray="5 7" /></svg>
      <div className="v9-cabin-bottom"><span>ONE CABIN. THREE CHAPTERS.<span className="v9-cabin-meter" aria-hidden="true"><i /></span></span><a href="#cabin-studio">Now make your own comparison <Arrow size={17} /></a></div>
    </div>
  </section>;
}
