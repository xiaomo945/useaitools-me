#!/usr/bin/env python3
import json
import re
from collections import defaultdict

BLOG_FILE = 'data/blog-posts.json'

def main():
    with open(BLOG_FILE, 'r') as f:
        data = json.load(f)

    # Build a map of category to articles
    category_map = defaultdict(list)
    for post in data:
        category_map[post['category']].append(post)

    # Find island posts (0 inbound links)
    link_pattern = re.compile(r'\[\[link:/blog/([^|\]]+)\|([^\]]+)\]\]')
    inbound_counts = defaultdict(int)

    for post in data:
        for match in link_pattern.finditer(post['content']):
            target_slug = match.group(1)
            inbound_counts[target_slug] += 1

    island_posts = [p for p in data if inbound_counts.get(p['slug'], 0) == 0]

    print(f"Found {len(island_posts)} island posts with 0 inbound links")

    # For each island post, find articles from same category and add internal links
    updated_count = 0
    processed_islands = []
    
    for island in island_posts[:15]:  # Process top 15 island posts
        target_slug = island['slug']
        target_category = island['category']
        target_title = island['title']
        
        # Find articles from same category that are not island posts
        candidates = [
            p for p in category_map[target_category] 
            if p['slug'] != target_slug and inbound_counts.get(p['slug'], 0) > 0
        ]
        
        if candidates and len(processed_islands) < 10:
            # Pick up to 3 articles to add links from
            links_added = []
            for candidate in candidates[:3]:
                if target_slug not in candidate['content']:
                    # Create link text from target title
                    link_text = target_title.split(':')[0][:60]
                    link = f"[[link:/blog/{target_slug}|{link_text}]]"
                    
                    # Insert link after first section break
                    content = candidate['content']
                    sections = content.split('\n---\n')
                    
                    if len(sections) >= 2:
                        insert_pos = len(sections[0]) + 5
                        candidate['content'] = content[:insert_pos] + f"\n\nFor more insights, check out our guide: {link}\n" + content[insert_pos:]
                        links_added.append(candidate['title'])
                        updated_count += 1
            
            if links_added:
                processed_islands.append({
                    'title': target_title,
                    'slug': target_slug,
                    'added_to': links_added
                })

    print(f"\nAdded internal links to {updated_count} articles")
    print(f"Processed {len(processed_islands)} island posts")
    
    # Save updated data
    with open(BLOG_FILE, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved updated {BLOG_FILE}")

    # Print summary
    print("\n📝 Summary of changes:")
    for item in processed_islands:
        print(f"\n  → {item['title']}")
        for added_to in item['added_to']:
            print(f"      Added link in: {added_to[:60]}...")

if __name__ == '__main__':
    main()
