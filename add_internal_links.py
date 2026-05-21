#!/usr/bin/env python3
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 工具名称到URL的映射
TOOL_LINKS = {
    'rytr': '/tools/rytr',
    'jasper': '/tools/jasper',
    'copy.ai': '/tools/copy-ai',
    'midjourney': '/tools/midjourney',
    'dall-e': '/tools/dall-e',
    'stable diffusion': '/tools/stable-diffusion',
    'runway': '/tools/runway',
    'pika': '/tools/pika',
    'synthesia': '/tools/synthesia',
    'veed': '/tools/veed',
    'elevenlabs': '/tools/elevenlabs',
    'murf': '/tools/murf-ai',
    'suno': '/tools/suno',
    'github copilot': '/tools/github-copilot',
    'cursor': '/tools/cursor',
    'codeium': '/tools/codeium',
    'codium': '/tools/codium',
    'notion': '/tools/notion',
    'clickup': '/tools/clickup',
    'todoist': '/tools/todoist',
    'descript': '/tools/descript',
    'pictory': '/tools/pictory',
}

# 分类链接
CATEGORY_LINKS = {
    'Writing': '/category/writing',
    'Image': '/category/image',
    'Video': '/category/video',
    'Audio': '/category/audio',
    'Code': '/category/code',
    'Productivity': '/category/productivity',
}

def add_internal_links(content, category):
    content = content.replace('Rytr', '<a href="/tools/rytr" class="text-emerald-600 hover:underline">Rytr</a>')
    content = content.replace('Jasper', '<a href="/tools/jasper" class="text-emerald-600 hover:underline">Jasper</a>')
    content = content.replace('Midjourney', '<a href="/tools/midjourney" class="text-emerald-600 hover:underline">Midjourney</a>')
    content = content.replace('DALL-E', '<a href="/tools/dall-e" class="text-emerald-600 hover:underline">DALL-E</a>')
    content = content.replace('Runway', '<a href="/tools/runway" class="text-emerald-600 hover:underline">Runway</a>')
    content = content.replace('VEED', '<a href="/tools/veed" class="text-emerald-600 hover:underline">VEED</a>')
    content = content.replace('VEED.io', '<a href="/tools/veed" class="text-emerald-600 hover:underline">VEED.io</a>')
    content = content.replace('ElevenLabs', '<a href="/tools/elevenlabs" class="text-emerald-600 hover:underline">ElevenLabs</a>')
    content = content.replace('Murf AI', '<a href="/tools/murf-ai" class="text-emerald-600 hover:underline">Murf AI</a>')
    content = content.replace('GitHub Copilot', '<a href="/tools/github-copilot" class="text-emerald-600 hover:underline">GitHub Copilot</a>')
    content = content.replace('Cursor', '<a href="/tools/cursor" class="text-emerald-600 hover:underline">Cursor</a>')
    content = content.replace('Codeium', '<a href="/tools/codeium" class="text-emerald-600 hover:underline">Codeium</a>')
    content = content.replace('Notion', '<a href="/tools/notion" class="text-emerald-600 hover:underline">Notion</a>')
    content = content.replace('ClickUp', '<a href="/tools/clickup" class="text-emerald-600 hover:underline">ClickUp</a>')
    content = content.replace('Todoist', '<a href="/tools/todoist" class="text-emerald-600 hover:underline">Todoist</a>')
    content = content.replace('Descript', '<a href="/tools/descript" class="text-emerald-600 hover:underline">Descript</a>')
    content = content.replace('Pictory', '<a href="/tools/pictory" class="text-emerald-600 hover:underline">Pictory</a>')

    if category in CATEGORY_LINKS:
        category_link = CATEGORY_LINKS[category]
        content += f'<p>Looking for more {category.lower()} tools? Check out our <a href=\"{category_link}\" class=\"text-emerald-600 hover:underline\">{category} AI tools collection</a>.</p>'
    
    return content

json_path = os.path.join(SCRIPT_DIR, 'data', 'blog-posts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    blogs = json.load(f)

modified_count = 0
for blog in blogs:
    original_length = len(blog.get('content', ''))
    blog['content'] = add_internal_links(blog.get('content', ''), blog.get('category', ''))
    if len(blog['content']) != original_length:
        modified_count += 1
        print(f"Post {blog['id']}: Added internal links")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(blogs, f, ensure_ascii=False, indent=2)

print(f"\nModified {modified_count} blog posts with internal links")