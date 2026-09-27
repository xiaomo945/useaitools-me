#!/usr/bin/env node
/**
 * Full-corpus content audit.
 *
 * scripts/check-content-quality.js spot-checks 20 random posts against a
 * 200-character floor, which is too shallow to catch the problems that
 * actually hurt the site. This one scans every post and every tool and
 * checks the things that break rendering or mislead a reader:
 *
 *   1. thin posts, measured in words
 *   2. titles promising "N Best Tools" that list fewer than N
 *   3. bold markers left unclosed on a line (renders as a runaway emphasis)
 *   4. [[link: ... ]] tokens that are unbalanced or use the unsupported
 *      [[id:NNN|Name]] form
 *   5. Chinese text left in tool descriptions on an English site
 *
 * Run: node scripts/check-content-audit.mjs
 */
import fs from 'fs';
import path from 'path';

const root = path.join(import.meta.dirname, '..');
const blogDir = path.join(root, 'data', 'blog-posts');

// Headings that introduce prose rather than a tool entry.
const NOT_A_TOOL =
  /^(why|how|what|when|faq|comparison|our|verdict|final|related|conclusion|tips?|getting|choosing|a |the |bottom|ready|quick|pro |bonus|summary|overview|introduction)/i;

const CJK = /[\u4e00-\u9fff]/;
const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;

const posts = [];
for (const f of fs.readdirSync(blogDir).filter((x) => x.endsWith('.json'))) {
  try {
    posts.push({ file: f, ...JSON.parse(fs.readFileSync(path.join(blogDir, f), 'utf8')) });
  } catch (e) {
    posts.push({ file: f, __broken: true });
  }
}

const thin = [];
const mismatch = [];
const boldIssues = [];
const linkIssues = [];
const idIssues = [];

for (const p of posts) {
  if (p.__broken) continue;
  const c = String(p.content || '');
  const wc = words(c);

  if (wc < 300) thin.push({ slug: p.slug, wc });

  const promised = (String(p.title || '').match(/^(\d{1,2})\s+(?:Best|Top|Free)/i) || [])[1];
  if (promised) {
    const heads = (c.match(/^##\s+(.+)$/gm) || []).map((h) => h.replace(/^##\s+/, '').trim());
    const entries = heads.filter((h) => !NOT_A_TOOL.test(h)).length;
    if (entries < parseInt(promised, 10)) {
      mismatch.push({ slug: p.slug, promised: parseInt(promised, 10), entries, wc });
    }
  }

  // An odd number of '**' on one line means the emphasis never closes and
  // Markdown pairs it with the next line's marker instead.
  const bold = c
    .split('\n')
    .map((ln, i) => ({ ln, i: i + 1 }))
    .filter((x) => (x.ln.match(/\*\*/g) || []).length % 2 !== 0);
  if (bold.length) boldIssues.push({ slug: p.slug, count: bold.length, first: bold[0].i });

  const open = (c.match(/\[\[link:/g) || []).length;
  const close = (c.match(/\]\]/g) || []).length;
  if (open !== close) linkIssues.push({ slug: p.slug, open, close });
  if ((c.match(/\[\[id:/g) || []).length) idIssues.push({ slug: p.slug });
}

const tools = JSON.parse(fs.readFileSync(path.join(root, 'data', 'tools.json'), 'utf8'));
// The page renders description_en first and only falls back to description.
const effective = tools.map((t) => String(t.description_en || t.description || ''));
const shortMeta = tools.filter((_, i) => effective[i].length < 60).length;
const cjkTools = tools.filter(
  (t) => CJK.test(t.description) || CJK.test(t.description_en) || CJK.test(t.name),
).length;

const line = (s) => console.log(s);
line('=== BLOG (' + posts.length + ' posts) ===');
line('  thin (<300 words)          : ' + thin.length);
line('  thin (<600 words)          : ' + posts.filter((p) => !p.__broken && words(p.content) < 600).length);
line('  title promises more than it delivers : ' + mismatch.length);
line('  unclosed ** on a line      : ' + boldIssues.length);
line('  [[link: / ]] unbalanced    : ' + linkIssues.length);
line('  unsupported [[id:NNN|]]    : ' + idIssues.length);
line('');
line('=== TOOLS (' + tools.length + ') ===');
line('  effective description <60 chars : ' + shortMeta);
line('  Chinese left in name/description: ' + cjkTools);
line('');

const show = (label, rows, fmt) => {
  if (!rows.length) return;
  line('--- ' + label + ' ---');
  rows.forEach((r) => line('  ' + fmt(r)));
  line('');
};
show(
  'thinnest posts',
  thin.sort((a, b) => a.wc - b.wc).slice(0, 8),
  (r) => String(r.wc).padStart(4) + ' words  ' + r.slug,
);
show(
  'title/content mismatch',
  mismatch.sort((a, b) => b.promised - b.entries - (a.promised - a.entries)),
  (r) => 'promises ' + r.promised + ', lists ' + r.entries + '  ' + r.slug,
);
show('bold issues', boldIssues, (r) => r.count + ' line(s), first at L' + r.first + '  ' + r.slug);
show('link issues', linkIssues, (r) => '[[' + r.open + ' vs ]]' + r.close + '  ' + r.slug);
show('unsupported id links', idIssues, (r) => r.slug);

const total = mismatch.length + boldIssues.length + linkIssues.length + idIssues.length + shortMeta + cjkTools;
line(total === 0 ? 'No blocking issues found.' : 'Total flagged: ' + total);
