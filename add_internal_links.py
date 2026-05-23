import json
import re

def add_internal_links():
    # Load blog posts
    with open('/workspace/data/blog-posts.json', 'r', encoding='utf-8') as f:
        blog_posts = json.load(f)
    
    # Load tools
    with open('/workspace/data/tools.json', 'r', encoding='utf-8') as f:
        tools = json.load(f)
    
    # Group posts by category
    posts_by_category = {}
    for post in blog_posts:
        cat = post['category']
        if cat not in posts_by_category:
            posts_by_category[cat] = []
        posts_by_category[cat].append(post)
    
    # Add links to related posts
    updated_posts = []
    for post in blog_posts:
        content = post['content']
        
        # Find related posts in the same category
        related_posts = [
            p for p in posts_by_category.get(post['category'], [])
            if p['id'] != post['id']
        ][:3]
        
        # Add related posts section at the end if it doesn't exist
        if related_posts and '## Related Posts' not in content:
            related_section = '\n\n## Related Posts\n\n'
            for related in related_posts:
                related_section += f'- [[link:/blog/{related["slug"]}|{related["title"]}]]\n'
            content += related_section
        
        # Also add a few links in the body for the first 5 posts for variety
        if post['id'] <= 5 and related_posts:
            first_related = related_posts[0]
            # Find a natural place to insert a link (after a section break or paragraph)
            insert_markers = ['---\n\n', '\n\n## ']
            for marker in insert_markers:
                if marker in content:
                    link_text = f'\n\nIf you enjoyed this, you might also like [[link:/blog/{first_related["slug"]}|{first_related["title"]}]]!\n\n'
                    content = content.replace(marker, marker + link_text, 1)
                    break
        
        post['content'] = content
        updated_posts.append(post)
    
    # Now add tool links - let's link some popular tools that are not yet linked
    tools_by_category = {}
    for tool in tools:
        cat = tool['category']
        if cat not in tools_by_category:
            tools_by_category[cat] = []
        tools_by_category[cat].append(tool)
    
    # For each post, add links to relevant tools in its category
    final_posts = []
    for post in updated_posts:
        content = post['content']
        category = post['category']
        tools_to_link = tools_by_category.get(category, [])[:5]
        
        for tool in tools_to_link:
            # Check if this tool is already linked
            tool_link_pattern = rf'/tools/{tool["id"]}'
            if not re.search(tool_link_pattern, content):
                # Find a natural spot to add the link
                intro_markers = ['\n\n', '---\n\n']
                for marker in intro_markers:
                    if marker in content:
                        link_text = f'\n\nLooking for a great tool? Check out [[link:/tools/{tool["id"]}|{tool["name"]}]]!\n\n'
                        content = content.replace(marker, marker + link_text, 1)
                        break
        
        post['content'] = content
        final_posts.append(post)
    
    # Write updated content
    with open('/workspace/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(final_posts, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully updated {len(final_posts)} blog posts with internal links!")

if __name__ == "__main__":
    add_internal_links()
