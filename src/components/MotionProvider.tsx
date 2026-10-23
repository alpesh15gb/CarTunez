'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Preference = 'system' | 'full' | 'reduced';
type MotionState = { full: boolean; ready: boolean; preference: Preference; choose: (mode: Preference) => void };
const Context = createContext<MotionState>({ full: false, ready: false, preference: 'system', choose: () => {} });

export function motionEnabled() { return typeof document !== 'undefined' && document.documentElement.dataset.motion === 'full'; }

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Preference>('system');
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lighterDevice = !!device.connection?.saveData || (typeof device.deviceMemory === 'number' && device.deviceMemory <= 2);
    const update = () => setReduced(media.matches || lighterDevice);
    update(); media.addEventListener('change', update);
    let saved: string | null = null;
    try { saved = localStorage.getItem('cartunez-motion-v2'); } catch { /* Storage is optional. */ }
    const query = new URLSearchParams(location.search).get('experience');
    const mode = query === 'full' ? 'full' : query === 'reduced' ? 'reduced' : saved;
    if (mode === 'full' || mode === 'reduced') {
      setPreference(mode);
      if (query) try { localStorage.setItem('cartunez-motion-v2', mode); } catch { /* Storage is optional. */ }
    }
    setReady(true);
    return () => media.removeEventListener('change', update);
  }, []);
  const full = ready && (preference === 'full' || (preference === 'system' && !reduced));
  useEffect(() => { document.documentElement.dataset.motion = full ? 'full' : 'reduced'; }, [full]);
  function choose(mode: Preference) {
    document.documentElement.dataset.motion = (mode === 'full' || (mode === 'system' && !reduced)) ? 'full' : 'reduced';
    setPreference(mode);
    const url = new URL(location.href); url.searchParams.delete('experience');
    history.replaceState(history.state, '', url);
    try { localStorage.setItem('cartunez-motion-v2', mode); } catch { /* Storage is optional. */ }
  }
  return <Context.Provider value={{ full, ready, preference, choose }}>{children}</Context.Provider>;
}
export function useMotion() { return useContext(Context); }

export function MotionControl() {
  const { full, ready, choose } = useMotion();
  return <button className={`motion-control ${full ? 'motion-is-full' : ''}`} onClick={() => choose(full ? 'reduced' : 'full')} aria-pressed={full} disabled={!ready} aria-label={full ? 'Switch to reduced motion' : 'Enable full 3D and scroll animations'}><span className="motion-bars" aria-hidden="true"><i /><i /><i /></span><span>{full ? 'Scroll motion on' : 'Enable scroll motion'}</span></button>;
}
