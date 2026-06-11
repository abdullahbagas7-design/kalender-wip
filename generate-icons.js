const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size, filename, color = '#3b82f6', isMaskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = color;
  if (isMaskable) {
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Simple calendar icon
  ctx.fillStyle = '#ffffff';
  
  // Calendar base
  const padding = size * 0.15;
  ctx.fillRect(padding, padding, size - padding * 2, size - padding * 2);
  
  // Calendar header
  ctx.fillStyle = color;
  ctx.fillRect(padding, padding, size - padding * 2, (size - padding * 2) * 0.25);
  
  // Date number
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.35}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12', size / 2, size / 2 + (size - padding * 2) * 0.1);
  
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'public', 'icons', filename);
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Generated ${filename} (${size}x${size})`);
}

console.log('Generating PWA placeholder icons...');

generateIcon(192, 'icon-192x192.png');
generateIcon(512, 'icon-512x512.png');
generateIcon(1024, 'icon-1024x1024.png');
generateIcon(512, 'maskable-icon-512x512.png', '#3b82f6', true);

console.log('✅ All icons generated successfully!');
