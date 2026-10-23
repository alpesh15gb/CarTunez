'use client';
import { useState, type CSSProperties } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export function BeforeAfter({ image, beforeImage = image, afterImage = image, concept = true, muteBase = concept, beforeLabel, afterLabel, afterOpacity = 1, alt, className = '' }: { image: string; beforeImage?: string; afterImage?: string; concept?: boolean; muteBase?: boolean; beforeLabel?: string; afterLabel?: string; afterOpacity?: number; alt: string; className?: string }) {
  const [position, setPosition] = useState(52);
  return <div className={`before-after ${className}`} style={{ '--position': `${position}%` } as CSSProperties} data-cursor="Drag">
    <img className={muteBase ? 'comparison-base' : ''} src={beforeImage} alt={`${alt}, ${beforeLabel || (concept ? 'base concept' : 'before customisation')}`} loading="lazy" width="1200" height="800" />
    <div className="comparison-upgrade" style={{ opacity: afterOpacity }}><img src={afterImage} alt={`${alt}, ${afterLabel || (concept ? 'custom concept finish' : 'after customisation')}`} loading="lazy" width="1200" height="800" /></div>
    <span className="comparison-tag base-tag">{beforeLabel || (concept ? 'BASE CONCEPT' : 'BEFORE')}</span><span className="comparison-tag custom-tag">{afterLabel || (concept ? 'CUSTOM CONCEPT' : 'AFTER')}</span>
    <div className="comparison-handle" aria-hidden="true"><span><ChevronsLeftRight size={22} /></span></div>
    <input aria-label={`Compare base and custom ${alt}`} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} />
  </div>;
}
