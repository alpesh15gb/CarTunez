'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type SequenceHandle = { seek: (progress: number) => void };
type SequenceManifest = { frames: string[] };

// Real frames are optional. Keep only a small moving window decoded in memory.
export const SequenceCanvas = forwardRef<SequenceHandle>(function SequenceCanvas(_, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const seek = useRef<(p: number) => void>(() => {});
  const [hasFrames, setHasFrames] = useState(false);
  useImperativeHandle(ref, () => ({ seek: p => seek.current(p) }), []);

  useEffect(() => {
    if (!matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)').matches) return;
    let disposed = false, progress = 0, manifest: string[] = [], frame = 0;
    const cache = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    const poster = new Image();
    const abort = new AbortController();
    const draw = () => {
      if (disposed || !canvas.current) return;
      const el = canvas.current, ctx = el.getContext('2d');
      if (!ctx) return;
      const target = Math.round(progress * Math.max(0, manifest.length - 1));
      const nearest = [...cache.keys()].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
      const source = cache.get(nearest) ?? poster;
      if (!source.complete || !source.naturalWidth) return;
      const rect = el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 1.5);
      const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
      if (el.width !== w || el.height !== h) { el.width = w; el.height = h; }
      const scale = Math.max(w / source.naturalWidth, h / source.naturalHeight) * (manifest.length ? 1 : 1 + progress * 0.07);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(source, (w - source.naturalWidth * scale) / 2, (h - source.naturalHeight * scale) / 2, source.naturalWidth * scale, source.naturalHeight * scale);
    };
    const requestDraw = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); };
    const load = (index: number) => {
      if (disposed || cache.has(index) || pending.has(index) || !manifest[index]) return;
      pending.add(index);
      const img = new Image(); img.decoding = 'async';
      img.onload = () => {
        pending.delete(index); if (disposed) return;
        cache.set(index, img);
        const target = Math.round(progress * (manifest.length - 1));
        if (cache.size > 14) {
          const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
          cache.delete(farthest);
        }
        requestDraw();
      };
      img.onerror = () => pending.delete(index);
      img.src = manifest[index];
    };
    seek.current = p => {
      progress = p;
      const current = Math.round(p * Math.max(0, manifest.length - 1));
      // Prioritise requested frames, then prefetch a bounded adjacent window.
      [0, 1, -1, 2, -2].forEach(offset => load(Math.max(0, Math.min(manifest.length - 1, current + offset))));
      requestDraw();
    };
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      poster.onload = requestDraw; poster.src = '/images/hero-1600.webp';
      try {
        const response = await fetch('/images/body-sequence/manifest.json', { signal: abort.signal });
        if (!response.ok) return;
        const data: SequenceManifest = await response.json();
        manifest = Array.isArray(data.frames) ? data.frames.filter(f => typeof f === 'string' && f.startsWith('/images/body-sequence/')).slice(0, 120) : [];
        if (!disposed && manifest.length) { setHasFrames(true); seek.current(progress); }
      } catch { /* A missing production sequence gracefully keeps the concept poster. */ }
    }, { rootMargin: '400px' });
    if (root.current) observer.observe(root.current);
    const resize = new ResizeObserver(requestDraw); if (root.current) resize.observe(root.current);
    return () => { disposed = true; abort.abort(); observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); cache.clear(); seek.current = () => {}; };
  }, []);

  return <div ref={root} className="sequence-wrap">
    <img src="/images/hero-1000.webp" width="1000" height="667" loading="lazy" alt="Silver coupe with a widebody concept, front splitter and rear spoiler" />
    <canvas ref={canvas} className="sequence-canvas" aria-hidden="true" />
    {!hasFrames && <svg className="body-outline" viewBox="0 0 1000 667" aria-hidden="true"><path className="kit-line" d="M70 488 L320 509 L410 493 M420 497 L831 492 L904 466 M830 247 L915 243 L920 272" /></svg>}
    <div className="body-callout callout-lip"><span>01</span> FRONT LIP<i /></div><div className="body-callout callout-skirt"><span>02</span> SIDE SKIRTS<i /></div><div className="body-callout callout-spoiler"><span>03</span> REAR SPOILER<i /></div><div className="body-callout callout-diffuser"><span>04</span> DIFFUSER<i /></div>
    <span className="visual-caption">{hasFrames ? 'SCROLL TO TRANSFORM' : 'CONCEPT VISUAL · SEQUENCE READY'}</span>
  </div>;
});
