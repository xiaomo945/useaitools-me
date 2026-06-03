#!/usr/bin/env node
/**
 * Check affiliate links in data/tools.json
 * Scans all tools with affiliate_link fields and validates them
 */

const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const REPORT_PATH = path.join(__dirname, '..', '.tmp', 'affiliate-link-report.md');

function main() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));

  let totalWithAffiliate = 0;
  let validLinks = 0;
  let placeholderLinks = 0;
  let emptyLinks = 0;
  const details = [];

  tools.forEach(tool => {
    if (tool.affiliate_link) {
      totalWithAffiliate++;

      if (tool.affiliate_link.includes('{{') || tool.affiliate_link.includes('AFFILIATE_')) {
        placeholderLinks++;
        details.push({
          id: tool.id,
          name: tool.name,
          status: 'PLACEHOLDER',
          link: tool.affiliate_link
        });
      } else if (tool.affiliate_link.startsWith('http://') || tool.affiliate_link.startsWith('https://')) {
        validLinks++;
        details.push({
          id: tool.id,
          name: tool.name,
          status: 'VALID',
          link: tool.affiliate_link
        });
      } else {
        emptyLinks++;
        details.push({
          id: tool.id,
          name: tool.name,
          status: 'INVALID_FORMAT',
          link: tool.affiliate_link
        });
      }
    }
  });

  // Generate report
  let report = `# Affiliate Link Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `| Metric | Count |\n|:---|:---|\n`;
  report += `| Total Tools | ${tools.length} |\n`;
  report += `| Tools with Affiliate Link | ${totalWithAffiliate} |\n`;
  report += `| Valid Links | ${validLinks} |\n`;
  report += `| Placeholder Links | ${placeholderLinks} |\n`;
  report += `| Invalid Format Links | ${emptyLinks} |\n`;
  report += `| Tools without Affiliate | ${tools.length - totalWithAffiliate} |\n\n`;

  if (placeholderLinks > 0) {
    report += `## Placeholder Links (Need Configuration)\n\n`;
    details.filter(d => d.status === 'PLACEHOLDER').forEach(d => {
      report += `- **${d.name}** (ID: ${d.id}): \`${d.link}\`\n`;
    });
    report += `\n`;
  }

  if (emptyLinks > 0) {
    report += `## Invalid Format Links\n\n`;
    details.filter(d => d.status === 'INVALID_FORMAT').forEach(d => {
      report += `- **${d.name}** (ID: ${d.id}): \`${d.link}\`\n`;
    });
    report += `\n`;
  }

  report += `## Valid Links\n\n`;
  details.filter(d => d.status === 'VALID').forEach(d => {
    report += `- **${d.name}** (ID: ${d.id})\n`;
  });

  // Ensure .tmp directory exists
  const tmpDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`Report saved to ${REPORT_PATH}`);
  console.log(`\nSummary: ${validLinks} valid, ${placeholderLinks} placeholder, ${emptyLinks} invalid out of ${totalWithAffiliate} affiliate links`);
}

main();
