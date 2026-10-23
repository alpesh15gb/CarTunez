'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion, motionEnabled } from './MotionProvider';
import { CampaignImage } from './CampaignImage';
import { Arrow } from './Primitives';

const scenes = [
  { name: 'Presence', image: 'profile', title: ['PRESENCE.', 'BEFORE A WORD.'], text: 'A silhouette with its own point of view. Explore exterior styling that changes how your car enters a room.', tag: 'BODY / PROPORTION / PERSONALITY', alt: 'Silver coupe in side profile under a precise studio light, generated exterior concept' },
  { name: 'Stance', image: 'stance', title: ['THE STANCE.', 'THE STATEMENT.'], text: 'The wheel. The arch. The way they meet. Start with a finish you love, then let us check the dimensions that belong on your car.', tag: 'WHEELS / FINISH / FITMENT', alt: 'Detailed graphite wheel, sculpted silver arch and carbon side skirt, generated concept' },
  { name: 'Detail', image: 'aero', title: ['SMALL DETAILS.', 'BIG DIFFERENCE.'], text: 'A considered edge. A material that catches the light. A finish that brings the whole build together.', tag: 'AERO / MATERIAL / FINISH', alt: 'Close view of silver bodywork and a carbon front lip, generated styling concept' },
];

export function SignatureStory() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const { full } = useMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!full || !root.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current, canvas = stage.current;
    let disposed = false;
    const mm = gsap.matchMedia();
    // Content choreography works at every width and with touch. Only very short
    // landscape viewports use the flowing version so no reading area is clipped.
    mm.add({ wide: '(min-width: 960px)', compact: '(max-width: 959px)', short: '(max-height: 559px)' }, media => {
      if (media.conditions?.short) {
        const flow = gsap.context(() => section.querySelectorAll('.v8-story-image img').forEach(image => gsap.fromTo(image, { scale: 1.2, yPercent: -8 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: .4 } })), section);
        return () => flow.revert();
      }
      section.dataset.pinned = 'true';
      const panels = Array.from(section.querySelectorAll<HTMLElement>('.v8-story-scene'));
      let current = -1;
      const ctx = gsap.context(() => {
        gsap.set(panels, { autoAlpha: 0 }); gsap.set(panels[0], { autoAlpha: 1 });
        const timeline = gsap.timeline({ scrollTrigger: {
          id: 'v8-signature', trigger: section, start: 'top top', end: () => `+=${innerHeight * 2.8}`, pin: canvas, scrub: .45, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10,
          onUpdate: self => { section.dataset.scrollProgress = String(Math.round(self.progress * 100)); const next = self.progress < .34 ? 0 : self.progress < .68 ? 1 : 2; if (next !== current) { current = next; setActive(next); } },
        } });
        // Durations are proportions of the 2.6-screen journey. Holds give the copy time to breathe.
        panels.forEach((panel, index) => {
          const at = index * 1.15;
          if (index) {
            timeline.to(panels[index - 1], { autoAlpha: 0, duration: .28, ease: 'none' }, at)
              .to(panel, { autoAlpha: 1, duration: .34, ease: 'none' }, at + .04)
              .fromTo(panel.querySelector('.v8-story-copy'), { y: 30 }, { y: 0, duration: .55, ease: 'power3.out' }, at + .04);
          }
          timeline.fromTo(panel.querySelector('img'), { scale: 1.24, xPercent: index === 1 ? -5 : 4, rotation: index === 1 ? -2 : 0 }, { scale: 1.025, xPercent: 0, rotation: 0, duration: 1.2, ease: 'none' }, at);
        });
        timeline.fromTo(section.querySelector('.v9-scene-meter i'), { scaleX: 0 }, { scaleX: 1, duration: 3.5, ease: 'none' }, 0);
      }, section);
      return () => { ctx.revert(); delete section.dataset.pinned; delete section.dataset.scrollProgress; setActive(0); };
    });
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    return () => { disposed = true; mm.revert(); };
  }, [full]);

  function go(index: number) {
    const trigger = ScrollTrigger.getById('v8-signature');
    if (trigger) {
      const top = trigger.start + (trigger.end - trigger.start) * [.12, .48, .84][index];
      window.dispatchEvent(new CustomEvent('cartunez:scroll-to', { detail: { top } }));
    } else {
      const target = document.getElementById(`exterior-scene-${index}`);
      if (full && target) window.dispatchEvent(new CustomEvent('cartunez:scroll-to', { detail: { top: target.getBoundingClientRect().top + window.scrollY - 100 } }));
      else target?.scrollIntoView({ behavior: motionEnabled() ? 'smooth' : 'instant', block: 'start' });
    }
    setActive(index);
  }

  return <section className="v8-signature" ref={root} id="bodykits" aria-label="Exterior styling, a story in three details">
    <div className="v8-story-stage" ref={stage}>
      <div className="v8-story-top"><span className="v8-label">01 / AN EXTERIOR POINT OF VIEW</span><nav aria-label="Explore exterior chapters">{scenes.map((scene, index) => <button key={scene.name} aria-pressed={active === index} onClick={() => go(index)}><small>0{index + 1}</small>{scene.name}</button>)}</nav></div>
      <div className="v8-story-scenes">{scenes.map((scene, index) => <article className="v8-story-scene" id={`exterior-scene-${index}`} key={scene.name}>
        <CampaignImage name={scene.image} alt={scene.alt} className="v8-story-image" />
        <div className="v8-story-copy"><p className="v8-label">0{index + 1} / {scene.name.toUpperCase()}</p><h2>{scene.title.map(line => <span key={line}>{line}</span>)}</h2><p>{scene.text}</p><span className="v8-story-tags">{scene.tag}</span><a className="v8-text-link" href="#workshop">Explore your exterior direction <Arrow /></a></div>
        <span className="v8-concept-note">CARTUNEZ DESIGN STUDY / GENERATED CAMPAIGN IMAGE</span>
      </article>)}</div>
      <div className="v8-story-bottom"><span>SCROLL TO TRANSFORM <span aria-hidden="true">↓</span><span className="v9-scene-meter" aria-hidden="true"><i /></span></span><a href="#interiors">The inside story <Arrow size={16} /></a></div>
    </div>
  </section>;
}
