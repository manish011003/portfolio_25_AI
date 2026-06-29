// Generates og-image.png (1200x630) used for social link previews.
// Run with: node scripts/make-og.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'og-image.png');
const AVATAR = path.join(__dirname, '..', 'char8bit', '9-removebg-preview.png');

const W = 1200;
const H = 630;

const bg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1020"/>
      <stop offset="55%" stop-color="#16172e"/>
      <stop offset="100%" stop-color="#20224a"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#2a2c55" stroke-width="1" opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- accent frame -->
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="#6c5ce7" stroke-width="4"/>

  <text x="80" y="150" font-family="Verdana, sans-serif" font-size="26" fill="#8a8fc7" letter-spacing="4">&gt; PRESS START</text>

  <text x="78" y="270" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="92" fill="#eef1ff">Manish Biswas</text>

  <text x="80" y="345" font-family="Verdana, sans-serif" font-size="40" fill="#a78bfa">AI Engineer  ×  Product Manager</text>

  <text x="80" y="430" font-family="Verdana, sans-serif" font-size="28" fill="#c7cbe6">I build LLM agents, CV tools &amp; full-stack apps.</text>

  <!-- skill chips -->
  <g font-family="Verdana, sans-serif" font-size="22" fill="#cbd2ff">
    <rect x="80" y="478" width="150" height="48" rx="6" fill="#23254d" stroke="#3a3d75"/>
    <text x="100" y="509">Python</text>
    <rect x="246" y="478" width="150" height="48" rx="6" fill="#23254d" stroke="#3a3d75"/>
    <text x="266" y="509">FastAPI</text>
    <rect x="412" y="478" width="120" height="48" rx="6" fill="#23254d" stroke="#3a3d75"/>
    <text x="432" y="509">React</text>
    <rect x="548" y="478" width="120" height="48" rx="6" fill="#23254d" stroke="#3a3d75"/>
    <text x="568" y="509">LLMs</text>
  </g>

  <text x="80" y="585" font-family="Verdana, sans-serif" font-size="24" fill="#7e84bb">aimanishbportfolio.onrender.com</text>
</svg>`;

(async () => {
  const base = sharp(Buffer.from(bg)).png();

  let composites = [];
  if (fs.existsSync(AVATAR)) {
    const avatar = await sharp(AVATAR)
      .resize({ height: 380, fit: 'inside' })
      .toBuffer();
    const meta = await sharp(avatar).metadata();
    composites.push({
      input: avatar,
      top: Math.round((H - (meta.height || 380)) / 2),
      left: W - (meta.width || 320) - 90
    });
  }

  await base.composite(composites).toFile(OUT);
  console.log('Wrote', OUT);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
