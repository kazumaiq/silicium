// Blend demon mask radially to transparent edges with pure black fade
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

const inputPath = path.join(__dirname, '..', 'public', 'images', 'demon-mask.jpg');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'demon-mask-blended.png');

const jpegData = fs.readFileSync(inputPath);
const rawData = jpeg.decode(jpegData, { useTArray: true });

const width = rawData.width;
const height = rawData.height;
const png = new PNG({ width, height });

const centerX = width / 2;
const centerY = height / 2;
const maxRadius = Math.min(centerX, centerY);

// Inner radius where alpha is 100%, and outer radius where alpha reaches 0
const innerR = maxRadius * 0.35;
const outerR = maxRadius * 0.80;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    let r = rawData.data[idx];
    let g = rawData.data[idx + 1];
    let b = rawData.data[idx + 2];

    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let alpha = 255;
    if (dist >= outerR) {
      alpha = 0;
      r = 0; g = 0; b = 0;
    } else if (dist > innerR) {
      const factor = (dist - innerR) / (outerR - innerR);
      // Smooth cosine fade
      const fade = Math.cos(factor * Math.PI * 0.5);
      alpha = Math.round(fade * 255);
      // Also fade RGB towards pure black at outer boundary
      r = Math.round(r * fade);
      g = Math.round(g * fade);
      b = Math.round(b * fade);
    }

    // Cut off near-black noise
    const lum = Math.max(r, g, b);
    if (lum < 10) {
      alpha = 0;
      r = 0; g = 0; b = 0;
    }

    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = alpha;
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, buffer);
console.log(`✓ Radially circular blended mask created: ${outputPath} (${width}x${height})`);
