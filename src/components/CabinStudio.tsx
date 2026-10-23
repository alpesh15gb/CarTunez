'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Check, ChevronsLeftRight, Lightbulb, Layers3, MessageCircle } from 'lucide-react';
import { BeforeAfter } from './BeforeAfter';
import { LineHeading } from './Primitives';
import { useBuild } from './BuildProvider';

const lights = [
  { id: 'blue', name: 'Ice blue', color: '#58caff' },
  { id: 'red', name: 'Electric red', color: '#ff4c59' },
  { id: 'amber', name: 'Warm amber', color: '#ffc072' },
] as const;

export default function CabinStudio() {
  const { build, toggle, setLighting } = useBuild();
  const studio = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'matting' | 'lighting'>('matting');
  const light = Math.max(0, lights.findIndex(item => item.id === build.lighting));
  const setLight = (index: number) => setLighting(lights[index].id);
  const [intensity, setIntensity] = useState(100);
  const [on, setOn] = useState(true);
  const selection = lights[light];
  useEffect(() => {
    // Keep the global contact pill from covering the studio's own enquiry controls.
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.cabinStudio = entry.isIntersecting ? 'active' : '';
    }, { rootMargin: '-12% 0px', threshold: 0 });
    if (studio.current) observer.observe(studio.current);
    return () => { observer.disconnect(); delete document.documentElement.dataset.cabinStudio; };
  }, []);
  return <section ref={studio} className="cabin-studio section-gutter" id="cabin-studio" aria-labelledby="cabin-title">
    <div className="cabin-heading"><div><p className="eyebrow red" data-reveal>[ THE CABIN STUDIO ]</p><h2 id="cabin-title"><LineHeading>See the difference.</LineHeading><LineHeading>Feel the possibility<span className="red">.</span></LineHeading></h2></div><p>From the floor beneath your feet<br />to the light around you.<br /><span>Try a different kind of inside.</span></p></div>
    <div className="cabin-tabs" aria-label="Choose cabin upgrade"><button aria-pressed={mode === 'matting'} onClick={() => setMode('matting')}><Layers3 size={18} /><span>01 / Custom matting</span></button><button aria-pressed={mode === 'lighting'} onClick={() => setMode('lighting')}><Lightbulb size={18} /><span>02 / Ambient lighting</span></button><span><ChevronsLeftRight size={15} />Drag the divider to compare</span></div>
    <div className="cabin-workbench" style={{ '--cabin-accent': mode === 'matting' ? '#d8a67c' : selection.color } as CSSProperties}>
      <div className="cabin-image-area">
        <BeforeAfter key={mode} image="/images/cabin/factory.webp" beforeImage={mode === 'matting' ? '/images/cabin/factory.webp' : '/images/cabin/matting-cocoa.webp'} afterImage={mode === 'matting' ? '/images/cabin/matting-cocoa.webp' : `/images/cabin/lighting-${selection.id}.webp`} alt={mode === 'matting' ? 'factory floor mats and cocoa diamond-quilt fitted matting, generated concept' : `unlit cabin and ${selection.name} ambient lighting, generated concept`} beforeLabel={mode === 'matting' ? 'STANDARD MATS' : 'LIGHTS OFF'} afterLabel={mode === 'matting' ? 'COCOA QUILT' : `${selection.name.toUpperCase()} ${on ? 'ON' : 'OFF'}`} muteBase={false} afterOpacity={mode === 'lighting' ? (on ? intensity / 100 : 0) : 1} className="cabin-comparison" />
        <div className="cabin-image-caption"><span>ONE CABIN. TWO POSSIBILITIES.</span><span>GENERATED DESIGN CONCEPT</span></div>
      </div>
      <aside className="cabin-controls"><p className="eyebrow">{mode === 'matting' ? 'CRAFTED FROM THE FLOOR UP' : 'A DIFFERENT MOOD. IN A TOUCH.'}</p><h3>{mode === 'matting' ? <>A better<br /> foundation.</> : <>Set the<br /> after-dark mood.</>}</h3><p>{mode === 'matting' ? 'Compare basic floor mats with a cocoa diamond-quilt concept, shaped around the footwells and centre tunnel.' : 'Explore subtle dashboard, door and footwell lighting. Choose a colour, then bring the glow up or down.'}</p>
        {mode === 'matting' ? <><div className="cabin-material"><span className="cocoa-swatch" aria-hidden="true" /><span><b>Cocoa diamond quilt</b><small>Raised edges · fitted coverage</small></span><Check size={17} /></div><ul><li>Footwell-to-tunnel coverage</li><li>Quilted texture & contrast stitching</li><li>Explore fit for your vehicle</li></ul><button className="cabin-next" onClick={() => setMode('lighting')}>Now add a little light <ArrowUpRight size={19} /></button></> : <><div className="cabin-light-swatches" aria-label="Ambient lighting colour">{lights.map((item, index) => <button key={item.id} aria-pressed={index === light} aria-label={`Preview ${item.name} lighting`} onClick={() => { setLight(index); setOn(true); }}><span style={{ background: item.color }}>{index === light && <Check size={16} />}</span><small>{item.name}</small></button>)}</div><label className="cabin-intensity"><span>Glow intensity <b>{on ? intensity : 0}%</b></span><input aria-label="Cabin lighting intensity" type="range" min="20" max="100" value={intensity} onChange={event => { setIntensity(Number(event.target.value)); setOn(true); }} /></label><button className="cabin-light-switch" aria-pressed={on} onClick={() => setOn(value => !value)}><span>Ambient lighting</span><span>{on ? 'ON' : 'OFF'}<i /></span></button></>}
        <button className="cabin-enquire" onClick={() => { const id = mode === 'matting' ? 'matting-cocoa' : `light-${selection.id}`; toggle(id); }}><Check size={17} />{build.selections.includes(mode === 'matting' ? 'matting-cocoa' : `light-${selection.id}`) ? 'Remove from my build' : 'Add to my build'}<ArrowUpRight size={17} /></button>
        <a className="mw-cabin-review" href="#your-build">Review your saved preferences <ArrowUpRight size={16} /></a>
      </aside>
    </div><p className="cabin-concept-note">Concept visualisation, not an installation photograph. Material finish, lighting and fit depend on your vehicle and selected products.</p>
  </section>;
}
