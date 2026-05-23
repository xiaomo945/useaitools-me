
import json
import os
import shutil

# Read the original file
with open('data/blog-posts-backup.json', 'r', encoding='utf-8') as f:
    blog_posts = json.load(f)

# Create directory
output_dir = 'data/blog-posts'
os.makedirs(output_dir, exist_ok=True)

print(f"Total blog posts to split: {len(blog_posts)}")

# Create index file (WITH images!)
index = []
for post in blog_posts:
    index.append({
        'id': post['id'],
        'title': post['title'],
        'slug': post['slug'],
        'date': post['date'],
        'category': post['category'],
        'description': post['description'],
        'images': post.get('images')  # Include images!
    })

with open('data/blog-index.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print("✅ Blog index file created")

# Create individual files for each post
for post in blog_posts:
    file_path = os.path.join(output_dir, f"{post['id']}.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(post, f, ensure_ascii=False, indent=2)
    print(f"✅ Created post {post['id']}: {post['title']}")

# Rename original file as backup (if not already done)
if os.path.exists('data/blog-posts.json'):
    shutil.move('data/blog-posts.json', 'data/blog-posts-backup.json')

print("\n🎉 All tasks completed successfully!")
