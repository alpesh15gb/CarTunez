export const zones = [
  { id: 'exterior', number: '01', label: 'Exterior / style', short: 'Exterior', description: 'Start with presence. Explore the reference car, then choose a direction for your own.' },
  { id: 'interior', number: '02', label: 'Interior / comfort', short: 'Interior', description: 'The details you live with. Compare matching cabin concepts and shape your interior.' },
  { id: 'lighting', number: '03', label: 'Lighting / electronics', short: 'Lighting', description: 'Set an after-dark mood. These three colours have matching concept previews.' },
  { id: 'audio', number: '04', label: 'Audio', short: 'Audio', description: 'Build around how you listen. Explore the working Pioneer-inspired receiver below.' },
  { id: 'performance', number: '05', label: 'Performance / utility', short: 'Performance', description: 'Tell us what you want from your drive. Suitability and installation need a vehicle-specific consultation.' },
] as const;
export type Zone = typeof zones[number]['id'];
export const upgrades: { id: string; zone: Zone; label: string; detail: string; group?: string; preview?: string }[] = [
  { id: 'exterior-styling', zone: 'exterior', label: 'Body & styling consultation', detail: 'Front lip, side skirts and rear styling. Quote preference; no part swap is previewed.' },
  { id: 'wheel-consultation', zone: 'exterior', label: 'Wheel & finish consultation', detail: 'Discuss dimensions, finish and compatible options. Reference wheels remain unchanged.' },
  { id: 'rim-silver', zone: 'exterior', label: 'Brushed silver rim finish', detail: 'Live finish study on the supplied reference wheels.', group: 'rim', preview: 'silver' },
  { id: 'rim-graphite', zone: 'exterior', label: 'Graphite rim finish', detail: 'Live finish study on the supplied reference wheels.', group: 'rim', preview: 'graphite' },
  { id: 'rim-bronze', zone: 'exterior', label: 'Satin bronze rim finish', detail: 'Live finish study on the supplied reference wheels.', group: 'rim', preview: 'bronze' },
  { id: 'matting-cocoa', zone: 'interior', label: 'Cocoa quilt matting', detail: 'Matching factory-to-quilt concept preview.', preview: 'matting' },
  { id: 'seat-consultation', zone: 'interior', label: 'Seat & upholstery consultation', detail: 'Discuss material, pattern and comfort. Quote preference; no seat swap is previewed.' },
  { id: 'light-blue', zone: 'lighting', label: 'Ice blue ambient lighting', detail: 'Matching cabin concept preview.', group: 'ambient', preview: 'blue' },
  { id: 'light-red', zone: 'lighting', label: 'Electric red ambient lighting', detail: 'Matching cabin concept preview.', group: 'ambient', preview: 'red' },
  { id: 'light-amber', zone: 'lighting', label: 'Warm amber ambient lighting', detail: 'Matching cabin concept preview.', group: 'ambient', preview: 'amber' },
  { id: 'dashcam', zone: 'lighting', label: 'Dashcam consultation', detail: 'Discuss recording, wiring and compatible cameras. Quote preference.' },
  { id: 'pioneer-receiver', zone: 'audio', label: 'Pioneer receiver', detail: 'Choose a suitable model with the team. Website preview is illustrative.' },
  { id: 'speaker-system', zone: 'audio', label: 'Speakers & amplifier', detail: 'A system planned around your cabin and listening preferences.' },
  { id: 'dsp', zone: 'audio', label: 'DSP & sound tuning', detail: 'Discuss signal processing and system tuning options.' },
  { id: 'ecu-consultation', zone: 'performance', label: 'ECU suitability consultation', detail: 'Vehicle, warranty, emissions and road-use suitability must be reviewed. No output gains promised.' },
  { id: 'exhaust-consultation', zone: 'performance', label: 'Exhaust consultation', detail: 'Discuss sound, installation and road-use requirements for your vehicle.' },
  { id: 'utility-consultation', zone: 'performance', label: 'Utility & carrying accessories', detail: 'Explore racks and practical accessories. Load limits require confirmation.' },
];
export type Build = { version: 1; vehicle: { make: string; model: string; year: string }; selections: string[]; lighting: 'blue' | 'red' | 'amber'; studio: 'midnight' | 'day' };
export const emptyBuild = (): Build => ({ version: 1, vehicle: { make: '', model: '', year: '' }, selections: [], lighting: 'blue', studio: 'midnight' });
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max) : '';
export function validateBuild(value: unknown): Build | null {
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1) return null;
  const raw = value as Partial<Build>, vehicle = raw.vehicle;
  if (!vehicle || typeof vehicle !== 'object' || !Array.isArray(raw.selections)) return null;
  let selections: string[] = [];
  for (const id of raw.selections.slice(0, 50)) {
    const option = upgrades.find(item => item.id === id);
    if (!option || selections.includes(option.id)) continue;
    if (option.group) selections = selections.filter(key => upgrades.find(item => item.id === key)?.group !== option.group);
    selections.push(option.id);
  }
  const year = clean(vehicle.year, 4);
  const selectedLight = selections.find(id => id.startsWith('light-'))?.slice(6);
  return { version: 1, vehicle: { make: clean(vehicle.make, 50), model: clean(vehicle.model, 70), year: /^(19|20)\d{2}$/.test(year) ? year : '' }, selections, lighting: selectedLight === 'red' || selectedLight === 'amber' ? selectedLight : raw.lighting === 'red' || raw.lighting === 'amber' ? raw.lighting : 'blue', studio: raw.studio === 'day' ? 'day' : 'midnight' };
}
export function toggleUpgrade(build: Build, id: string): Build {
  const option = upgrades.find(item => item.id === id);
  if (!option) return build;
  const exists = build.selections.includes(id);
  const selections = build.selections.filter(key => key !== id && (exists || !option.group || upgrades.find(item => item.id === key)?.group !== option.group));
  if (!exists) selections.push(id);
  return { ...build, selections, ...(!exists && option.group === 'ambient' ? { lighting: option.preview as Build['lighting'] } : {}) };
}
export function encodeBuild(build: Build): string {
  const bytes = new TextEncoder().encode(JSON.stringify(build));
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeBuild(value: string): Build | null {
  if (value.length > 4000 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try { const raw = atob(value.replace(/-/g, '+').replace(/_/g, '/')); return validateBuild(JSON.parse(new TextDecoder().decode(Uint8Array.from(raw, char => char.charCodeAt(0))))); } catch { return null; }
}
export const vehicleName = (build: Build) => [build.vehicle.make, build.vehicle.model, build.vehicle.year].filter(Boolean).join(' ') || 'Vehicle to be confirmed';
export function enquiryMessage(build: Build, details: { name?: string; goal?: string; budget?: string; visit?: boolean } = {}) {
  return [`Hi CARTUNEZ!${details.name ? ` I’m ${details.name.trim()}.` : ''}`, `My car: ${vehicleName(build)}.`, 'My build:', ...build.selections.map(id => `• ${upgrades.find(option => option.id === id)?.label}`), ...(build.selections.length ? [] : ['• Help me choose my upgrades.']), ...(details.goal?.trim() ? [`My goal: ${details.goal.trim()}`] : []), ...(details.budget ? [`Budget direction: ${details.budget}`] : []), ...(details.visit ? ['I’d like to discuss a workshop visit.'] : []), 'Please confirm fitment, availability and pricing. I’d like to request a quote.'].join('\n');
}
