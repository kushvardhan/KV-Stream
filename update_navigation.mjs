import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file
const filePath = path.join(__dirname, 'src', 'components', 'templates', 'TopNav.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of window.location.href = detailPath
content = content.replace(/window\.location\.href\s*=\s*detailPath/g, 'window.location.assign(window.location.origin + detailPath)');

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('All navigation instances updated successfully!');
