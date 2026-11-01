// Remove black background from logo-red.png
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '..', 'public', 'images', 'logo-red.png');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'logo-red-transparent.png');

const data = fs.readFileSync(inputPath);
const png = PNG.sync.read(data);

const THRESHOLD = 30; // pixels darker than this become transparent

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    
    const maxChannel = Math.max(r, g, b);
    
    if (maxChannel < THRESHOLD) {
      // Pure black / very dark → fully transparent
      png.data[idx + 3] = 0;
    } else if (maxChannel < THRESHOLD + 30) {
      // Near-black → partial transparency for smooth edges
      const alpha = Math.round(((maxChannel - THRESHOLD) / 30) * 255);
      png.data[idx + 3] = Math.min(png.data[idx + 3], alpha);
    }
    // else: keep original alpha
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, buffer);

console.log(`✓ Transparent logo written to: ${outputPath}`);
console.log(`  Original size: ${data.length} bytes`);
console.log(`  New size: ${buffer.length} bytes`);
console.log(`  Dimensions: ${png.width}x${png.height}`);
