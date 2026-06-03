#!/usr/bin/env node
/**
 * Fix duplicate tool IDs in tools.json
 * Assigns new unique IDs to duplicates
 */

const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');

function main() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  const seenIds = new Set();
  let fixed = 0;

  // Find max ID
  const maxId = Math.max(...tools.map(t => t.id));

  let nextId = maxId + 1;

  tools.forEach(tool => {
    if (seenIds.has(tool.id)) {
      const oldId = tool.id;
      tool.id = nextId++;
      fixed++;
      console.log(`Fixed: ${tool.name} ID ${oldId} -> ${tool.id}`);
    }
    seenIds.add(tool.id);
  });

  if (fixed > 0) {
    fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2), 'utf-8');
    console.log(`\nFixed ${fixed} duplicate IDs. New max ID: ${nextId - 1}`);
  } else {
    console.log('No duplicate IDs found.');
  }
}

main();
