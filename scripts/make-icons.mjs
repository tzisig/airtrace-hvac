// Generates favicon and app icons from the theme colors in site.config.ts (same mark as the Logo component).
// Run: npm run icons
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const cfg = readFileSync(new URL('../src/config/site.config.ts', import.meta.url), 'utf8');
const pick = (key) => cfg.match(new RegExp('[^A-Za-z]' + key + ": *'(#[0-9A-Fa-f]{6})'"))[1];
const ink = pick('ink');
const lime = pick('lime');
const name = cfg.match(/name:\s*'([^']+)'/)[1];
const shortName = cfg.match(/shortName:\s*'([^']+)'/)[1];

// pad shrinks the mark for maskable/app icons that need a safe zone
const svg = (pad = 0) => {
  const s = (48 - pad * 2) / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="${pad ? 0 : 11}" fill="${ink}"/>
  <g transform="translate(${pad} ${pad}) scale(${s})">
    <path d="M14.1 33.9A14 14 0 1 1 33.9 33.9" fill="none" stroke="#56636A" stroke-width="4" stroke-linecap="round"/>
    <path d="M14.1 33.9A14 14 0 0 1 17 12.9" fill="none" stroke="${lime}" stroke-width="4" stroke-linecap="round"/>
    <path d="M17.5 25.5c2-2 4-2 6 0s4 2 6 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>`;
};

writeFileSync('public/favicon.svg', svg());
const out = [
  ['public/favicon-32.png', 32, 0],
  ['public/apple-touch-icon.png', 180, 5],
  ['public/icon-192.png', 192, 5],
  ['public/icon-512.png', 512, 5],
];
for (const [file, size, pad] of out) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(file);
}
writeFileSync('public/site.webmanifest', JSON.stringify({
  name, short_name: shortName, lang: 'he', dir: 'rtl', start_url: '/', display: 'standalone',
  background_color: ink, theme_color: ink,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2));
console.log('icons written');
