#!/usr/bin/env python3
"""
Email Filter Script — Auto-classify recent emails into Urgent / Ads / Normal
Supports Gmail (via App Password) and QQ Mail (via IMAP auth code).

Usage:
    python scripts/email-filter.py your-email@gmail.com
"""

import imaplib
import email
from email.header import decode_header
import sys
import getpass
from datetime import datetime, timedelta
import re
import json
import urllib.request
import urllib.parse
import ssl

# --- Config ---
URGENT_SENDERS = [
    "grammarly", "roundbarnlabs", "pictory", "synthesia",
    "notion", "descript", "partnerstack", "impact.com",
]
AD_KEYWORDS = [
    "sale", "discount", "limited time", "buy now", "subscribe",
]
DAYS_BACK = 3


def decode_mime_words(s):
    """Decode MIME encoded words in headers."""
    if s is None:
        return ""
    parts = []
    for data, charset in decode_header(s):
        if isinstance(data, bytes):
            parts.append(data.decode(charset or "utf-8", errors="replace"))
        else:
            parts.append(data)
    return "".join(parts)


def classify(sender, subject):
    """Classify email into urgent / ads / normal."""
    sender_lower = sender.lower()
    subject_lower = subject.lower()
    for keyword in URGENT_SENDERS:
        if keyword.lower() in sender_lower:
            return "urgent"
    for keyword in AD_KEYWORDS:
        if keyword in subject_lower:
            return "ads"
    return "normal"


def translate_to_chinese(text):
    """
    Free translation via MyMemory API (no key required).
    Falls back to a truncated preview on failure.
    """
    if not text or len(text.strip()) < 5:
        return text
    # Trim to ~500 chars to keep API call fast
    text = text[:500].strip()
    try:
        params = urllib.parse.urlencode({
            "q": text,
            "langpair": "en|zh-CN",
            "mt": "1",
        })
        url = f"https://api.mymemory.translated.net/get?{params}"
        ctx = ssl.create_default_context()
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            result = data.get("responseData", {}).get("translatedText", "")
            if result:
                return result
    except Exception:
        pass
    # Fallback: show first 80 chars
    return text[:80] + ("..." if len(text) > 80 else "")


def extract_text_snippet(msg, max_chars=300):
    """Extract a short plain-text snippet from the email body."""
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ct = part.get_content_type()
            if ct == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    body = payload.decode(charset, errors="replace")
                    break
            elif ct == "text/html" and not body:
                payload = part.get_payload(decode=True)
                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    html = payload.decode(charset, errors="replace")
                    body = re.sub(r"<[^>]+>", " ", html)
                    body = re.sub(r"\s+", " ", body).strip()
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            charset = msg.get_content_charset() or "utf-8"
            raw = payload.decode(charset, errors="replace")
            if msg.get_content_type() == "text/html":
                raw = re.sub(r"<[^>]+>", " ", raw)
                raw = re.sub(r"\s+", " ", raw).strip()
            body = raw
    body = body.strip()
    if len(body) > max_chars:
        body = body[:max_chars] + "..."
    return body


def fetch_emails(email_address, password):
    """Connect via IMAP and fetch emails from the last N days."""
    # Determine IMAP server
    if email_address.endswith("@qq.com"):
        imap_server = "imap.qq.com"
        imap_port = 993
    else:
        imap_server = "imap.gmail.com"
        imap_port = 993

    ctx = ssl.create_default_context()
    mail = imaplib.IMAP4_SSL(imap_server, imap_port, ssl_context=ctx)
    mail.login(email_address, password)
    mail.select("INBOX")

    # Date filter
    since_date = (datetime.now() - timedelta(days=DAYS_BACK)).strftime("%d-%b-%Y")
    status, messages = mail.search(None, f'(SINCE "{since_date}")')
    if status != "OK":
        print("Failed to search emails.")
        mail.logout()
        return

    email_ids = messages[0].split()
    if not email_ids:
        print(f"No emails found in the last {DAYS_BACK} days.")
        mail.logout()
        return

    urgent = []
    ads = []
    normal = []

    for eid in reversed(email_ids):
        status, msg_data = mail.fetch(eid, "(RFC822)")
        if status != "OK":
            continue
        raw = msg_data[0][1]
        msg = email.message_from_bytes(raw)

        sender = decode_mime_words(msg.get("From", ""))
        subject = decode_mime_words(msg.get("Subject", ""))
        date_str = msg.get("Date", "")

        category = classify(sender, subject)
        snippet = extract_text_snippet(msg)

        entry = {
            "sender": sender,
            "subject": subject,
            "date": date_str,
            "snippet": snippet,
        }

        if category == "urgent":
            entry["summary"] = translate_to_chinese(snippet)
            urgent.append(entry)
        elif category == "ads":
            ads.append(entry)
        else:
            normal.append(entry)

    mail.logout()
    return urgent, ads, normal


def print_results(urgent, ads, normal):
    """Print classified emails in the required format."""
    idx = 1

    print("\n=== 紧急邮件 ===")
    if not urgent:
        print("(无)")
    else:
        for e in urgent:
            summary = e.get("summary", "")
            if summary:
                print(f"{idx}. [{e['sender']}] {e['subject']} — {summary}")
            else:
                print(f"{idx}. [{e['sender']}] {e['subject']} — {e['snippet']}")
            idx += 1

    print("\n=== 广告邮件 ===")
    if not ads:
        print("(无)")
    else:
        for e in ads:
            print(f"{idx}. [{e['sender']}] {e['subject']}（跳过）")
            idx += 1

    print("\n=== 普通邮件 ===")
    if not normal:
        print("(无)")
    else:
        for e in normal:
            print(f"{idx}. [{e['sender']}] {e['subject']} — {e['snippet']}")
            idx += 1

    total = len(urgent) + len(ads) + len(normal)
    print(f"\n共计 {total} 封邮件（紧急: {len(urgent)}, 广告: {len(ads)}, 普通: {len(normal)}）")


def main():
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} your-email@gmail.com")
        sys.exit(1)

    email_address = sys.argv[1]
    password = getpass.getpass("Password / App Password / Auth Code: ")

    print(f"\nConnecting to {email_address} ...")
    urgent, ads, normal = fetch_emails(email_address, password)

    if urgent is None:
        return

    print_results(urgent, ads, normal)


if __name__ == "__main__":
    main()
