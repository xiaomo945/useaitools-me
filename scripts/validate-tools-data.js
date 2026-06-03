#!/usr/bin/env node
/**
 * Validate tools.json data integrity
 * Checks required fields, URL formats, and data consistency
 */

const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const REPORT_PATH = path.join(__dirname, '..', '.tmp', 'tool-quality-report.md');

const REQUIRED_FIELDS = ['id', 'name', 'description', 'category', 'url', 'pricing'];
const VALID_CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
const VALID_PRICING = ['Free', 'Freemium', 'Paid', 'Open Source'];

function main() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  const issues = [];
  const warnings = [];
  let fixed = 0;

  tools.forEach(tool => {
    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!tool[field] && tool[field] !== 0) {
        issues.push({ id: tool.id, name: tool.name || `ID:${tool.id}`, field, issue: `Missing required field: ${field}` });
      }
    });

    // Check category validity
    if (tool.category && !VALID_CATEGORIES.includes(tool.category)) {
      issues.push({ id: tool.id, name: tool.name, field: 'category', issue: `Invalid category: ${tool.category}` });
    }

    // Check pricing validity
    if (tool.pricing && !VALID_PRICING.includes(tool.pricing)) {
      warnings.push({ id: tool.id, name: tool.name, field: 'pricing', issue: `Unusual pricing value: ${tool.pricing}` });
    }

    // Check URL format
    if (tool.url && !tool.url.startsWith('http://') && !tool.url.startsWith('https://')) {
      issues.push({ id: tool.id, name: tool.name, field: 'url', issue: `Invalid URL format: ${tool.url}` });
    }

    // Check duplicate IDs
    const duplicates = tools.filter(t => t.id === tool.id);
    if (duplicates.length > 1) {
      issues.push({ id: tool.id, name: tool.name, field: 'id', issue: `Duplicate ID: ${tool.id}` });
    }

    // Check rating range
    if (tool.rating && (tool.rating < 0 || tool.rating > 5)) {
      warnings.push({ id: tool.id, name: tool.name, field: 'rating', issue: `Rating out of range: ${tool.rating}` });
    }
  });

  // Generate report
  let report = `# Tool Data Quality Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `| Metric | Count |\n|:---|:---|\n`;
  report += `| Total Tools | ${tools.length} |\n`;
  report += `| Critical Issues | ${issues.length} |\n`;
  report += `| Warnings | ${warnings.length} |\n`;
  report += `| Auto-fixed | ${fixed} |\n\n`;

  if (issues.length > 0) {
    report += `## Critical Issues\n\n`;
    issues.forEach(i => {
      report += `- **${i.name}** (ID: ${i.id}): ${i.issue}\n`;
    });
    report += `\n`;
  }

  if (warnings.length > 0) {
    report += `## Warnings\n\n`;
    warnings.forEach(w => {
      report += `- **${w.name}** (ID: ${w.id}): ${w.issue}\n`;
    });
    report += `\n`;
  }

  if (issues.length === 0 && warnings.length === 0) {
    report += `✅ All tool data looks good!\n`;
  }

  const tmpDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`Report saved to ${REPORT_PATH}`);
  console.log(`${issues.length} issues, ${warnings.length} warnings`);
}

main();
