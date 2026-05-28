const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// Update all Grammarly-related entries
let updatedCount = 0;
const updatedTools = tools.map(tool => {
  if (tool.name && tool.name.toLowerCase().includes('grammarly')) {
    updatedCount++;
    return {
      ...tool,
      affiliate_link: "{{AFFILIATE_GRAMMARLY}}"
    };
  }
  return tool;
});

// Write back
fs.writeFileSync(toolsPath, JSON.stringify(updatedTools, null, 2), 'utf8');

console.log(`✅ Updated ${updatedCount} Grammarly-related tools with {{AFFILIATE_GRAMMARLY}}`);
