
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsPath = path.join(__dirname, 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

console.log(`Current tool count: ${tools.length}`);
console.log(`Need to add: ${Math.max(0, 690 - tools.length)} tools to reach 690+`);
