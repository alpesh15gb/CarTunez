'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { decodeBuild, emptyBuild, encodeBuild, toggleUpgrade, validateBuild, type Build } from '@/lib/build';

const KEY = 'cartunez-build-v1', SNAPSHOT = 'cartunez-build-snapshot-v1';
type BuildContextValue = { build: Build; ready: boolean; notice: string; saved: boolean; canUndo: boolean; setVehicle: (key: keyof Build['vehicle'], value: string) => void; toggle: (id: string) => void; setLighting: (color: Build['lighting']) => void; setStudio: (mode: Build['studio']) => void; save: () => void; restore: () => void; reset: () => void; undo: () => void; share: () => Promise<void>; shareUrl: string };
const BuildContext = createContext<BuildContextValue | null>(null);
export function useBuild() { const value = useContext(BuildContext); if (!value) throw new Error('BuildProvider is required'); return value; }
export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<Build>(emptyBuild), [ready, setReady] = useState(false), [notice, setNotice] = useState(''), [saved, setSaved] = useState(false), [previous, setPrevious] = useState<Build | null>(null), [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    const param = new URLSearchParams(location.search).get('build');
    const shared = param ? decodeBuild(param) : null;
    let storageUnavailable = false;
    function readStored(key: string) {
      try { const raw = localStorage.getItem(key); if (!raw) return null; try { return validateBuild(JSON.parse(raw)); } catch { return null; } }
      catch { storageUnavailable = true; return null; }
    }
    const local = readStored(KEY), checkpoint = readStored(SNAPSHOT);
    setBuild(shared ?? local ?? emptyBuild()); setSaved(!!checkpoint);
    if (param) setNotice(shared ? 'Shared build loaded. You can edit your own copy.' : 'This build link could not be loaded. Your local build is available.');
    else if (storageUnavailable) setNotice('Browser storage is unavailable. You can still configure and share a build.');
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(build)); } catch { setNotice('Changes are available this visit. Browser storage could not save them.'); } } }, [build, ready]);
  function update(next: Build | ((value: Build) => Build)) {
    setBuild(next); setShareUrl('');
    // A copied URL is a snapshot. Remove an imported snapshot after an edit.
    const url = new URL(location.href); if (url.searchParams.has('build')) { url.searchParams.delete('build'); history.replaceState(history.state, '', url); }
  }
  const value: BuildContextValue = {
    build, ready, notice, saved, canUndo: !!previous, shareUrl,
    setVehicle: (key, text) => update(current => ({ ...current, vehicle: { ...current.vehicle, [key]: text.slice(0, key === 'year' ? 4 : 70) } })),
    toggle: id => update(current => toggleUpgrade(current, id)),
    setLighting: lighting => update(current => ({ ...current, lighting })),
    setStudio: studio => update(current => ({ ...current, studio })),
    save: () => { try { localStorage.setItem(SNAPSHOT, JSON.stringify(build)); setSaved(true); setNotice('Build snapshot saved on this browser.'); } catch { setNotice('Snapshot could not be saved. Use Share build to keep a link.'); } },
    restore: () => { try { const raw = localStorage.getItem(SNAPSHOT); const snapshot = raw ? validateBuild(JSON.parse(raw)) : null; if (snapshot) { update(snapshot); setNotice('Saved snapshot restored.'); } else { setSaved(false); setNotice('No saved snapshot is available.'); } } catch { setNotice('Saved snapshot could not be read.'); } },
    reset: () => { setPrevious(build); update(emptyBuild()); setNotice('Build reset. Undo reset is available.'); },
    undo: () => { if (previous) { update(previous); setPrevious(null); setNotice('Previous build restored.'); } },
    share: async () => { const url = new URL('/', location.origin); url.searchParams.set('build', encodeBuild(build)); url.hash = 'workshop'; setShareUrl(url.href); try { await navigator.clipboard.writeText(url.href); setNotice('Build link copied. Anyone with this link can view these vehicle preferences.'); } catch { setNotice('Copy the build link below. It contains your vehicle and selected upgrades.'); } },
  };
  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}
export function MobileBuildBar() {
  const { build } = useBuild(), path = usePathname();
  if (path.startsWith('/enquire')) return null;
  return <aside className="mw-mobile-bar" aria-label="Your build shortcut"><Link href="/#workshop"><span>YOUR BUILD</span><b>{build.selections.length} upgrade{build.selections.length === 1 ? '' : 's'}</b></Link><Link href="/enquire/">Request a quote <ArrowUpRight size={18} /></Link></aside>;
}
