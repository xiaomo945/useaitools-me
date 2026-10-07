import fs from 'fs';
import path from 'path';
const dir = 'data/blog-posts';
const CJK = /[\u4e00-\u9fa5]/g;
const rows = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const c = p.content || '';
  const cjkCount = (c.match(CJK) || []).length;
  if (!cjkCount) continue;
  const total = c.replace(/\s/g, '').length;
  const ratio = cjkCount / total;
  const words = c.split(/\s+/).filter(Boolean).length;
  rows.push({ file: f, id: p.id, slug: p.slug, cjkCount, ratio: (ratio * 100).toFixed(0), words, title: p.title });
}
rows.sort((a, b) => b.ratio - a.ratio);
console.log('文件 | id | slug | 中文占比 | 中文字符 | 总词数');
rows.forEach((r) => console.log(`${r.file.padEnd(12)} ${String(r.id).padEnd(5)} ${String(r.ratio).padStart(3)}%  ${String(r.cjkCount).padStart(5)}字  ${String(r.words).padStart(5)}词  ${r.slug}`));
