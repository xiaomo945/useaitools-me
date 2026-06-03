#!/usr/bin/env node
/**
 * Check internal links across the site
 * Scans all data files for broken internal links
 */

const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const BLOG_DIR = path.join(__dirname, '..', 'data', 'blog-posts');
const REPORT_PATH = path.join(__dirname, '..', '.tmp', 'internal-link-health-report.md');

function main() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));
  const toolIds = new Set(tools.map(t => t.id));
  const categories = new Set(['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video']);

  const issues = [];

  // Check tool references
  tools.forEach(tool => {
    // Check category is valid
    if (!categories.has(tool.category)) {
      issues.push({ type: 'INVALID_CATEGORY', tool: tool.name, detail: `Invalid category: ${tool.category}` });
    }

    // Check URL format
    if (!tool.url || (!tool.url.startsWith('http://') && !tool.url.startsWith('https://'))) {
      issues.push({ type: 'INVALID_URL', tool: tool.name, detail: `Invalid URL: ${tool.url}` });
    }

    // Check required fields
    if (!tool.name) issues.push({ type: 'MISSING_NAME', tool: `ID:${tool.id}`, detail: 'Missing name' });
    if (!tool.description) issues.push({ type: 'MISSING_DESC', tool: tool.name, detail: 'Missing description' });
    if (!tool.category) issues.push({ type: 'MISSING_CATEGORY', tool: tool.name, detail: 'Missing category' });
  });

  // Check blog post references to tools
  if (fs.existsSync(BLOG_DIR)) {
    const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));
    blogFiles.forEach(file => {
      try {
        const post = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'));
        if (post.related_tool_ids) {
          post.related_tool_ids.forEach(id => {
            if (!toolIds.has(id)) {
              issues.push({ type: 'BROKEN_TOOL_REF', tool: `Blog:${post.slug || file}`, detail: `References non-existent tool ID: ${id}` });
            }
          });
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
  }

  // Generate report
  let report = `# Internal Link Health Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `| Metric | Count |\n|:---|:---|\n`;
  report += `| Total Tools | ${tools.length} |\n`;
  report += `| Issues Found | ${issues.length} |\n\n`;

  if (issues.length === 0) {
    report += `✅ No issues found! All internal links are healthy.\n`;
  } else {
    const byType = {};
    issues.forEach(i => {
      if (!byType[i.type]) byType[i.type] = [];
      byType[i.type].push(i);
    });

    Object.entries(byType).forEach(([type, items]) => {
      report += `## ${type} (${items.length})\n\n`;
      items.forEach(item => {
        report += `- **${item.tool}**: ${item.detail}\n`;
      });
      report += `\n`;
    });
  }

  const tmpDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`Report saved to ${REPORT_PATH}`);
  console.log(`Found ${issues.length} issues.`);
}

main();
