#!/usr/bin/env node
/**
 * IndexNow submission for useaitools.me
 *
 * IndexNow is an open protocol (supported by Bing, Yandex, Seznam, Naver) that
 * lets a site push URL changes to search engines instantly instead of waiting
 * for a crawl. It replaces the retired Bing `webmaster/ping.aspx` endpoint.
 *
 * The key is intentionally public: IndexNow verifies ownership by fetching
 * https://useaitools.me/<key>.txt, which is served from public/. So the key
 * must stay in sync with the file in public/.
 *
 * Usage:
 *   node scripts/indexnow.mjs                # submit the 56 rewritten articles
 *   node scripts/indexnow.mjs rewritten      # same as above
 *   node scripts/indexnow.mjs all            # submit every indexable URL
 *   node scripts/indexnow.mjs file urls.txt  # submit URLs from a file (one per line)
 */
import fs from 'fs';
import path from 'path';

const HOST = 'useaitools.me';
const KEY = 'a9abeeaceba71296ca6877d01d6ae30c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE = `https://${HOST}`;
const BATCH = 10000; // IndexNow max URLs per request

const root = process.cwd();

function readJson(p) {
  return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
}

/** The 56 articles that were demoted and then rewritten (now indexable again). */
function urlRewritten() {
  const d = readJson('data/demoted-content.json');
  return d.items.map((i) => `${SITE}/blog/${i.slug}`);
}

/** Every blog post, tool page, category and comparison page. */
function urlAll() {
  const urls = [];
  const blogDir = path.join(root, 'data', 'blog-posts');
  for (const f of fs.readdirSync(blogDir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(blogDir, f), 'utf8'));
      if (p?.slug) urls.push(`${SITE}/blog/${p.slug}`);
    } catch { /* skip corrupt */ }
  }
  for (const t of readJson('data/tools.json')) {
    if (t?.slug) urls.push(`${SITE}/tool/${t.slug}`);
    else if (t?.id) urls.push(`${SITE}/tool/${t.id}`);
  }
  for (const c of ['Image', 'Writing', 'Code', 'Video', 'Productivity', 'Audio']) {
    urls.push(`${SITE}/category/${c.toLowerCase()}`);
  }
  return urls;
}

function urlFile(p) {
  return fs.readFileSync(path.join(root, p), 'utf8')
    .split('\n').map((s) => s.trim()).filter(Boolean);
}

async function submit(list) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: list }),
  });
  return { status: res.status, body: (await res.text()).slice(0, 300) };
}

const mode = process.argv[2] || 'rewritten';
let urls;
if (mode === 'all') urls = urlAll();
else if (mode === 'file') urls = urlFile(process.argv[3]);
else urls = urlRewritten();

const unique = [...new Set(urls)];
console.log(`Mode: ${mode}`);
console.log(`Submitting ${unique.length} URL(s) to IndexNow...`);
console.log(`Key location: ${KEY_LOCATION}`);

let ok = 0;
for (let i = 0; i < unique.length; i += BATCH) {
  const batch = unique.slice(i, i + BATCH);
  const { status, body } = await submit(batch);
  const good = status === 200 || status === 202;
  console.log(`  batch ${i / BATCH + 1}: ${batch.length} URLs -> HTTP ${status}${good ? ' OK' : ' FAILED ' + body}`);
  if (good) ok += batch.length;
}
console.log(`\nDone. ${ok}/${unique.length} URL(s) accepted.`);
console.log('Note: IndexNow notifies Bing/Yandex/Seznam/Naver. Google must be asked via Search Console.');
