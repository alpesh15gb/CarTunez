'use client';
import { Bluetooth, ChevronLeft, ChevronRight, Grid2X2, Music2, Navigation, Pause, Phone, Play, Radio, Search, Settings, SkipBack, SkipForward, Usb } from 'lucide-react';

export type ReceiverApp = 'home' | 'dashboard' | 'maps' | 'music' | 'phone' | 'bluetooth' | 'settings' | 'apps' | 'radio';
type DashboardProps = {
  navigate: (app: ReceiverApp) => void;
  clock: string;
  title: string;
  playing: boolean;
  togglePlay: () => void;
  previous: () => void;
  next: () => void;
  route: string;
  paired: string;
};

export function ReceiverHome({ navigate, clock, title, playing, togglePlay, paired }: DashboardProps) {
  const sources = [
    { name: 'Radio', icon: Radio, app: 'radio' },
    { name: 'Bluetooth Audio', icon: Bluetooth, app: 'bluetooth' },
    { name: 'Android Auto', icon: Navigation, app: 'dashboard' },
    { name: 'USB Audio', icon: Usb, app: 'music' },
    { name: 'Phone', icon: Phone, app: 'phone' },
    { name: 'Settings', icon: Settings, app: 'settings' },
  ] as const;
  return <div className="pioneer-home">
    <div className="pioneer-wallpaper" aria-hidden="true"><i /><i /><i /></div>
    <div className="pioneer-widgets">
      <div className="pioneer-clock"><span>{clock}</span><small>YOUR DRIVE. CONNECTED.</small><span className="pioneer-ready"><i />Receiver home</span></div>
      <div className="pioneer-widget"><small>{playing ? 'USB AUDIO · NOW PLAYING' : 'YOUR FAVOURITE SOUND'}</small><Music2 size={31} /><button className="pioneer-track" onClick={() => navigate('music')}>{title}</button><div><button aria-label={playing ? 'Pause music' : 'Play music'} onClick={togglePlay}>{playing ? <Pause size={20} /> : <Play size={20} />}</button><span>{playing ? 'Original preview playing' : 'Tap play to listen'}</span></div></div>
    </div>
    <div className="pioneer-source-caption"><span>FAVOURITE SOURCES</span><button onClick={() => navigate('apps')} aria-label="Show all receiver sources"><Grid2X2 size={17} />All sources</button></div>
    <div className="pioneer-sources">{sources.map(source => <button key={source.name} onClick={() => navigate(source.app)} className={source.app === 'dashboard' ? 'pioneer-projection' : ''}><source.icon size={28} strokeWidth={1.6} /><span>{source.name}</span></button>)}</div>
    <button className="pioneer-connect" onClick={() => navigate('bluetooth')}><Bluetooth size={13} />{paired ? `${paired} · demo connected` : 'Connect a phone · explore pairing'}<ChevronRight size={14} /></button>
  </div>;
}

export function DashboardMap({ route }: { route: string }) {
  return <div className="aa-map-art" aria-hidden="true"><svg viewBox="0 0 580 430" preserveAspectRatio="xMidYMid slice"><path className="aa-park" d="M0 5H128L179 102 127 170H0ZM400 350 500 280 580 320V430H420Z" /><g className="aa-streets"><path d="M0 45H580M0 115H580M0 191H580M0 272H580M0 355H580M56 0V430M153 0V430M267 0V430M397 0V430M509 0V430" /></g><path className="aa-road" d="M-10 376 180 272 267 272 397 115 620 115M153-10 153 191 267 355 580 400" /><path className="aa-route-line" d="M152 287 180 272 267 272 397 115 476 115" /><circle cx="476" cy="115" r="12" fill="#f3a69e" /><circle cx="152" cy="287" r="25" fill="#a8c7fa33" /><path d="m152 268 13 33-13-6-13 6Z" fill="#a8c7fa" stroke="#243c5e" strokeWidth="3" /></svg><span className="aa-street-name">DRIVE PREVIEW</span><span className="aa-map-caption">{route ? 'Illustrative route · not live GPS' : 'Illustrative map · choose a destination'}</span></div>;
}

export function AndroidDashboard({ navigate, title, playing, togglePlay, previous, next, route }: DashboardProps) {
  return <div className="aa-dashboard">
    <div className="aa-media-column"><div className="aa-media-card"><div className="aa-record"><Music2 size={37} /></div><div><small>CARTUNEZ ORIGINAL SESSIONS</small><button className="aa-song" onClick={() => navigate('music')}>{title}</button><span>{playing ? 'Now playing' : 'Ready when you are'}</span></div><div className="aa-playback"><button aria-label="Previous track" onClick={previous}><SkipBack size={22} /></button><button aria-label={playing ? 'Pause music' : 'Play music'} className="aa-play" onClick={togglePlay}>{playing ? <Pause size={27} fill="currentColor" /> : <Play size={27} fill="currentColor" />}</button><button aria-label="Next track" onClick={next}><SkipForward size={22} /></button></div></div><button className="aa-phone-card" onClick={() => navigate('phone')}><Phone size={25} /><span><b>Keep in touch</b><small>Explore hands-free calling</small></span><ChevronRight size={20} /></button></div>
    <button className="aa-map-card" onClick={() => navigate('maps')} aria-label="Explore Android Auto navigation"><DashboardMap route={route} /><span className="aa-search-pill"><Search size={22} /><span>Search destinations</span></span><span className="aa-route-card"><Navigation size={25} /><span><b>{route || 'Where to?'}</b><small>{route ? 'Continue route preview' : 'Your next drive starts here'}</small></span><ChevronLeft size={20} /></span></button>
  </div>;
}
