// Run this script to generate icon PNGs (requires canvas package)
// Or manually create icon16.png, icon32.png, icon48.png, icon128.png
// For now, use any 128x128 PNG with the JobVest brand gradient

// Quick placeholder: create SVG data URL icons
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sizes = [16, 32, 48, 128];

const makeSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff8c42"/>
      <stop offset="100%" stop-color="#ff6b35"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#g)"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${size * 0.5}" font-weight="700" font-family="serif">J</text>
</svg>`;

sizes.forEach((size) => {
  const svg = makeSvg(size);
  writeFileSync(join(__dirname, "..", "public", "icons", `icon${size}.svg`), svg);
  console.log(`Created icon${size}.svg`);
});

console.log("\nNote: Chrome extensions need PNG icons. Convert these SVGs to PNG,");
console.log("or replace them with proper PNG files.");
