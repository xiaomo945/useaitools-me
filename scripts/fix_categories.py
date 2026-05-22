#!/usr/bin/env python3
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def infer_category(title, content):
    text = (title + ' ' + content).lower()
    if any(k in text for k in ['writing', 'copy', 'content', 'article', 'blog', 'essay', 'paragraph']):
        return 'Writing'
    if any(k in text for k in ['image', 'art', 'photo', 'design', 'picture', 'visual']):
        return 'Image'
    if any(k in text for k in ['video', 'video editing', 'clip', 'edit', 'film']):
        return 'Video'
    if any(k in text for k in ['audio', 'podcast', 'voice', 'sound', 'music']):
        return 'Audio'
    if any(k in text for k in ['code', 'programming', 'coding', 'developer', 'software']):
        return 'Code'
    if any(k in text for k in ['productivity', 'task', 'workflow', 'automation', 'remote']):
        return 'Productivity'
    return 'Writing'

json_path = os.path.join(SCRIPT_DIR, 'data', 'blog-posts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    blogs = json.load(f)

fixed_count = 0
for blog in blogs:
    if 'category' not in blog or blog.get('category') is None:
        blog['category'] = infer_category(blog.get('title', ''), blog.get('content', ''))
        fixed_count += 1
        print(f"Post {blog['id']}: {blog['title'][:50]}... -> {blog['category']}")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(blogs, f, ensure_ascii=False, indent=2)

print(f"\nFixed {fixed_count} posts with missing category")