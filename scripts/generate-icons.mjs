import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/icon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'icon-96x96.png',           size: 96  },
  { name: 'icon-192x192.png',         size: 192 },
  { name: 'icon-192x192-maskable.png', size: 192 },
  { name: 'icon-512x512.png',         size: 512 },
  { name: 'icon-512x512-maskable.png', size: 512 },
  { name: 'apple-icon.png',           size: 180 },
];

console.log('Generating PWA icons...');

for (const { name, size } of sizes) {
  const out = join(__dirname, '../public', name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`  ✓ ${name} (${size}x${size})`);
}

console.log('\nDone! All icons generated in /public/');
