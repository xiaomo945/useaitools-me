#!/usr/bin/env node
/**
 * Add new blog posts from a markdown draft file.
 *
 * Usage:
 *   node scripts/add-posts.mjs drafts/my-posts.md          # dry run
 *   node scripts/add-posts.mjs drafts/my-posts.md --apply   # write
 *   node scripts/add-posts.mjs drafts/my-posts.md --date 2026-10-07
 *
 * Draft format (one block per post):
 *
 *   <<<POST
 *   title: My Title
 *   slug: my-title
 *   category: Productivity        # one of Writing/Image/Productivity/Code/Audio/Video
 *   description: One or two sentences used in meta description.
 *   # My Title
 *
 *   Body in markdown. Supported: ## headings, - bullets, 1. lists,
 *   | pipe | tables |, **bold**, and [[link:/tools/<id>|text]] internal links.
 *
 * Refuses to write a post that has unbalanced bold markers, unbalanced link
 * tokens, a duplicate slug, or a link to a tool id that does not exist.
 */
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'data', 'blog-posts');
const VALID_CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

const srcFile = process.argv[2];
const apply = process.argv.includes('--apply');
const dateArg = process.argv.indexOf('--date');
const today = dateArg !== -1 ? process.argv[dateArg + 1] : new Date().toISOString().slice(0, 10);

if (!srcFile) {
  console.error('用法: node scripts/add-posts.mjs <draft.md> [--apply] [--date YYYY-MM-DD]');
  process.exit(1);
}

const tools = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'tools.json'), 'utf8'));
const toolIds = new Set(tools.map((t) => t.id));

const existing = fs
  .readdirSync(dir)
  .filter((x) => x.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const maxId = Math.max(...existing.map((p) => p.id || 0));
const usedSlugs = new Set(existing.map((p) => p.slug));

const raw = fs.readFileSync(srcFile, 'utf8');
const blocks = raw.split(/^<<<POST\s*$/m).slice(1);

function buildFaq(content) {
  const m = content.match(/##\s*Frequently Asked Questions\s*([\s\S]*)$/i);
  if (!m) return null;
  const pairs = [];
  const re = /\*\*(.+?\?)\*\*\s*([\s\S]*?)(?=\n\*\*|\s*$)/g;
  let mm;
  while ((mm = re.exec(m[1])) !== null) {
    const q = mm[1].trim();
    const a = mm[2]
      .replace(/\[\[link:[^\]|]+\|([^\]]+)\]\]/g, '$1')
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (q && a) pairs.push({ q, a });
  }
  if (!pairs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.slice(0, 6).map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
}

let nextId = maxId + 1;
let written = 0;
let failed = 0;

for (const block of blocks) {
  const lines = block.replace(/^(\r?\n)+/, '').split('\n');
  const meta = {};
  let i = 0;
  while (i < lines.length && /^[a-z]+:/.test(lines[i])) {
    const idx = lines[i].indexOf(':');
    meta[lines[i].slice(0, idx).trim()] = lines[i].slice(idx + 1).trim();
    i++;
  }
  const content = lines.slice(i).join('\n').replace(/^\n+/, '').replace(/\s+$/, '') + '\n';

  const problems = [];
  content.split('\n').forEach((ln, n) => {
    if ((ln.match(/\*\*/g) || []).length % 2 !== 0) {
      problems.push(`  L${n + 1} 行内 ** 未闭合: ${ln.trim().slice(0, 60)}`);
    }
  });
  const open = (content.match(/\[\[link:/g) || []).length;
  const close = (content.match(/\]\]/g) || []).length;
  if (open !== close) problems.push(`  [[link: ${open} 个 vs ]] ${close} 个`);
  if (!meta.title || !meta.slug) problems.push('  缺少 title 或 slug');
  if (meta.slug && usedSlugs.has(meta.slug)) problems.push(`  slug 已存在: ${meta.slug}`);
  if (meta.category && !VALID_CATEGORIES.includes(meta.category)) {
    problems.push(`  category 无效: ${meta.category}`);
  }
  for (const m of content.matchAll(/\[\[link:\/tools\/(\d+)\|/g)) {
    if (!toolIds.has(Number(m[1]))) problems.push(`  内链指向不存在的工具 id: ${m[1]}`);
  }
  if (/\]\]\]|\[\[id:/.test(content)) problems.push('  存在不支持的链接写法');

  const words = content.split(/\s+/).filter(Boolean).length;
  const faq = buildFaq(content);

  if (problems.length) {
    failed++;
    console.log(`✗ ${meta.slug || '(无 slug)'}`);
    problems.forEach((p) => console.log(p));
    continue;
  }

  const post = {
    id: nextId++,
    title: meta.title,
    slug: meta.slug,
    date: today,
    description: meta.description || meta.title,
    style: '沉稳技术风',
    images: [],
    content,
    category: meta.category || 'Productivity',
  };
  if (faq) post.faq_schema = faq;

  console.log(
    `✓ [${post.id}] ${post.slug}  ${words} 词  内链 ${open}  FAQ ${faq ? faq.mainEntity.length : 0} 条`
  );
  if (apply) {
    fs.writeFileSync(path.join(dir, `${post.id}.json`), JSON.stringify(post, null, 2) + '\n');
    usedSlugs.add(post.slug);
    written++;
  }
}

console.log(apply ? `\n已写入 ${written} 篇，失败 ${failed} 篇` : `\n(dry-run) 通过 ${blocks.length - failed} 篇，失败 ${failed} 篇`);
process.exit(failed ? 1 : 0);
