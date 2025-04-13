const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src', 'components', 'templates', 'TopNav.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of window.location.href = detailPath
content = content.replace(/window\.location\.href\s*=\s*detailPath/g, 'window.location.assign(window.location.origin + detailPath)');

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('All navigation instances updated successfully!');
