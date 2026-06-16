#!/usr/bin/env node

/**
 * Affiliate Link Checker
 *
 * Reads /workspace/data/tools.json, scans all tools for affiliate_link fields,
 * classifies them as placeholder / real URL / empty, and outputs a markdown
 * report to /workspace/.tmp/affiliate-link-report.md.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_PATH = path.join(__dirname, "..", "data", "tools.json");
const OUTPUT_DIR = path.join(__dirname, "..", ".tmp");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "affiliate-link-report.md");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PLACEHOLDER_RE = /\{\{AFFILIATE_[A-Z0-9_]+\}\}/;
const URL_RE = /^https?:\/\//i;

function classifyLink(value) {
  if (!value || value.trim() === "") return "empty";
  if (PLACEHOLDER_RE.test(value)) return "placeholder";
  if (URL_RE.test(value)) return "configured";
  return "unknown";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read tools data
  if (!fs.existsSync(TOOLS_PATH)) {
    console.error(`ERROR: tools.json not found at ${TOOLS_PATH}`);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, "utf-8"));

  // Classify every tool
  const results = tools.map((tool) => {
    const status = classifyLink(tool.affiliate_link);
    return {
      id: tool.id,
      name: tool.name,
      category: tool.category,
      affiliate_link: tool.affiliate_link || "",
      status,
    };
  });

  // Counts
  const total = results.length;
  const configured = results.filter((r) => r.status === "configured").length;
  const placeholders = results.filter((r) => r.status === "placeholder").length;
  const empty = results.filter((r) => r.status === "empty").length;
  const unknown = results.filter((r) => r.status === "unknown").length;
  const unconfigured = placeholders + empty + unknown;

  // Per-category breakdown
  const categories = {};
  for (const r of results) {
    if (!categories[r.category]) {
      categories[r.category] = { total: 0, configured: 0, empty: 0, placeholder: 0, unknown: 0 };
    }
    categories[r.category].total++;
    categories[r.category][r.status]++;
  }

  // Build report
  const now = new Date().toISOString().split("T")[0];
  const lines = [];

  lines.push(`# Affiliate Link Report`);
  lines.push(``);
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Data source:** \`data/tools.json\``);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Metric | Count | Percentage |`);
  lines.push(`|:---|---:|---:|`);
  lines.push(`| Total tools | ${total} | 100% |`);
  lines.push(`| Configured (real URL) | ${configured} | ${total ? ((configured / total) * 100).toFixed(1) : 0}% |`);
  lines.push(`| Placeholder (\`{{AFFILIATE_XXX}}\`) | ${placeholders} | ${total ? ((placeholders / total) * 100).toFixed(1) : 0}% |`);
  lines.push(`| Empty | ${empty} | ${total ? ((empty / total) * 100).toFixed(1) : 0}% |`);
  lines.push(`| Unknown format | ${unknown} | ${total ? ((unknown / total) * 100).toFixed(1) : 0}% |`);
  lines.push(`| **Unconfigured total** | **${unconfigured}** | **${total ? ((unconfigured / total) * 100).toFixed(1) : 0}%** |`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Breakdown by Category`);
  lines.push(``);
  lines.push(`| Category | Total | Configured | Placeholder | Empty | Unknown | Configured % |`);
  lines.push(`|:---|---:|---:|---:|---:|---:|---:|`);

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1].configured - a[1].configured);
  for (const [cat, data] of sortedCategories) {
    const pct = data.total ? ((data.configured / data.total) * 100).toFixed(1) : "0.0";
    lines.push(`| ${cat} | ${data.total} | ${data.configured} | ${data.placeholder} | ${data.empty} | ${data.unknown} | ${pct}% |`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Configured tools detail
  const configuredTools = results.filter((r) => r.status === "configured");
  if (configuredTools.length > 0) {
    lines.push(`## Configured Affiliate Links`);
    lines.push(``);
    lines.push(`| ID | Tool | Category | Affiliate Link |`);
    lines.push(`|:---|:---|:---|:---|`);
    for (const t of configuredTools) {
      const link = t.affiliate_link.length > 80 ? t.affiliate_link.slice(0, 77) + "..." : t.affiliate_link;
      lines.push(`| ${t.id} | ${t.name} | ${t.category} | \`${link}\` |`);
    }
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  // Placeholder tools detail
  const placeholderTools = results.filter((r) => r.status === "placeholder");
  if (placeholderTools.length > 0) {
    lines.push(`## Placeholder Affiliate Links`);
    lines.push(``);
    lines.push(`| ID | Tool | Category | Placeholder |`);
    lines.push(`|:---|:---|:---|:---|`);
    for (const t of placeholderTools) {
      lines.push(`| ${t.id} | ${t.name} | ${t.category} | \`${t.affiliate_link}\` |`);
    }
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  // Top priority unconfigured tools (by category relevance for affiliate revenue)
  const priorityCategories = ["Writing", "Video", "Productivity", "Code", "Image", "Audio"];
  const unconfiguredTools = results
    .filter((r) => r.status !== "configured")
    .sort((a, b) => {
      const ai = priorityCategories.indexOf(a.category);
      const bi = priorityCategories.indexOf(b.category);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  lines.push(`## Unconfigured Tools (Priority Order)`);
  lines.push(``);
  lines.push(`Tools sorted by affiliate revenue potential (Writing > Video > Productivity > Code > Image > Audio).`);
  lines.push(``);
  lines.push(`| ID | Tool | Category | Current Value |`);
  lines.push(`|:---|:---|:---|:---|`);
  for (const t of unconfiguredTools.slice(0, 50)) {
    const val = t.affiliate_link || "(empty)";
    lines.push(`| ${t.id} | ${t.name} | ${t.category} | ${val} |`);
  }
  if (unconfiguredTools.length > 50) {
    lines.push(``);
    lines.push(`> ... and ${unconfiguredTools.length - 50} more unconfigured tools.`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Recommendations`);
  lines.push(``);
  lines.push(`1. **Priority 1 — Apply for affiliate programs** for tools in the Writing, Video, and Productivity categories (highest conversion potential).`);
  lines.push(`2. **Priority 2 — Replace placeholders** with real affiliate links once approved.`);
  lines.push(`3. **Priority 3 — Add affiliate links** to all empty fields for tools that have affiliate programs.`);
  lines.push(`4. **Run this script weekly** to track progress on affiliate link coverage.`);
  lines.push(``);

  // Write report
  fs.writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf-8");
  console.log(`\n✅ Report written to ${OUTPUT_PATH}`);
  console.log(`\nSummary:`);
  console.log(`  Total tools:      ${total}`);
  console.log(`  Configured:       ${configured} (${total ? ((configured / total) * 100).toFixed(1) : 0}%)`);
  console.log(`  Placeholders:     ${placeholders}`);
  console.log(`  Empty:            ${empty}`);
  console.log(`  Unknown:          ${unknown}`);
  console.log(`  Unconfigured:     ${unconfigured} (${total ? ((unconfigured / total) * 100).toFixed(1) : 0}%)\n`);
}

main();
