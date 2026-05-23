import json
import re
from collections import defaultdict

def analyze_internal_links():
    # Load blog posts
    with open('/workspace/data/blog-posts.json', 'r', encoding='utf-8') as f:
        blog_posts = json.load(f)
    
    # Load tools
    with open('/workspace/data/tools.json', 'r', encoding='utf-8') as f:
        tools = json.load(f)
    
    # Track inbound links to each blog post
    post_inbound_links = defaultdict(int)
    post_ids = [post['id'] for post in blog_posts]
    post_slugs = {post['slug']: post for post in blog_posts}
    
    # Track tool references
    tool_references = defaultdict(int)
    tool_ids = [tool['id'] for tool in tools]
    
    # Analyze each blog post's content
    for post in blog_posts:
        content = post['content']
        
        # Find all links to other blog posts
        # Link pattern: [[link:/blog/slug|text]] or <a href="/blog/slug">
        for match in re.finditer(r'\[\[link:/blog/([^|\]]+)|\[link:/tools/\d+\]|<a\s+[^>]*href="([^"]*)"', content):
            link = match.group(1) or match.group(2)
            
            # Check if it's a blog post link
            if link and '/blog/' in link:
                slug = link.split('/blog/')[-1]
                if slug in post_slugs:
                    post_inbound_links[post_slugs[slug]['id']] += 1
            
            # Check if it's a tool link
            if link and '/tools/' in link:
                try:
                    tool_id = int(link.split('/tools/')[-1].split('/')[0].split('"')[0].split('|')[0])
                    if tool_id in tool_ids:
                        tool_references[tool_id] += 1
                except ValueError:
                    pass
    
    # Find orphan posts (inbound links = 0)
    orphan_posts = [
        post for post in blog_posts 
        if post_inbound_links.get(post['id'], 0) == 0
    ]
    
    # Sort orphan posts by date (oldest first)
    orphan_posts.sort(key=lambda x: x['date'])
    
    # Find orphan tools (0 references)
    orphan_tools = [
        tool for tool in tools
        if tool_references.get(tool['id'], 0) == 0
    ]
    
    # Sort orphan tools by whether they have affiliate links (prioritize those that do)
    orphan_tools.sort(key=lambda x: (not x.get('affiliate_link', ''), x['id']))
    
    # Generate report
    print("=== INTERNAL LINK HEALTH REPORT ===\n")
    
    print(f"Total blog posts: {len(blog_posts)}")
    print(f"Orphan posts (0 inbound links): {len(orphan_posts)}")
    print(f"Total tools: {len(tools)}")
    print(f"Orphan tools (0 references): {len(orphan_tools)}")
    
    if orphan_posts:
        print("\n--- ORPHAN POSTS ---")
        for post in orphan_posts[:10]:
            print(f"ID {post['id']}: {post['title']} ({post['date']})")
    
    if orphan_tools:
        print("\n--- ORPHAN TOOLS ---")
        for tool in orphan_tools[:10]:
            affiliate = " (has affiliate link)" if tool.get('affiliate_link', '') else ""
            print(f"ID {tool['id']}: {tool['name']} ({tool['category']}){affiliate}")
    
    return {
        'orphan_posts': orphan_posts,
        'orphan_tools': orphan_tools,
        'post_inbound_links': post_inbound_links,
        'tool_references': tool_references
    }

if __name__ == "__main__":
    results = analyze_internal_links()
