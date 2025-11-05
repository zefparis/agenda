/**
 * Script de génération d'icônes PWA placeholder
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Générer un SVG placeholder pour chaque taille
SIZES.forEach(size => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#gradient)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">B</text>
</svg>`.trim();

  const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
  
  // Note: Pour convertir SVG en PNG, on aurait besoin de sharp ou imagemagick
  // Pour l'instant, on sauvegarde en SVG et on donne les instructions
  const svgPath = path.join(ICONS_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  
  console.log(`✅ Créé: icon-${size}x${size}.svg`);
});

// Badge pour notifications
const badgeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
  <circle cx="36" cy="36" r="36" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">B</text>
</svg>`.trim();

fs.writeFileSync(path.join(ICONS_DIR, 'badge-72x72.svg'), badgeSvg);
console.log(`✅ Créé: badge-72x72.svg`);

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Icônes SVG générées dans public/icons/

⚠️  Pour convertir en PNG (requis pour PWA):

Option 1 - ImageMagick (recommandé):
  brew install imagemagick  # macOS
  sudo apt install imagemagick  # Linux
  
  cd public/icons
  for file in *.svg; do
    convert "\$file" "\${file%.svg}.png"
  done

Option 2 - Online:
  1. Aller sur https://realfavicongenerator.net/
  2. Upload votre logo
  3. Générer toutes les tailles
  4. Télécharger et extraire dans public/icons/

Option 3 - Sharp (Node.js):
  npm install sharp
  node scripts/convert-icons.js  # (créer ce script)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
