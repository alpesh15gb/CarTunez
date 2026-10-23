'use client';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Bluetooth, BluetoothConnected, Check, ChevronLeft, ChevronRight, Circle, Delete, Expand, Grid2X2, Home, MapPin, Mic, MicOff, Music2, Navigation, Radio, Pause, Phone, PhoneOff, Play, RotateCcw, Search, Settings, SkipBack, SkipForward, SlidersHorizontal, Sun, Volume2, VolumeX, Wifi, X } from 'lucide-react';
import { useAudioDeck, demoTracks, type Equalizer } from '@/hooks/useAudioDeck';
import { useMotion } from './MotionProvider';
import { site } from '@/lib/site';
import { ReceiverHome, AndroidDashboard, type ReceiverApp } from './ReceiverDashboards';

type App = ReceiverApp;
type Preferences = { volume: number; brightness: number; muted: boolean; eq: Equalizer; accent: string };
const defaults: Preferences = { volume: 45, brightness: 100, muted: false, eq: [0, 0, 0], accent: '#ff5565' };
const apps = [{ id: 'dashboard', name: 'Android Auto', icon: Navigation, color: '#a8c7fa' }, { id: 'radio', name: 'Radio', icon: Radio, color: '#a8c7fa' }, { id: 'maps', name: 'Maps', icon: Navigation, color: '#60c8ac' }, { id: 'music', name: 'Music', icon: Music2, color: '#ff6375' }, { id: 'phone', name: 'Phone', icon: Phone, color: '#74bfed' }, { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth, color: '#85aaf5' }, { id: 'settings', name: 'Settings', icon: Settings, color: '#d6b57c' }] as const;
const eqPresets: Record<string, Equalizer> = { Flat: [0, 0, 0], Bass: [6, -2, 1], Vocal: [-2, 4, 2] };
const time = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

function Spectrum({ playing, getAnalyser, animate }: { playing: boolean; getAnalyser: () => AnalyserNode | null; animate: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current, context = el?.getContext('2d'); if (!el || !context) return;
    let frame = 0;
    const bins = new Uint8Array(64);
    const draw = () => {
      context.clearRect(0, 0, 256, 50);
      if (playing && animate) getAnalyser()?.getByteFrequencyData(bins);
      for (let i = 0; i < 32; i++) { const height = playing && animate ? Math.max(3, bins[i] / 255 * 46) : 3; context.fillStyle = '#ff6979'; context.fillRect(i * 8, (50 - height) / 2, 4, height); }
      if (playing && animate) frame = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(frame);
  }, [playing, getAnalyser, animate]);
  return <canvas ref={canvas} width={256} height={50} className="hu-spectrum" aria-hidden="true" />;
}

export default function InfotainmentDemo({ request = null }: { request?: { app: ReceiverApp; id: number } | null }) {
  const { full } = useMotion();
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [clock, setClock] = useState('09:41');
  const [expanded, setExpanded] = useState(false);
  const [app, setApp] = useState<App>('home');
  const [mode, setMode] = useState<'receiver' | 'android-auto'>('receiver');
  const [frequency, setFrequency] = useState(98.3);
  const [radioBand, setRadioBand] = useState<'FM1' | 'FM2'>('FM1');
  const [history, setHistory] = useState<App[]>([]);
  const [recent, setRecent] = useState<App[]>([]);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState('');
  const [routeStarted, setRouteStarted] = useState(false);
  const [mapError, setMapError] = useState('');
  const [bluetooth, setBluetooth] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [paired, setPaired] = useState('');
  const [digits, setDigits] = useState('');
  const [call, setCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [wifi, setWifi] = useState(true);
  const [message, setMessage] = useState('');
  const modal = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const deck = useAudioDeck(preferences.volume, preferences.muted, preferences.eq);
  const currentTrack = demoTracks[deck.track];

  useEffect(() => { if (new URLSearchParams(location.search).get('screen') === 'connect') setExpanded(true); }, []);
  useEffect(() => {
    if (!request) return;
    setApp(request.app); setHistory([]);
    setMode(request.app === 'maps' || request.app === 'dashboard' ? 'android-auto' : 'receiver');
    setExpanded(true);
  }, [request]);

  useEffect(() => { const update = () => setClock(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(new Date())); update(); const timer = setInterval(update, 60000); return () => clearInterval(timer); }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cartunez-headunit-v1') ?? 'null');
      if (saved) setPreferences({ volume: typeof saved.volume === 'number' ? Math.min(100, Math.max(0, saved.volume)) : 45, brightness: typeof saved.brightness === 'number' ? Math.min(100, Math.max(40, saved.brightness)) : 100, muted: saved.muted === true, eq: Array.isArray(saved.eq) && saved.eq.length === 3 && saved.eq.every((v: unknown) => typeof v === 'number' && Number.isFinite(v)) ? saved.eq.map((v: number) => Math.max(-6, Math.min(6, v))) as Equalizer : [0, 0, 0], accent: ['#ff5565', '#61c7c4', '#edb865'].includes(saved.accent) ? saved.accent : defaults.accent });
    } catch { /* Storage is optional; the complete demo works without it. */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem('cartunez-headunit-v1', JSON.stringify(preferences)); } catch {} } }, [preferences, loaded]);
  useEffect(() => { const section = consoleRef.current?.closest<HTMLElement>('.audio-visual'); if (section) section.dataset.playing = String(deck.playing); return () => { if (section) delete section.dataset.playing; }; }, [deck.playing]);
  useEffect(() => { if (!scanning) return; const timer = setTimeout(() => { setDiscovered(true); setScanning(false); }, 700); return () => clearTimeout(timer); }, [scanning]);
  useEffect(() => { if (!call) return; const timer = setInterval(() => setCallSeconds(value => value + 1), 1000); return () => clearInterval(timer); }, [call]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 3500); return () => clearTimeout(timer); }, [message]);
  useEffect(() => {
    if (!expanded) return;
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const panel = modal.current;
    const outside = [...document.body.children].filter((element): element is HTMLElement => element instanceof HTMLElement && !element.contains(panel) && !['SCRIPT', 'STYLE'].includes(element.tagName)).map(element => ({ element, inert: element.inert }));
    outside.forEach(({ element }) => { element.inert = true; });
    panel?.querySelector<HTMLElement>('button')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeDemo(); return; }
      if (event.key !== 'Tab' || !panel) return;
      const list = [...panel.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select')].filter(el => el.getClientRects().length);
      const first = list[0], last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = overflow; outside.forEach(({ element, inert }) => { element.inert = inert; }); document.removeEventListener('keydown', trap); (focused?.isConnected ? focused : launch.current)?.focus({ preventScroll: true }); };
  }, [expanded]);

  useEffect(() => { if (expanded) modal.current?.querySelector<HTMLElement>('.hu-app-content')?.focus({ preventScroll: true }); }, [app, expanded]);

  function navigate(next: App) {
    if (!expanded) setExpanded(true);
    if (next === 'dashboard') setMode('android-auto');
    if (next === 'radio' || next === 'bluetooth') setMode('receiver');
    if (next === 'radio') deck.pause();
    if (next !== app) { setHistory(previous => [...previous, app]); setApp(next); }
    if (next !== 'home' && next !== 'apps') setRecent(previous => [next, ...previous.filter(value => value !== next)].slice(0, 4));
  }
  function home() { setMode('receiver'); setApp('home'); setHistory([]); }
  function projection() { navigate('dashboard'); }
  function tune(amount: number) { setFrequency(value => Math.round(Math.min(108, Math.max(87.5, value + amount)) * 10) / 10); }
  function back() { const previous = history[history.length - 1] ?? 'home'; if (previous === 'dashboard') setMode('android-auto'); if (previous === 'home') setMode('receiver'); setApp(previous); setHistory(stack => stack.slice(0, -1)); }
  function findRoute(event: FormEvent) { event.preventDefault(); const value = destination.trim(); if (value.length < 3) { setMapError('Enter a destination with at least 3 characters.'); return; } setMapError(''); setRoute(value); setRouteStarted(false); }
  function endCall() { setCall(false); setMicMuted(false); setMessage('Demo call ended. No real call was placed.'); }
  const patch = (value: Partial<Preferences>) => setPreferences(previous => ({ ...previous, ...value }));
  function closeDemo() { deck.pause(); setCall(false); setMicMuted(false); setExpanded(false); const url = new URL(location.href); if (url.searchParams.has('screen')) { url.searchParams.delete('screen'); window.history.replaceState(window.history.state, '', url); } }

  const launcher = <div className="hu-launcher">{apps.map(item => <button key={item.id} onClick={() => navigate(item.id)} className="hu-app-tile"><span style={{ color: item.color }}><item.icon size={25} strokeWidth={1.6} /></span>{item.name}</button>)}</div>;
  const playerControls = <div className="hu-player-controls"><button aria-label="Previous track" onClick={() => deck.select(deck.track - 1)}><SkipBack size={21} /></button><button className="hu-play" aria-label={deck.playing ? 'Pause music' : 'Play music'} onClick={() => deck.playing ? deck.pause() : void deck.start()}>{deck.playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}</button><button aria-label="Next track" onClick={() => deck.select(deck.track + 1)}><SkipForward size={21} /></button></div>;

  function screen(compact = false) {
    const currentApp = compact ? 'home' : app;
    const projected = !compact && mode === 'android-auto';
    const dashboardProps = { navigate, clock, title: currentTrack.title, playing: deck.playing, togglePlay: () => deck.playing ? deck.pause() : void deck.start(), previous: () => deck.select(deck.track - 1), next: () => deck.select(deck.track + 1), route, paired };
    return <div className={`hu-os ${compact ? 'hu-compact' : ''} ${projected ? 'hu-android-auto' : 'hu-receiver'}`} style={{ '--hu-accent': preferences.accent, '--hu-key-colour': preferences.accent } as CSSProperties}>
      <header className="hu-status"><span><b className="pioneer-wordmark">Pioneer</b><i>{projected ? "ANDROID AUTO" : "RECEIVER"}</i></span><div className="hu-mode-switch" aria-label="Receiver screen mode"><button aria-pressed={!projected} onClick={() => compact ? (setExpanded(true), home()) : home()}>Receiver</button><button aria-pressed={projected} onClick={projection}>Android Auto</button></div><span>{paired ? <BluetoothConnected size={14} aria-label={`Demo connected to ${paired}`} /> : <Bluetooth size={14} />} {wifi && <Wifi size={14} />}<span className="hu-demo-badge">PREVIEW</span><span>{clock}</span></span></header>
      <div className="hu-workspace"><aside className="hu-dock" aria-label="Head unit navigation"><button aria-label={projected ? 'Android Auto dashboard' : 'Head unit home'} onClick={() => projected ? navigate('dashboard') : compact ? (setExpanded(true), home()) : home()} className={currentApp === 'home' ? 'hu-selected' : ''}><Home size={20} /></button>{apps.filter(item => ['maps', 'music', 'phone'].includes(item.id)).map(item => <button key={item.id} aria-label={`Open ${item.name}`} className={currentApp === item.id ? 'hu-selected' : ''} onClick={() => navigate(item.id)}><item.icon size={20} /></button>)}<button aria-label="Open all apps" onClick={() => navigate('apps')}><Grid2X2 size={20} /></button></aside>
        <div className="hu-app-content" key={currentApp} tabIndex={-1}>
          {currentApp === 'home' && <ReceiverHome {...dashboardProps} />}
          {currentApp === 'dashboard' && <AndroidDashboard {...dashboardProps} />}
          {currentApp === 'radio' && <div className="pioneer-radio"><div className="hu-page-heading"><span>RECEIVER SOURCE / TUNER PREVIEW</span><h3>Radio</h3></div><div className="radio-readout"><button onClick={() => setRadioBand(value => value === 'FM1' ? 'FM2' : 'FM1')}>{radioBand}</button><span>STEREO</span><b>{frequency.toFixed(1)}<small>MHz</small></b><p>FM tuner simulation · no live broadcast</p></div><div className="radio-tune"><button aria-label="Tune FM down" onClick={() => tune(-.1)}><ChevronLeft size={25} /></button><label><span className="sr-only">FM frequency</span><input type="range" aria-label="FM frequency" min="87.5" max="108" step=".1" value={frequency} onChange={event => setFrequency(Number(event.target.value))} /><span>87.5<span>108 MHz</span></span></label><button aria-label="Tune FM up" onClick={() => tune(.1)}><ChevronRight size={25} /></button></div><div className="radio-presets">{(radioBand === 'FM1' ? [91.1, 93.5, 94.3, 98.3, 104, 107.8] : [88, 90.4, 95, 99.5, 102.4, 106.4]).map((station, i) => <button key={station} aria-pressed={frequency === station} onClick={() => setFrequency(station)}><small>0{i + 1}</small><b>{station.toFixed(1)}</b></button>)}</div><p className="hu-help">Try the presets, change bands or tune a frequency. For sound, open USB Audio and play an original demo track.</p><button className="hu-secondary" onClick={() => navigate('music')}><Music2 size={17} />Open USB Audio</button></div>}
          {currentApp === 'apps' && <div className="hu-apps-page"><div className="hu-page-heading"><span>MAKE YOURSELF AT HOME</span><h3>Your apps.</h3></div>{launcher}<div className="hu-recent"><span>RECENTLY OPENED</span>{recent.length ? recent.map(id => <button key={id} onClick={() => navigate(id)}>{apps.find(item => item.id === id)?.name}</button>) : <p>Open an app to add it here.</p>}</div></div>}
          {currentApp === 'music' && <div className="hu-music-page"><div className="hu-page-heading"><span>THE CARTUNEZ ORIGINAL SESSIONS</span><h3>Your soundtrack.</h3></div><div className="hu-music-columns"><div className="hu-now-playing"><div className="hu-album hu-album-large" style={{ '--album-color': currentTrack.color } as CSSProperties}><Music2 size={50} /><span>CTZ / {String(deck.track + 1).padStart(2, '0')}</span></div><h4>{currentTrack.title}</h4><p>{currentTrack.mood} · Original preview</p><Spectrum playing={deck.playing} getAnalyser={deck.getAnalyser} animate={full} /><label className="hu-seek"><span className="sr-only">Track position</span><input aria-label="Track position" type="range" min="0" max={deck.duration} step=".1" value={Math.min(deck.position, deck.duration)} onChange={event => deck.seek(Number(event.target.value))} /><span>{time(deck.position)}<span>{time(deck.duration)}</span></span></label>{playerControls}</div><div className="hu-library"><span className="hu-kicker">CHOOSE YOUR DRIVE</span>{demoTracks.map((track, index) => <button key={track.title} onClick={() => deck.select(index)} className={deck.track === index ? 'hu-track-active' : ''}><span className="hu-track-number">0{index + 1}</span><span><b>{track.title}</b><small>{track.mood}</small></span>{deck.track === index && deck.playing ? <Volume2 size={17} /> : <Play size={15} />}</button>)}<button className="hu-secondary" onClick={() => navigate('settings')}><SlidersHorizontal size={17} />Tune the equalizer</button><p className="hu-help">Three original 24-second previews. Sound starts only when you choose Play.</p></div></div></div>}
          {currentApp === 'maps' && <div className="hu-maps-page"><div className="hu-page-heading"><span>FIND YOUR NEXT CHAPTER</span><h3>Where to?</h3></div><form onSubmit={findRoute} className="hu-map-search"><Search size={18} /><input aria-label="Destination" placeholder="Enter a place or city" maxLength={160} value={destination} onChange={event => setDestination(event.target.value)} /><button type="submit">Find route</button></form>{mapError && <p className="hu-error" role="alert">{mapError}</p>}<div className={`hu-route-map ${routeStarted ? 'hu-route-started' : ''}`}><svg viewBox="0 0 600 230" role="img" aria-label="Illustrative route preview, not live map data"><path className="hu-blocks" d="M0 32H600M0 98H600M0 167H600M71 0V230M202 0V230M390 0V230M520 0V230" /><path className="hu-map-road" d="M-10 199 172 130 292 130 399 41 620 41M83-20 160 79 360 208 500 250" /><path className="hu-map-route" d="M85 170 185 130 290 130 399 41 490 41" /><circle cx="85" cy="170" r="9" fill="#6ec8ae" /><circle cx="490" cy="41" r="11" fill="#ff6878" /><path d="m82 167 10 3-9 7Z" fill="#0d141c" /></svg><span className="hu-map-demo-label">ILLUSTRATIVE MAP · NO LIVE GPS</span>{!route && <div className="hu-map-empty"><Navigation size={28} /><p>Every great drive<br />starts somewhere.</p></div>}</div>{route && <div className="hu-route-summary"><div><small>{routeStarted ? 'ROUTE PREVIEW ACTIVE' : 'YOUR DESTINATION'}</small><h4>{route}</h4><p>{routeStarted ? 'Continue in Google Maps for live directions.' : 'Preview the screen, then get live directions.'}</p></div><div><button className="hu-primary" onClick={() => setRouteStarted(value => !value)}>{routeStarted ? 'Stop preview' : 'Preview route'}</button><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(route)}&travelmode=driving`} target="_blank" rel="noopener noreferrer">Open Google Maps ↗</a></div></div>}<p className="hu-help">Open Google Maps for live directions and arrival times.</p></div>}
          {currentApp === 'bluetooth' && <div className="hu-bluetooth-page"><div className="hu-page-heading"><span>A CONNECTION THAT FEELS EFFORTLESS</span><h3>Bring your world.</h3></div><div className="hu-device-status"><Bluetooth size={36} /><div><h4>{paired || (bluetooth ? 'Ready to connect' : 'Bluetooth is off')}</h4><p>{paired ? 'Demo connection active · Calls & media' : 'Explore the pairing flow with a sample device.'}</p></div><button className="hu-toggle" aria-label="Demo Bluetooth" aria-pressed={bluetooth} onClick={() => { setBluetooth(value => !value); setPaired(''); setDiscovered(false); setScanning(false); }}><span /></button></div><p className="hu-notice">Pairing simulation. No access to your phone, contacts or Bluetooth hardware.</p>{bluetooth && !paired && <><button className="hu-primary" disabled={scanning} onClick={() => { setScanning(true); setDiscovered(false); }}>{scanning ? 'Searching demo devices…' : 'Find demo devices'}</button>{discovered && <div className="hu-device-list">{['Driver’s phone', 'Passenger’s phone'].map(name => <button key={name} onClick={() => { setPaired(name); setMessage(`Demo paired with ${name}.`); }}><Phone size={22} /><span><b>{name}</b><small>Sample device · Tap to pair</small></span><Bluetooth size={18} /></button>)}</div>}</>}{paired && <div className="hu-paired-actions"><span><Check size={18} />Paired in this demo</span><button className="hu-secondary" onClick={() => { setPaired(''); setDiscovered(false); }}>Disconnect</button><button className="hu-primary" onClick={() => navigate('phone')}>Try a demo call</button></div>}</div>}
          {currentApp === 'phone' && <div className="hu-phone-page"><div className="hu-page-heading"><span>STAY CONNECTED</span><h3>{call ? 'On your terms.' : 'Your people. Closer.'}</h3></div>{call ? <div className="hu-active-call"><span className="hu-caller"><Phone size={34} /></span><h4>{digits}</h4><p>DEMO CALL · {time(callSeconds)}</p><div><button className={micMuted ? 'hu-selected' : ''} aria-label={micMuted ? 'Unmute demo microphone' : 'Mute demo microphone'} onClick={() => setMicMuted(value => !value)}>{micMuted ? <MicOff size={22} /> : <Mic size={22} />}{micMuted ? 'Muted' : 'Mute'}</button><button className="hu-end-call" onClick={endCall}><PhoneOff size={24} />End demo call</button></div><p className="hu-help">No real call or microphone access. Music pauses during the demo call.</p></div> : <div className="hu-phone-columns"><div className="hu-dialer"><label><span className="sr-only">Phone number for demo call</span><input type="tel" aria-label="Phone number for demo call" placeholder="Enter a number" value={digits} maxLength={15} onChange={event => setDigits(event.target.value.replace(/[^0-9+#*]/g, ''))} /></label><div className="hu-keypad">{'123456789*0#'.split('').map(digit => <button key={digit} aria-label={`Dial ${digit}`} onClick={() => setDigits(value => (value + digit).slice(0, 15))}>{digit}</button>)}</div><div className="hu-dial-actions"><button className="hu-call-button" onClick={() => { if (digits.replace(/\D/g, '').length < 3) { setPhoneError('Enter at least 3 digits for a demo call.'); return; } setPhoneError(''); deck.pause(); setCall(true); setCallSeconds(0); }}><Phone size={20} />Start demo call</button><button aria-label="Delete last digit" onClick={() => setDigits(value => value.slice(0, -1))}><Delete size={22} /></button></div>{phoneError && <p className="hu-error" role="alert">{phoneError}</p>}</div><div className="hu-phone-info"><Phone size={30} /><h4>Hands-free, explored.</h4><p>Try the keypad, mute and end-call controls. This is a call simulation.</p><button className="hu-secondary" onClick={() => { setDigits(site.phone); setPhoneError(''); }}>Use workshop number</button><a className="hu-real-call" href={`tel:${site.phone}`}>Call the real workshop on your phone ↗</a><small>{site.phoneDisplay}</small></div></div>}</div>}
          {currentApp === 'settings' && <div className="hu-settings-page"><div className="hu-page-heading"><span>SMALL DETAILS. YOUR DIFFERENCE.</span><h3>Make it feel right.</h3></div><div className="hu-settings-columns"><div><label className="hu-setting-slider"><span><Volume2 size={18} />Volume <b>{preferences.volume}%</b></span><input type="range" aria-label="Demo volume" min="0" max="100" value={preferences.volume} onChange={event => patch({ volume: Number(event.target.value), muted: false })} /></label><label className="hu-setting-slider"><span><Sun size={18} />Screen brightness <b>{preferences.brightness}%</b></span><input type="range" aria-label="Screen brightness" min="40" max="100" value={preferences.brightness} onChange={event => patch({ brightness: Number(event.target.value) })} /></label><div className="hu-accent-picker"><span>Key illumination colour</span>{['#ff5565', '#61c7c4', '#edb865'].map((color, i) => <button key={color} aria-label={`Ambient ${['red', 'teal', 'amber'][i]}`} aria-pressed={preferences.accent === color} onClick={() => patch({ accent: color })} style={{ backgroundColor: color }}>{preferences.accent === color && <Check size={14} />}</button>)}</div><div className="hu-wifi-setting"><span><Wifi size={18} />Demo Wi-Fi indicator</span><button className="hu-toggle" aria-label="Demo Wi-Fi" aria-pressed={wifi} onClick={() => setWifi(value => !value)}><span /></button></div></div><div className="hu-equalizer"><span className="hu-kicker">SOUND, YOUR WAY</span><div className="hu-eq-presets">{Object.entries(eqPresets).map(([name, values]) => <button key={name} aria-pressed={preferences.eq.every((v, i) => v === values[i])} onClick={() => patch({ eq: [...values] as Equalizer })}>{name}</button>)}</div>{['Bass', 'Mid', 'Treble'].map((label, index) => <label className="hu-eq-band" key={label}><span>{label}</span><input type="range" aria-label={`${label} equalizer`} min="-6" max="6" step="1" value={preferences.eq[index]} onChange={event => { const eq = [...preferences.eq] as Equalizer; eq[index] = Number(event.target.value); patch({ eq }); }} /><b>{preferences.eq[index] > 0 ? '+' : ''}{preferences.eq[index]} dB</b></label>)}<p className="hu-help">Simplified 3-band web EQ changes the actual preview audio; receiver EQ varies by model. Preferences stay in this browser.</p><button className="hu-secondary" onClick={() => { setPreferences({ ...defaults, eq: [0, 0, 0] }); setMessage('Display and sound settings reset.'); }}><RotateCcw size={15} />Reset settings</button></div></div></div>}
        </div>
      </div><footer className="hu-system-bar"><div><button aria-label="Head unit back" onClick={back}><ChevronLeft size={19} /></button><button aria-label="Head unit home button" onClick={home}><Circle size={16} /></button><button aria-label="Head unit app drawer" onClick={() => navigate('apps')}><Grid2X2 size={17} /></button></div><span>{projected ? 'Android Auto · website preview' : paired ? `Demo paired · ${paired}` : 'Pioneer-style receiver · website preview'}</span><button aria-label={preferences.muted ? 'Unmute preview audio' : 'Mute preview audio'} onClick={() => patch({ muted: !preferences.muted })}>{preferences.muted || preferences.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}<small>{preferences.volume}%</small></button></footer>
      <div className="hu-dimmer" style={{ opacity: (100 - preferences.brightness) / 150 }} />
      {(message || deck.error) && <div className="hu-toast" role="status">{deck.error || message}</div>}
    </div>;
  }

  return <div className="infotainment-console" ref={consoleRef}>
    <audio ref={deck.audio} src={demoTracks[0].file} preload="none" onPlay={() => deck.setPlaying(true)} onPause={() => deck.setPlaying(false)} onTimeUpdate={event => deck.setPosition(event.currentTarget.currentTime)} onLoadedMetadata={event => { if (Number.isFinite(event.currentTarget.duration)) deck.setDuration(event.currentTarget.duration); }} onEnded={() => deck.select(deck.track + 1)} onError={() => { deck.pause(); setMessage('Preview unavailable. Choose another track or try again.'); }} />
    <div className="dashboard-screen infotainment-device">{screen(true)}</div>
    <div className="infotainment-demo-caption"><button ref={launch} onClick={() => setExpanded(true)}><Expand size={16} />Try the Pioneer experience</button><span>Receiver home → Android Auto. Explore both.</span></div>
    {expanded && createPortal(<div className="hu-modal-backdrop" data-lenis-prevent onClick={event => { if (event.target === event.currentTarget) closeDemo(); }}><div ref={modal} className="hu-modal" role="dialog" aria-modal="true" aria-labelledby="hu-dialog-title"><div className="hu-modal-top"><div><span className="eyebrow red">CARTUNEZ / PIONEER EXPERIENCE</span><h2 id="hu-dialog-title">Take the screen for a spin.</h2></div><button aria-label="Close infotainment demo" onClick={closeDemo}><X size={22} /></button></div>{screen()}<p className="hu-modal-note">Representative Pioneer & Android Auto website preview; interface and features vary by model. Maps are illustrative; pairing, FM and calls are simulated. Audio previews play for real.</p></div></div>, document.body)}
  </div>;
}
