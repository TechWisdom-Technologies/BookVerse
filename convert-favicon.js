const fs = require('fs');
const path = require('path');

// Try using sharp if available
try {
  const sharp = require('sharp');
  
  const publicDir = path.join(__dirname, 'public');
  const inputImage = path.join(publicDir, 'bookverse.png');
  
  // Create favicon.ico (convert to 256x256 PNG first, then browsers can use as .ico)
  sharp(inputImage)
    .resize(256, 256, { fit: 'contain', background: { r: 255, g: 165, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'favicon.ico'))
    .then(() => console.log('Created favicon.ico'))
    .catch(err => console.error('Error creating favicon.ico:', err));

  // Create apple-touch-icon
  sharp(inputImage)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 165, b: 0, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
    .then(() => console.log('Created apple-touch-icon.png'))
    .catch(err => console.error('Error creating apple-touch-icon:', err));

  // Create favicon-16x16
  sharp(inputImage)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'))
    .then(() => console.log('Created favicon-16x16.png'))
    .catch(err => console.error('Error creating favicon-16x16:', err));

  // Create favicon-32x32
  sharp(inputImage)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'))
    .then(() => console.log('Created favicon-32x32.png'))
    .catch(err => console.error('Error creating favicon-32x32:', err));

} catch (err) {
  console.log('sharp not available, skipping conversion');
}
