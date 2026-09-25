#!/usr/bin/env python3
"""Submit URLs to Google via the Indexing API.

IMPORTANT — read before you rely on this
----------------------------------------
Google documents the Indexing API as being for two structured-data types only:
JobPosting and BroadcastEvent. In practice the API accepts any URL and returns
200, and many publishers report faster discovery on ordinary pages too — but
Google does not guarantee it, and it is not a substitute for a clean internal
linking structure. Treat it as "nudge", not "guarantee".

Quota: 200 URL submissions per day by default (can be raised in GCP console).

Setup (one-time)
----------------
1. Google Cloud Console -> enable "Web Search Indexing API".
2. Create a service account, download the JSON key.
3. Search Console -> the property that owns the site -> Settings -> Ownership
   verification -> add the service account email as an owner.
4. Put the JSON key in GitHub Actions secret `GSC_SERVICE_ACCOUNT_JSON`
   (whole file contents as one line), or place it at ./credentials.json locally.

Usage
-----
    python3 scripts/auto-submit-gsc.py --days 7
    python3 scripts/auto-submit-gsc.py --days 1 --dry-run
    python3 scripts/auto-submit-gsc.py --all --limit 200
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import os
import sys

SITE = "https://useaitools.me"
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SCOPES = ["https://www.googleapis.com/auth/indexing"]
DATE_FIELDS = ("publishedAt", "published_at", "date", "createdAt", "created_at", "updatedAt")


def load_credentials():
    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests
    except ImportError:
        print("[error] missing deps. run: pip install google-auth", file=sys.stderr)
        return None

    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON")
    if raw:
        info = json.loads(raw)
    elif os.path.exists("credentials.json"):
        info = json.load(open("credentials.json", encoding="utf-8"))
    else:
        print(
            "[error] no credentials. set GSC_SERVICE_ACCOUNT_JSON or add credentials.json",
            file=sys.stderr,
        )
        return None

    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return google.auth.transport.requests.AuthorizedSession(creds)


def collect_urls(days: int | None, limit: int) -> list[str]:
    """Read data/blog-posts/*.json and return URLs published within `days`."""
    files = sorted(glob.glob("data/blog-posts/*.json"))
    cutoff = None
    if days:
        cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)

    urls = []
    for fp in files:
        try:
            post = json.load(open(fp, encoding="utf-8"))
        except Exception:  # noqa: BLE001
            continue
        slug = post.get("slug")
        if not slug:
            continue
        if cutoff is not None:
            raw = None
            for f in DATE_FIELDS:
                if post.get(f):
                    raw = post[f]
                    break
            if not raw:
                ts = os.path.getmtime(fp)
                when = dt.datetime.fromtimestamp(ts, tz=dt.timezone.utc)
            else:
                try:
                    when = dt.datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
                except ValueError:
                    when = dt.datetime.now(dt.timezone.utc)
                if when.tzinfo is None:
                    when = when.replace(tzinfo=dt.timezone.utc)
            if when < cutoff:
                continue
        urls.append(f"{SITE}/blog/{slug}")

    return urls[:limit] if limit else urls


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=1, help="only posts from last N days")
    ap.add_argument("--all", action="store_true", help="ignore date filter")
    ap.add_argument("--limit", type=int, default=200, help="daily quota is 200")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    urls = collect_urls(None if args.all else args.days, args.limit)
    if not urls:
        print("[info] nothing to submit")
        return 0

    print(f"[info] {len(urls)} URLs to submit")
    if args.dry_run:
        for u in urls[:20]:
            print("  ", u)
        return 0

    session = load_credentials()
    if session is None:
        return 1

    ok = fail = 0
    for u in urls:
        try:
            r = session.post(ENDPOINT, json={"url": u, "type": "URL_UPDATED"})
            if r.status_code == 200:
                ok += 1
            else:
                fail += 1
                print(f"[warn] {r.status_code} {u}: {r.text[:160]}", file=sys.stderr)
        except Exception as e:  # noqa: BLE001
            fail += 1
            print(f"[error] {u}: {e}", file=sys.stderr)

    print(f"[done] ok={ok} failed={fail}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
