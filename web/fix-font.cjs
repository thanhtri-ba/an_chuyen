const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/features/seat-selection/pages/SeatSelectionPage.tsx');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/fontFamily:\s*["']'Instrument Serif',(?:sans-)?serif["']/g, "fontFamily:'system-ui'");
fs.writeFileSync(p, content);
console.log('Fixed fonts!');
