import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

// Source PNGs stay in assets/. Only the responsive, compressed derivatives ship.
const source = resolve('assets/source/campaign-v8');
const target = resolve('public/images/campaign');
await mkdir(target, { recursive: true });
const manifest = {};
for (const file of (await readdir(source)).filter(name => name.endsWith('.png')).sort()) {
  const name = basename(file, '.png');
  const input = resolve(source, file);
  const info = await sharp(input).metadata();
  const widths = name === 'hero-mobile' || name === 'stitch' ? [480, 768, 1024] : [640, 960, 1440];
  const variants = [];
  for (const width of widths.filter(width => width <= info.width)) {
    const base = `${name}-${width}`;
    const [avif, webp] = await Promise.all([
      sharp(input).resize({ width }).avif({ quality: name === 'hero' ? 63 : 59, effort: 6 }).toFile(resolve(target, `${base}.avif`)),
      sharp(input).resize({ width }).webp({ quality: name === 'hero' ? 85 : 82, effort: 5 }).toFile(resolve(target, `${base}.webp`)),
    ]);
    variants.push({ width: avif.width, height: avif.height, avif: `/images/campaign/${base}.avif`, webp: `/images/campaign/${base}.webp`, avifBytes: avif.size, webpBytes: webp.size });
  }
  manifest[name] = { width: info.width, height: info.height, variants };
  console.log(`${name}: ${variants.map(item => `${item.width}w ${Math.round(item.avifBytes / 1024)}KB AVIF`).join(' / ')}`);
}
await writeFile(resolve('src/lib/campaign-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
// Keep social media independent of the WebGL reference poster.
if (manifest.hero) await sharp(resolve(source, 'hero.png')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 87 }).toFile(resolve(target, 'og-v8.jpg'));
