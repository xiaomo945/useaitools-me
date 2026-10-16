#!/usr/bin/env node
/**
 * scan-cjk.mjs — find CJK text that actually renders for users.
 *
 * The site targets an overseas English audience, so public-facing copy must be
 * English. This script reports the Chinese strings that would really show up in
 * the rendered HTML, and ignores the ones that never reach the user:
 *   - line / block / JSX comments
 *   - console.* diagnostics
 *
 * Deliberately NOT flagged (these are correct and must stay):
 *   - regexes that match user input, e.g. /chinese|中文/i
 *   - language endonyms in a picker, e.g. 中文 / 日本語
 *   - the description_zh / best_for_zh fields kept in data/tools.json for the
 *     future bilingual toggle
 *
 * Usage:
 *   node scripts/scan-cjk.mjs            # full report, worst files first
 *   node scripts/scan-cjk.mjs --list     # just "count  path", sorted
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['app', 'lib'];
const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;

// admin/ and api/ are not user-facing marketing surfaces.
const EXCLUDE = [/(\\|\/)admin(\\|\/)/, /(\\|\/)api(\\|\/)/, /(\\|\/)node_modules(\\|\/)/];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      walk(p, out);
    } else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

/**
 * Strip comments with a real state machine so that multi-line JSDoc / block
 * comment interiors are not reported as user-facing copy.
 */
function makeCommentStripper() {
  let inBlock = false;
  return (line) => {
    let s = '';
    let i = 0;
    while (i < line.length) {
      if (inBlock) {
        const end = line.indexOf('*/', i);
        if (end === -1) return ''; // whole line is inside a block comment
        i = end + 2;
        inBlock = false;
        continue;
      }
      const two = line.slice(i, i + 2);
      if (two === '/*') { inBlock = true; i += 2; continue; }
      if (two === '//' && line[i - 1] !== ':') break; // rest of line is a comment
      s += line[i];
      i += 1;
    }
    return s;
  };
}

const files = ROOTS.flatMap(r => walk(path.resolve(r))).filter(p => {
  const norm = p + path.sep;
  return !EXCLUDE.some(re => re.test(norm));
});

const results = [];
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  const stripComments = makeCommentStripper();
  const hits = [];
  lines.forEach((raw, i) => {
    const stripped = stripComments(raw);
    if (!CJK.test(stripped)) return;
    if (/console\.(log|warn|error|info|debug)\s*\(/.test(stripped)) return;
    hits.push({ n: i + 1, text: raw.trim().slice(0, 160) });
  });
  if (hits.length) {
    results.push({ file: path.relative(process.cwd(), f).replace(/\\/g, '/'), hits });
  }
}

results.sort((a, b) => b.hits.length - a.hits.length);
const total = results.reduce((s, r) => s + r.hits.length, 0);

console.log(`Scanned ${files.length} files under ${ROOTS.join(', ')}.`);
console.log(`Rendered CJK lines (comments + console excluded): ${total}\n`);

if (process.argv.includes('--list')) {
  for (const r of results) console.log(`${String(r.hits.length).padStart(4)}  ${r.file}`);
} else {
  for (const r of results) {
    console.log(`### ${r.file}  (${r.hits.length})`);
    for (const h of r.hits) console.log(`   L${h.n}: ${h.text}`);
  }
}

// Non-zero exit makes this usable as a CI gate once the site is fully English.
process.exit(process.argv.includes('--strict') && total > 0 ? 1 : 0);
