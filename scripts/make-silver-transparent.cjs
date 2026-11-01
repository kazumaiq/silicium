// Remove black background from logo-silver.png
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '..', 'public', 'images', 'logo-silver.png');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'logo-silver-transparent.png');

const data = fs.readFileSync(inputPath);
const png = PNG.sync.read(data);

const THRESHOLD = 30;

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    
    const maxChannel = Math.max(r, g, b);
    
    if (maxChannel < THRESHOLD) {
      png.data[idx + 3] = 0;
    } else if (maxChannel < THRESHOLD + 30) {
      const alpha = Math.round(((maxChannel - THRESHOLD) / 30) * 255);
      png.data[idx + 3] = Math.min(png.data[idx + 3], alpha);
    }
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, buffer);

console.log(`✓ Transparent silver logo written to: ${outputPath}`);
console.log(`  Dimensions: ${png.width}x${png.height}`);
