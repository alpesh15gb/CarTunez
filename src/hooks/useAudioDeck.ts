'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export const demoTracks = [
  { title: 'Midnight Drive', mood: 'Cinematic synth', file: '/audio/midnight-drive.mp3', color: '#f85a65' },
  { title: 'After Hours', mood: 'Slow city rhythm', file: '/audio/after-hours.mp3', color: '#56b9c2' },
  { title: 'Open Road', mood: 'A little more energy', file: '/audio/open-road.mp3', color: '#e9ae60' },
];
export type Equalizer = [number, number, number];

export function useAudioDeck(volume: number, muted: boolean, equalizer: Equalizer) {
  const audio = useRef<HTMLAudioElement>(null);
  const graph = useRef<{ context: AudioContext; filters: BiquadFilterNode[]; analyser: AnalyserNode } | null>(null);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(24);
  const [error, setError] = useState('');
  const desiredPlayback = useRef(false);
  const request = useRef(0);

  useEffect(() => { if (audio.current) { audio.current.volume = volume / 100; audio.current.muted = muted; } }, [volume, muted]);
  useEffect(() => { graph.current?.filters.forEach((filter, i) => filter.gain.setTargetAtTime(equalizer[i], graph.current!.context.currentTime, .03)); }, [equalizer]);
  useEffect(() => { const element = audio.current; return () => { request.current++; element?.pause(); if (graph.current?.context.state !== 'closed') void graph.current?.context.close(); }; }, []);

  async function start() {
    const el = audio.current; if (!el) return;
    const id = ++request.current; desiredPlayback.current = true; setError('');
    // Build the graph only after an explicit Play action. Playback still works without Web Audio.
    if (!graph.current && typeof AudioContext !== 'undefined') {
      try {
        const context = new AudioContext();
        const source = context.createMediaElementSource(el);
        const filters = [80, 1000, 8000].map((frequency, i) => { const filter = context.createBiquadFilter(); filter.type = i === 0 ? 'lowshelf' : i === 2 ? 'highshelf' : 'peaking'; filter.frequency.value = frequency; filter.Q.value = .7; filter.gain.value = equalizer[i]; return filter; });
        const analyser = context.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = .78;
        source.connect(filters[0]); filters[0].connect(filters[1]); filters[1].connect(filters[2]); filters[2].connect(analyser); analyser.connect(context.destination);
        graph.current = { context, filters, analyser };
      } catch { /* Native HTML audio remains the fallback when the audio graph is unavailable. */ }
    }
    try {
      await graph.current?.context.resume();
      if (id !== request.current || !desiredPlayback.current) return;
      await el.play();
      if (id !== request.current || !desiredPlayback.current) el.pause();
    } catch (e) { if (id === request.current && (e as Error).name !== 'AbortError') { desiredPlayback.current = false; setPlaying(false); setError('Playback could not start. Press Play to try again.'); } }
  }
  function pause() { desiredPlayback.current = false; request.current++; audio.current?.pause(); setPlaying(false); }
  function select(index: number, autoplay = true) {
    const next = (index + demoTracks.length) % demoTracks.length;
    request.current++; audio.current?.pause(); setTrack(next); setPosition(0); setError('');
    if (audio.current) { audio.current.src = demoTracks[next].file; audio.current.load(); }
    if (autoplay) void start(); else { desiredPlayback.current = false; setPlaying(false); }
  }
  function seek(value: number) { if (audio.current && Number.isFinite(audio.current.duration)) { audio.current.currentTime = value; setPosition(value); } }
  const getAnalyser = useCallback(() => graph.current?.analyser ?? null, []);
  return { audio, track, playing, position, duration, error, start, pause, select, seek, getAnalyser, setPlaying, setPosition, setDuration };
}
