
const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

console.log(`Current tool count: ${tools.length}`);
console.log(`Need to add: ${Math.max(0, 690 - tools.length)} tools to reach 690+`);
