#!/usr/bin/env python3
"""Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).

IndexNow is a push protocol: you tell search engines "these URLs changed",
and they crawl within hours instead of waiting weeks. No OAuth, no account
— the only proof of ownership is a key file served from your domain.

Google is NOT part of IndexNow. For Google use scripts/auto-submit-gsc.py.

Usage:
    python3 scripts/submit-indexnow.py --all            # every URL in sitemap.xml
    python3 scripts/submit-indexnow.py --filter blog    # blog URLs only
    python3 scripts/submit-indexnow.py --filter tools   # tool pages only
    python3 scripts/submit-indexnow.py --limit 200      # cap the URL count
    python3 scripts/submit-indexnow.py --url https://... --url https://...
    python3 scripts/submit-indexnow.py --dry-run        # print, don't send

Env:
    SITE_ORIGIN   override site origin (default https://useaitools.me)
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request

SITE = "https://useaitools.me"
KEY = "f67850cb7587e549bb8e2a7ffca0c3af"
ENDPOINT = "https://api.indexnow.org/indexnow"
BATCH = 10_000  # IndexNow hard limit per request


def fetch_sitemap_urls(origin: str) -> list[str]:
    urls: list[str] = []
    seen = set()
    # sitemap index: try sitemap.xml first, follow <sitemap><loc> children
    queue = [f"{origin}/sitemap.xml"]
    done = set()
    while queue:
        sm = queue.pop(0)
        if sm in done:
            continue
        done.add(sm)
        try:
            req = urllib.request.Request(sm, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read().decode("utf-8", errors="ignore")
        except Exception as e:  # noqa: BLE001
            print(f"[warn] cannot fetch {sm}: {e}", file=sys.stderr)
            continue
        if "<sitemapindex" in body:
            import re

            for m in re.finditer(r"<loc>\s*([^<\s]+)\s*</loc>", body):
                queue.append(m.group(1))
            continue
        import re

        for m in re.finditer(r"<loc>\s*([^<\s]+)\s*</loc>", body):
            u = m.group(1)
            if u not in seen:
                seen.add(u)
                urls.append(u)
    return urls


def post_batch(urls: list[str], origin: str, host: str, dry: bool) -> int:
    payload = {
        "host": host,
        "key": KEY,
        "keyLocation": f"{origin}/{KEY}.txt",
        "urlList": urls,
    }
    if dry:
        print(f"[dry-run] would POST {len(urls)} URLs to {ENDPOINT}")
        print(f"[dry-run] first 5: {urls[:5]}")
        return 200
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Mozilla/5.0 (compatible; useaitools-indexnow/1.0)",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            print(f"[ok] {len(urls)} URLs -> HTTP {r.status}")
            return r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")[:300]
        print(f"[error] HTTP {e.code} {body}", file=sys.stderr)
        return e.code
    except Exception as e:  # noqa: BLE001
        print(f"[error] {e}", file=sys.stderr)
        return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="submit every sitemap URL")
    ap.add_argument("--filter", dest="filt", default=None,
                    choices=["blog", "tools", "static"], help="subset of URLs")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--url", action="append", default=[], help="explicit URL (repeatable)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--site", default=SITE)
    args = ap.parse_args()

    origin = args.site.rstrip("/")
    host = origin.split("//")[-1]

    if args.url:
        urls = list(args.url)
    else:
        urls = fetch_sitemap_urls(origin)

    if not urls:
        print("[error] no URLs found", file=sys.stderr)
        return 1

    if args.filt == "blog":
        urls = [u for u in urls if "/blog/" in u]
    elif args.filt == "tools":
        urls = [u for u in urls if "/tools/" in u]
    elif args.filt == "static":
        urls = [u for u in urls if "/blog/" not in u and "/tools/" not in u]

    if args.limit:
        urls = urls[: args.limit]

    print(f"[info] {len(urls)} URLs to submit for host={host}")

    ok = True
    for i in range(0, len(urls), BATCH):
        chunk = urls[i : i + BATCH]
        code = post_batch(chunk, origin, host, args.dry_run)
        if code not in (200, 202):
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
