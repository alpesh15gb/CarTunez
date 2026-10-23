import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// Original procedural music, created for this interface demo. No third-party recordings.
const rate = 22050, duration = 24;
await mkdir('public/audio', { recursive: true });
for (const [index, name] of ['midnight-drive', 'after-hours', 'open-road'].entries()) {
  const pcm = Buffer.alloc(rate * duration * 2);
  let random = 1703 + index;
  const noise = () => { random = (random * 1664525 + 1013904223) >>> 0; return random / 4294967296 * 2 - 1; };
  const bpm = [100, 80, 120][index], beat = 60 / bpm;
  const roots = [[55, 65.406, 49, 73.416], [65.406, 58.27, 49, 55], [73.416, 55, 65.406, 49]][index];
  for (let i = 0; i < rate * duration; i++) {
    const t = i / rate, step = t % beat, bar = Math.floor(t / (beat * 4)), root = roots[bar % 4];
    const kick = Math.sin(2 * Math.PI * (48 * step + 6 * (1 - Math.exp(-step * 30)))) * Math.exp(-step * 17) * .36;
    const hatTime = t % (beat / 2), hat = noise() * Math.exp(-hatTime * 150) * .035;
    const snareTime = t % (beat * 2) - beat;
    const snare = snareTime >= 0 ? noise() * Math.exp(-snareTime * 35) * .1 : 0;
    const bass = (Math.sin(2 * Math.PI * root * t) + .2 * Math.sin(4 * Math.PI * root * t)) * .13 * (.7 + .3 * Math.exp(-step * 7));
    const notes = [1, 1.5, 2, 2.5, 3, 2, 1.5, 1];
    const phase = t % (beat / 2), pitch = root * 4 * notes[Math.floor(t / (beat / 2)) % notes.length];
    const melody = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-phase * 8) * .065;
    const pad = [1, 1.1892, 1.4983].reduce((sum, ratio) => sum + Math.sin(2 * Math.PI * root * 2 * ratio * t), 0) * .027;
    const fade = Math.min(1, t / .3, (duration - t) / .7);
    pcm.writeInt16LE(Math.round(Math.tanh((kick + hat + snare + bass + melody + pad) * 1.3) * fade * 24500), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  const wav = `public/audio/${name}.wav`;
  await writeFile(wav, Buffer.concat([header, pcm]));
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '80k', `public/audio/${name}.mp3`]);
  await unlink(wav);
}
console.log('Created three original, user-initiated 24-second music previews.');
