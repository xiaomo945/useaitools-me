#!/usr/bin/env python3
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Unsplash image mappings based on blog categories/keywords
UNSPLASH_IMAGES = {
    'writing': [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop',
    ],
    'image': [
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=400&fit=crop',
    ],
    'video': [
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop',
    ],
    'audio': [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop',
    ],
    'coding': [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    ],
    'productivity': [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    ],
    'default': [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
    ],
    'freelancer': [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=400&fit=crop',
    ],
    'automation': [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop',
    ],
    'podcast': [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1471421298428-1513ab720a8e?w=800&h=400&fit=crop',
    ],
}

def get_category_keyword(title, description):
    text = (title + ' ' + description).lower()
    if any(k in text for k in ['writing', 'rytr', 'jasper', 'copy.ai', 'content creation']):
        return 'writing'
    if any(k in text for k in ['image', 'midjourney', 'dall-e', 'stable diffusion', 'art']):
        return 'image'
    if any(k in text for k in ['video', 'runway', 'pika', 'synthesia', 'veed']):
        return 'video'
    if any(k in text for k in ['audio', 'voice', 'podcast', 'elevenlabs', 'murf', 'suno']):
        return 'audio'
    if any(k in text for k in ['code', 'coding', 'copilot', 'cursor', 'codium', 'github']):
        return 'coding'
    if any(k in text for k in ['productivity', 'notion', 'clickup', 'todoist']):
        return 'productivity'
    if any(k in text for k in ['freelanc']):
        return 'freelancer'
    if any(k in text for k in ['automate', 'automation']):
        return 'automation'
    if any(k in text for k in ['podcast']):
        return 'podcast'
    return 'default'

def get_image_for_position(category, position, index):
    images = UNSPLASH_IMAGES.get(category, UNSPLASH_IMAGES['default'])
    if position == 'header':
        idx = 0
    elif position == 'mid':
        idx = 1
    elif position == 'cta':
        idx = 2
    else:
        idx = index % 3
    return images[idx % len(images)]

json_path = os.path.join(SCRIPT_DIR, 'data', 'blog-posts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

replaced_count = 0
for post in data:
    category = get_category_keyword(post.get('title', ''), post.get('description', ''))
    images = post.get('images', [])
    for i, img in enumerate(images):
        if 'placehold.co' in img.get('url', ''):
            position = img.get('position', 'mid')
            new_url = get_image_for_position(category, position, i)
            img['url'] = new_url
            img['image_url'] = new_url
            replaced_count += 1
            print(f"Post {post['id']}: Replaced {position} image -> {new_url[:60]}...")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nTotal images replaced: {replaced_count}")