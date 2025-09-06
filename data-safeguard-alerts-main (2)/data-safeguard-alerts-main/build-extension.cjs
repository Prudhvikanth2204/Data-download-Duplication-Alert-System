const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

console.log('Building extension...');

try {
  // Build the React app
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Copying extension files...');
  
  // Create a separate extension directory instead of a subdirectory of dist
  fs.ensureDirSync('extension-dist');
  
  // Copy the build output to the extension directory
  fs.copySync('dist', 'extension-dist');
  
  // Copy extension-specific files
  fs.copySync('public/manifest.json', 'extension-dist/manifest.json');
  fs.copySync('public/background.js', 'extension-dist/background.js');
  
  // Make sure the icons directory exists
  fs.ensureDirSync('extension-dist/icons');
  
  // Copy icons
  fs.copySync('public/icons', 'extension-dist/icons');
  
  console.log('Extension build complete! The extension is ready in extension-dist');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
