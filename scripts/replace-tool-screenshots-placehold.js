const fs = require('fs');
const path = require('path');
const { PHOTO_POOLS } = require('./_tool-photo-pool-288');

const TOOLS_FILE = path.join(process.cwd(), 'data', 'tools.json');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_REMAP = process.argv.includes('--force-remap');

const PLACEHOLD_RE = /^https?:\/\/placehold\.co\//i;
const UNSPLASH_RE = /^https:\/\/images\.unsplash\.com\/(photo-[^?#]+)/;

const FALLBACK_CATEGORY = 'Productivity';
const VALID_CATEGORIES = Object.keys(PHOTO_POOLS);

// Pool sanity print (assert 288 each)
const POOL_SIZE_TARGET = 288;
for (const c of VALID_CATEGORIES) {
  const n = PHOTO_POOLS[c].length;
  if (n !== POOL_SIZE_TARGET) {
    throw new Error(`PHOTO_POOLS ${c} size=${n}, expected ${POOL_SIZE_TARGET} (36*8)`);
  }
}

// 32-bit FNV-1a hash to spread (id, i, category) evenly into [0, poolSize)
function fnv1a(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function pickPhoto(category, seedA, seedB, extraSalt = '') {
  const c = VALID_CATEGORIES.includes(category) ? category : FALLBACK_CATEGORY;
  const pool = PHOTO_POOLS[c];
  const key = `${c}|${seedA}|${seedB}|${extraSalt}`;
  const idx = fnv1a(key) % pool.length;
  return `https://images.unsplash.com/${pool[idx]}?w=1200&h=800&fit=crop&auto=format&q=80`;
}

function photoIdFromUrl(url) {
  if (!url) return null;
  const m = url.match(UNSPLASH_RE);
  return m ? m[1] : null;
}

function shouldReplace(existingUrl) {
  if (typeof existingUrl !== 'string') return false;
  if (PLACEHOLD_RE.test(existingUrl)) return true;
  if (FORCE_REMAP && photoIdFromUrl(existingUrl)) return true;
  return false;
}

function distributionStats(tools) {
  const byCat = {};
  for (const t of tools) {
    const arr = t.examples || [];
    const set = byCat[t.category] || (byCat[t.category] = new Set());
    for (const ex of arr) {
      const id = photoIdFromUrl(ex.image_url);
      if (id) set.add(id);
    }
  }
  const out = {};
  for (const k of Object.keys(byCat)) out[k] = byCat[k].size;
  return out;
}

function main() {
  if (!fs.existsSync(TOOLS_FILE)) {
    console.error(`❌ tools.json not found at ${TOOLS_FILE}`);
    process.exit(1);
  }
  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  if (!Array.isArray(tools)) {
    console.error('❌ tools.json root should be an array');
    process.exit(1);
  }

  const beforeDist = distributionStats(tools);

  let changedTools = 0;
  let changedExamples = 0;
  let totalExamples = 0;
  const categoryStats = {};

  for (const tool of tools) {
    const examples = tool.examples;
    if (!Array.isArray(examples) || examples.length === 0) continue;
    let toolDirty = false;
    for (let i = 0; i < examples.length; i++) {
      totalExamples++;
      const ex = examples[i];
      if (!ex || typeof ex.image_url !== 'string') continue;
      if (!shouldReplace(ex.image_url)) continue;
      const newUrl = pickPhoto(tool.category, Number(tool.id) || 0, i, String(tool.slug || tool.name || ''));
      if (newUrl !== ex.image_url) {
        ex.image_url = newUrl;
        toolDirty = true;
        changedExamples++;
        const c = tool.category || '(none)';
        categoryStats[c] = (categoryStats[c] || 0) + 1;
      }
    }
    if (toolDirty) changedTools++;
  }

  const afterDist = distributionStats(tools);
  const outputSummary = `Tool screenshot replacement summary:
  - Flags : --dry-run=${DRY_RUN}, --force-remap=${FORCE_REMAP}
  - Pool size per category : ${PHOTO_POOLS[VALID_CATEGORIES[0]].length} (${VALID_CATEGORIES.join(', ')})
  - Tools touched : ${changedTools} / ${tools.length}
  - Examples replaced : ${changedExamples} / ${totalExamples}
  - Per category replacements : ${JSON.stringify(categoryStats, null, 2)}
  - Distinct Unsplash photo IDs used BEFORE per category : ${JSON.stringify(beforeDist, null, 2)}
  - Distinct Unsplash photo IDs used AFTER  per category : ${JSON.stringify(afterDist, null, 2)}
  - Mode : ${DRY_RUN ? 'DRY RUN (no write)' : 'WRITE (applied)'}
  `;

  console.log(outputSummary);
  const outDir = path.join(process.cwd(), '.tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'replace-tool-screenshots-summary.txt'), outputSummary);

  if (!DRY_RUN) {
    fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2));
    console.log(`💾 Written back to ${TOOLS_FILE}`);
  } else {
    console.log('🧪 Dry-run only — no files changed. Re-run without --dry-run to apply.');
  }
}

main();
