#!/usr/bin/env bash
# Push commits through the GitHub Git Data API.
#
# Needed on this machine because git over https://github.com is blocked while
# api.github.com works. Spawning subprocesses from Node is blocked too, so the
# git side runs here in bash and Node is only used for JSON.
#
# Usage: bash scripts/push-via-api.sh [commit-count] [branch]
set -uo pipefail

REPO="xiaomo945/useaitools-me"
COUNT="${1:-1}"
BRANCH="${2:-main}"

TOKEN=$(gh auth token)
[ -z "$TOKEN" ] && { echo "gh 未登录"; exit 1; }
API="https://api.github.com/repos/$REPO"

# Use a path inside the repo: mktemp returns a POSIX /tmp/... path that Node
# resolves against the current drive and gets wrong on Windows.
TMP=".tmp/push"
rm -rf "$TMP"
mkdir -p "$TMP"

# Read a field out of a JSON response on stdin: jqget ".object.sha"
jqget() {
  node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);const v=(function(){return (j$1)})();console.log(v===undefined?'':v)})"
}

PARENT=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "$API/git/ref/heads/$BRANCH" | jqget ".object.sha")
[ -z "$PARENT" ] && { echo "取不到远端 $BRANCH"; exit 1; }
echo "远端 $BRANCH = ${PARENT:0:8}"

SHAS=$(git rev-list --reverse "HEAD~$COUNT..HEAD")
[ -z "$SHAS" ] && { echo "没有待推送的提交"; exit 0; }

for sha in $SHAS; do
  echo "--- ${sha:0:8} ---"
  git diff --name-only --diff-filter=AM "$sha^" "$sha" > "$TMP/add.txt"
  git diff --name-only --diff-filter=D "$sha^" "$sha" > "$TMP/del.txt"
  git log -1 --pretty=%B "$sha" > "$TMP/msg.txt"

  PARENT_TREE=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    "$API/git/commits/$PARENT" | jqget ".tree.sha")

  echo "[]" > "$TMP/entries.json"

  while IFS= read -r p; do
    [ -z "$p" ] && continue
    git cat-file blob "$sha:$p" | base64 -w0 > "$TMP/b64.txt"
    node -e "
      const fs=require('fs');
      const b64=fs.readFileSync('$TMP/b64.txt','utf8').trim();
      fs.writeFileSync('$TMP/blob.json', JSON.stringify({content:b64, encoding:'base64'}));
    "
    BSHA=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
      -d "@$TMP/blob.json" "$API/git/blobs" | jqget ".sha")
    if [ -z "$BSHA" ]; then echo "  ✗ blob 失败: $p"; continue; fi
    node -e "
      const fs=require('fs');
      const e=JSON.parse(fs.readFileSync('$TMP/entries.json','utf8'));
      e.push({path:process.argv[1], mode:'100644', type:'blob', sha:process.argv[2]});
      fs.writeFileSync('$TMP/entries.json', JSON.stringify(e));
    " "$p" "$BSHA"
    echo "  + ${BSHA:0:8}  $p"
  done < "$TMP/add.txt"

  while IFS= read -r p; do
    [ -z "$p" ] && continue
    node -e "
      const fs=require('fs');
      const e=JSON.parse(fs.readFileSync('$TMP/entries.json','utf8'));
      e.push({path:process.argv[1], mode:'100644', type:'blob', sha:null});
      fs.writeFileSync('$TMP/entries.json', JSON.stringify(e));
    " "$p"
    echo "  - $p"
  done < "$TMP/del.txt"

  node -e "
    const fs=require('fs');
    const e=JSON.parse(fs.readFileSync('$TMP/entries.json','utf8'));
    fs.writeFileSync('$TMP/tree.json', JSON.stringify({base_tree:process.argv[1], tree:e}));
  " "$PARENT_TREE"

  NEWTREE=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    -d "@$TMP/tree.json" "$API/git/trees" | jqget ".sha")
  [ -z "$NEWTREE" ] && { echo "✗ tree 创建失败"; exit 1; }

  node -e "
    const fs=require('fs');
    const msg=fs.readFileSync('$TMP/msg.txt','utf8').trim();
    fs.writeFileSync('$TMP/commit.json', JSON.stringify({
      message: msg, tree: process.argv[1], parents: [process.argv[2]]
    }));
  " "$NEWTREE" "$PARENT"

  NEWCOMMIT=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
    -d "@$TMP/commit.json" "$API/git/commits" | jqget ".sha")
  [ -z "$NEWCOMMIT" ] && { echo "✗ commit 创建失败"; exit 1; }
  echo "  ✓ commit ${NEWCOMMIT:0:8}"
  PARENT="$NEWCOMMIT"
done

printf '{"sha":"%s"}' "$PARENT" > "$TMP/ref.json"
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  -d "@$TMP/ref.json" "$API/git/refs/heads/$BRANCH" > /dev/null

echo ""
echo "$BRANCH -> ${PARENT:0:8}"
echo "https://github.com/$REPO/commit/$PARENT"
