#!/usr/bin/env node
/**
 * Push local commits using the GitHub Git Data API.
 *
 * Needed when git over https://github.com is blocked but api.github.com works
 * (which is the case on this machine). Creates blobs/trees/commits directly and
 * moves refs/heads/<branch>.
 *
 * Usage:
 *   node scripts/push-via-api.mjs            # push all commits since the remote head
 *   node scripts/push-via-api.mjs 3          # push the last 3 commits
 *   node scripts/push-via-api.mjs --dry      # show what would be pushed
 *
 * Blob content is taken from `git cat-file blob`, i.e. exactly what git stored
 * (LF-normalised), so the remote matches the local commit byte for byte.
 */
import { spawnSync } from 'child_process';

// execSync goes through cmd.exe, which intermittently fails with EBUSY on this
// machine. Spawn the binary directly instead.
function run(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell: false, ...opts });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} -> ${r.stderr || r.status}`);
  return r.stdout;
}
function runBuffer(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'buffer', shell: false, ...opts });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} -> ${r.status}`);
  return r.stdout;
}

const REPO = 'xiaomo945/useaitools-me';
const branch = 'main';
const dry = process.argv.includes('--dry');
const countArg = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const count = countArg ? Number(countArg) : null;

const token = run('gh', ['auth', 'token']).trim();
const API = 'https://api.github.com';
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'useaitools-push-script',
};

const git = (args) => run('git', args).trim();

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { ...headers, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

const remoteRef = await api('GET', `/repos/${REPO}/git/ref/heads/${branch}`);
let parent = remoteRef.object.sha;
console.log(`远端 ${branch}: ${parent.slice(0, 8)}`);

const range = count ? `HEAD~${count}..HEAD` : null;
const shas = git(range ? ['rev-list', '--reverse', range] : ['rev-list', '--reverse', 'HEAD'])
  .split('\n')
  .filter(Boolean);

// Stop at the commit whose tree already matches the remote head
const remoteCommit = await api('GET', `/repos/${REPO}/git/commits/${parent}`);
const localShas = [];
for (const sha of shas) {
  const tree = git(['rev-parse', `${sha}^{tree}`]);
  if (tree === remoteCommit.tree.sha) continue;
  localShas.push(sha);
}
console.log(`待推送 ${localShas.length} 个提交: ${localShas.map((s) => s.slice(0, 8)).join(' ')}`);

if (dry) {
  localShas.forEach((s) => console.log(`  ${git(['log', '-1', '--pretty=%s', s])}`));
  process.exit(0);
}

for (const sha of localShas) {
  const parentSha = `${sha}^`;
  const added = git(['diff', '--name-only', '--diff-filter=AM', parentSha, sha])
    .split('\n')
    .filter(Boolean);
  const removed = git(['diff', '--name-only', '--diff-filter=D', parentSha, sha])
    .split('\n')
    .filter(Boolean);

  const tree = [];
  for (const p of added) {
    const buf = runBuffer('git', ['cat-file', 'blob', `${sha}:${p}`], {
      maxBuffer: 64 * 1024 * 1024,
    });
    const blob = await api('POST', `/repos/${REPO}/git/blobs`, {
      content: buf.toString('base64'),
      encoding: 'base64',
    });
    tree.push({ path: p, mode: '100644', type: 'blob', sha: blob.sha });
  }
  for (const p of removed) {
    tree.push({ path: p, mode: '100644', type: 'blob', sha: null });
  }

  const newTree = await api('POST', `/repos/${REPO}/git/trees`, {
    base_tree: (await api('GET', `/repos/${REPO}/git/commits/${parent}`)).tree.sha,
    tree,
  });
  const message = git(['log', '-1', '--pretty=%B', sha]);
  const commit = await api('POST', `/repos/${REPO}/git/commits`, {
    message,
    tree: newTree.sha,
    parents: [parent],
  });
  parent = commit.sha;
  console.log(`  ✓ ${commit.sha.slice(0, 8)}  +${added.length} -${removed.length}  ${message.split('\n')[0].slice(0, 60)}`);
}

await api('PATCH', `/repos/${REPO}/git/refs/heads/${branch}`, { sha: parent });
console.log(`\n${branch} -> ${parent.slice(0, 8)}`);
console.log(`https://github.com/${REPO}/commit/${parent}`);
