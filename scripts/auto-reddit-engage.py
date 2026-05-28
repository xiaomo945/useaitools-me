#!/usr/bin/env python3
"""
Reddit Automation Engagement Script
Monitors relevant subreddits for AI tool recommendations requests
Generates helpful response drafts
"""

import json
import time
import random
from datetime import datetime
from pathlib import Path

# Define key subreddits to monitor
TARGET_SUBREDDITS = [
    "aitools",
    "SideProject",
    "Productivity",
    "ArtificialIntelligence",
    "ChatGPT",
    "DigitalMarketing",
    "ContentCreation",
    "Freelance",
    "SmallBusiness",
    "Entrepreneur"
]

# Keywords that indicate a request for recommendations
TRIGGER_KEYWORDS = [
    "best ai", "ai tool", "recommend", "what ai", "which ai",
    "looking for ai", "any ai", "ai recommendation", "ai tool for",
    "ai tools", "best tool", "which tool", "tool recommendation"
]

# Load tool data
def load_tools():
    try:
        tools_path = Path(__file__).parent.parent / "data" / "tools.json"
        with open(tools_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Could not load tools: {e}")
        return []

# Get category tools
def get_category_tools(tools, category):
    return [t for t in tools if t.get("category") == category][:5]

# Generate a helpful response draft
def generate_response_draft(post_title, post_content, tools):
    # Try to detect intent
    detected_categories = []
    keywords_mentioned = []
    
    category_keywords = {
        "Writing": ["write", "writing", "essay", "blog", "content", "copy", "text"],
        "Image": ["image", "art", "design", "picture", "generate", "drawing"],
        "Video": ["video", "edit", "youtube", "tiktok", "film"],
        "Audio": ["audio", "voice", "music", "podcast", "sound"],
        "Productivity": ["productivity", "automate", "task", "workflow", "time"],
        "Code": ["code", "programming", "developer", "coding", "software"],
    }
    
    for cat, keywords in category_keywords.items():
        if any(kw in post_title.lower() or kw in post_content.lower() for kw in keywords):
            detected_categories.append(cat)
    
    if not detected_categories:
        detected_categories = ["Writing", "Image", "Productivity"]
    
    # Build response
    response = []
    response.append("Hey! Great question. I've been testing various AI tools lately and have some recommendations for you:\n")
    
    for cat in detected_categories[:3]:
        cat_tools = get_category_tools(tools, cat)
        if cat_tools:
            response.append(f"\n**For {cat}:**")
            for tool in cat_tools[:3]:
                response.append(f"- **{tool['name']}** - {tool.get('description_en', tool.get('description', '')[:100])}")
                response.append(f"  • Rating: {tool.get('rating', 'N/A')}/5 ({tool.get('rating_count', 0)} reviews)")
                response.append(f"  • Pricing: {tool.get('pricing', 'N/A')}")
                response.append(f"  • Best for: {', '.join(tool.get('best_for', []))}")
    
    response.append("\n---")
    response.append("\n💡 **Quick Tip:** Most tools offer free trials - test 2-3 to see what fits your workflow best!")
    response.append("\nHope that helps! Let me know if you have specific questions about any of these.")
    
    return {
        "detected_categories": detected_categories,
        "response": "\n".join(response),
        "tools_mentioned": [t["name"] for t in tools if t["category"] in detected_categories][:6]
    }

# Simulate monitoring (replace with real API calls)
def simulate_monitoring(tools):
    print("🔍 Starting Reddit monitoring simulation...")
    print(f"📊 Monitoring {len(TARGET_SUBREDDITS)} subreddits")
    print(f"🔑 Trigger keywords: {', '.join(TRIGGER_KEYWORDS[:5])}...")
    print("-" * 80)
    
    # Simulated post examples
    simulated_posts = [
        {
            "title": "Looking for best AI writing tool for blog posts",
            "content": "Hey everyone, I need recommendations for a good AI writing tool to help with blog content.",
            "subreddit": "ContentCreation",
            "score": 24,
            "comments": 12,
            "time_ago": "2 hours ago"
        },
        {
            "title": "What's the best AI image generator in 2026?",
            "content": "I've used Midjourney before but want to see what alternatives are out there now.",
            "subreddit": "ai",
            "score": 45,
            "comments": 67,
            "time_ago": "4 hours ago"
        },
        {
            "title": "Any good AI productivity tools to automate tasks?",
            "content": "Looking to automate some of my repetitive work tasks.",
            "subreddit": "Productivity",
            "score": 18,
            "comments": 8,
            "time_ago": "30 minutes ago"
        },
        {
            "title": "Best AI for video editing and content creation?",
            "content": "Want to speed up my video editing workflow. Any suggestions?",
            "subreddit": "SideProject",
            "score": 32,
            "comments": 15,
            "time_ago": "1 hour ago"
        }
    ]
    
    drafts = []
    for post in simulated_posts:
        # Check if it matches our triggers
        has_trigger = any(kw.lower() in post["title"].lower() or kw.lower() in post["content"].lower() 
                         for kw in TRIGGER_KEYWORDS)
        
        if has_trigger:
            print(f"\n✅ Found potential post in r/{post['subreddit']}!")
            print(f"   📝 Title: {post['title']}")
            print(f"   ⏰ {post['time_ago']} | 👍 {post['score']} | 💬 {post['comments']}")
            
            draft = generate_response_draft(post["title"], post["content"], tools)
            draft["post"] = post
            draft["generated_at"] = datetime.now().isoformat()
            drafts.append(draft)
            
            print(f"   🎯 Detected categories: {', '.join(draft['detected_categories'])}")
            print(f"   🔧 Tools to mention: {', '.join(draft['tools_mentioned'])}")
        else:
            print(f"\n⏭️ No trigger match in r/{post['subreddit']}: {post['title'][:60]}...")
    
    return drafts

# Save drafts to file
def save_drafts(drafts):
    tmp_dir = Path(__file__).parent.parent / ".tmp"
    tmp_dir.mkdir(exist_ok=True)
    
    output_path = tmp_dir / "reddit-replies.md"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# Reddit Response Drafts\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n\n")
        f.write("---\n\n")
        
        for i, draft in enumerate(drafts, 1):
            post = draft["post"]
            f.write(f"## Draft {i}: r/{post['subreddit']}\n\n")
            f.write(f"**Original Post:**\n")
            f.write(f"**Title:** {post['title']}\n")
            f.write(f"**Posted:** {post['time_ago']} | 👍 {post['score']} | 💬 {post['comments']}\n\n")
            f.write(f"**Detected Categories:** {', '.join(draft['detected_categories'])}\n\n")
            f.write(f"**Response Draft:**\n\n")
            f.write(draft["response"])
            f.write("\n\n---\n\n")
    
    print(f"\n💾 Saved {len(drafts)} response drafts to: {output_path}")
    return output_path

def main():
    print("🤖 Reddit Automation Engagement Script")
    print("=" * 80)
    
    tools = load_tools()
    if not tools:
        print("❌ No tools data found, exiting")
        return
    
    print(f"📦 Loaded {len(tools)} tools from database")
    print("-" * 80)
    
    drafts = simulate_monitoring(tools)
    
    if drafts:
        save_drafts(drafts)
        print(f"\n✅ Done! Review the drafts in .tmp/reddit-replies.md before posting.")
    else:
        print("\n⚠️ No matching posts found in simulation.")

if __name__ == "__main__":
    main()
