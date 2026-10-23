import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const dir = new URL('../public/images/', import.meta.url);
const hero = fileURLToPath(new URL('../assets/source/hero-source.png', import.meta.url));
const interior = fileURLToPath(new URL('../assets/source/interior-source.png', import.meta.url));
const output = name => fileURLToPath(new URL(name, dir));
await mkdir(dir, { recursive: true });
await Promise.all([
  sharp(hero).resize(1600).webp({ quality: 82 }).toFile(output('hero-1600.webp')),
  sharp(hero).resize(1000).webp({ quality: 80 }).toFile(output('hero-1000.webp')),
  sharp(hero).resize(900, 1200, { fit: 'cover', position: 'centre' }).webp({ quality: 80 }).toFile(output('hero-mobile.webp')),
  sharp(hero).extract({ left: 430, top: 330, width: 800, height: 690 }).resize(800, 800).webp({ quality: 80 }).toFile(output('hero-detail.webp')),
  sharp(hero).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 85 }).toFile(output('og.jpg')),
  sharp(interior).resize(1000).webp({ quality: 82 }).toFile(output('interior-1000.webp')),
  sharp(fileURLToPath(new URL('../assets/source/cartunez-logo-original.png', import.meta.url))).resize(450).webp({ quality: 88 }).toFile(output('cartunez-logo.webp')),
]);
console.log('Responsive WebP assets and Open Graph image prepared.');
