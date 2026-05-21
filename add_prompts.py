#!/usr/bin/env python3
import json
import os
from urllib.parse import urlparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_prompt(alt_text, position, caption):
    base_prompt = alt_text
    style_suffix = ", ultra detailed, 8k, professional photography, cinematic lighting, vibrant colors"
    if "header" in position.lower() or "hero" in position.lower():
        position_desc = "wide cinematic banner format"
    elif "mid" in position.lower() or "middle" in position.lower():
        position_desc = "square format for social sharing"
    elif "cta" in position.lower() or "call to action" in position.lower():
        position_desc = "centered composition with text-friendly background"
    else:
        position_desc = "versatile format"
    full_prompt = f"{base_prompt}, {position_desc}{style_suffix}"
    return full_prompt

json_path = os.path.join(SCRIPT_DIR, 'data', 'blog-posts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for post in data:
    if 'images' in post and post['images']:
        for img in post['images']:
            if 'placehold.co' in img.get('url', ''):
                alt = img.get('alt', '')
                caption = img.get('caption', '')
                position = img.get('position', 'mid')
                prompt = generate_prompt(alt, position, caption)
                img['prompt'] = prompt
                count += 1
                print(f"Added prompt to post {post['id']}: {prompt[:80]}...")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nTotal images updated: {count}")