// Scroll is the camera clock: the same position always produces the same 3D shot.
// Tune angle (radians), radius (world units), height and turn independently.
const shots = [
  { at: 0, angle: .64, radius: 8.0, height: 1.65, target: .65, turn: -.08 },
  { at: .48, angle: 1.45, radius: 7.0, height: 1.12, target: .56, turn: .13 },
  { at: 1, angle: 2.35, radius: 7.7, height: 1.95, target: .68, turn: .30 },
] as const;

export function heroCamera(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const index = p <= shots[1].at ? 0 : 1;
  const a = shots[index], b = shots[index + 1];
  const t = (p - a.at) / (b.at - a.at);
  // Cubic Hermite tangents continue THROUGH each shot. No stop/restart at .48.
  const sample = (key: 'angle' | 'radius' | 'height' | 'target' | 'turn') => {
    const before = shots[Math.max(0, index - 1)], after = shots[Math.min(2, index + 2)];
    const m0 = (b[key] - before[key]) / (b.at - before.at);
    const m1 = (after[key] - a[key]) / (after.at - a.at);
    const span = b.at - a.at;
    return (2*t*t*t - 3*t*t + 1)*a[key] + (t*t*t - 2*t*t + t)*m0*span + (-2*t*t*t + 3*t*t)*b[key] + (t*t*t - t*t)*m1*span;
  };
  return { angle: sample('angle'), radius: sample('radius'), height: sample('height'), target: sample('target'), turn: sample('turn') };
}

const smooth = (a: number, b: number, value: number) => { const t = Math.max(0, Math.min(1, (value-a)/(b-a))); return t*t*(3-2*t); };
// Seconds after the FIRST visible frame; no scroll lock or blocking preloader.
export function heroIgnition(seconds: number) {
  return { headlights: smooth(.18, .72, seconds), garage: smooth(.35, 2.1, seconds), camera: smooth(0, 2.4, seconds), complete: seconds >= 2.4 };
}
