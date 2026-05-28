#!/usr/bin/env python3
"""
auto-reddit-engage.py - Reddit Automation Script
Monitors AI/SaaS subreddits and generates reply drafts for valuable engagement.
"""

import json
import os
import re
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

try:
    import requests
except ImportError:
    print("⚠️  requests library not installed. Install with: pip install requests")
    requests = None

BASE_DIR = Path(__file__).parent.parent
TMP_DIR = BASE_DIR / ".tmp"
REPLIES_FILE = TMP_DIR / "reddit-replies.md"
HISTORY_FILE = TMP_DIR / "reddit-history.json"
TOOLS_FILE = BASE_DIR / "data" / "tools.json"
CONFIG_FILE = BASE_DIR / "data" / "config" / "reddit-config.json"

SUBREDDITS = [
    "aitools",
    "ArtificialIntelligence",
    "SaaS",
    "indiehackers",
    "SideProject",
    "webdev",
    "Entrepreneur",
    "smallbusiness"
]

TRIGGER_KEYWORDS = [
    r"\bneed\b.*\btool\b",
    r"\blooking for\b.*\bai\b",
    r"\bbest\b.*\bai\b.*\btool\b",
    r"\btool\b.*\brecommend\b",
    r"\bwhich\b.*\bai\b",
    r"\b替代\b",
    r"\b推荐\b.*\b工具\b",
    r"\b求推荐\b",
]

TOOL_PATTERNS = {
    "writing": ["rytr", "jasper", "copy.ai", "writesonic", "grammarly", "quillbot"],
    "image": ["midjourney", "dall-e", "stable diffusion", "dallE", "canva", "leonardo"],
    "video": ["veed", "synthesia", "heygen", "pictory", "runway", "elai"],
    "audio": ["elevenlabs", "murf", "descript", "otter", "fireflies"],
    "code": ["github copilot", "cursor", "tabnine", "codeium", "amazon codewhisperer"],
    "productivity": ["notion", "chatgpt", "claude", "perplexity"],
}


@dataclass
class RedditReplyDraft:
    post_id: str
    post_title: str
    post_url: str
    subreddit: str
    trigger_keyword: str
    suggested_reply: str
    suggested_tool: Optional[str]
    timestamp: str
    status: str = "pending"
    notes: str = ""


@dataclass
class EngagementHistory:
    interactions: List[Dict]
    last_check: str
    total_interactions: int


class RedditEngagementBot:
    def __init__(self):
        self.tools = self._load_tools()
        self.history = self._load_history()
        self.generated_replies = []
        
    def _load_tools(self) -> List[Dict]:
        if not TOOLS_FILE.exists():
            return []
        try:
            return json.loads(TOOLS_FILE.read_text())
        except Exception:
            return []
    
    def _load_history(self) -> EngagementHistory:
        if not HISTORY_FILE.exists():
            return EngagementHistory([], datetime.now().isoformat(), 0)
        try:
            data = json.loads(HISTORY_FILE.read_text())
            return EngagementHistory(
                interactions=data.get("interactions", []),
                last_check=data.get("last_check", datetime.now().isoformat()),
                total_interactions=data.get("total_interactions", 0)
            )
        except Exception:
            return EngagementHistory([], datetime.now().isoformat(), 0)
    
    def _save_history(self):
        TMP_DIR.mkdir(parents=True, exist_ok=True)
        data = {
            "interactions": self.history.interactions[-100:],
            "last_check": datetime.now().isoformat(),
            "total_interactions": self.history.total_interactions
        }
        HISTORY_FILE.write_text(json.dumps(data, indent=2))
    
    def _save_replies(self):
        TMP_DIR.mkdir(parents=True, exist_ok=True)
        
        content = ["# Reddit Reply Drafts\n"]
        content.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        content.append(f"Total pending replies: {len(self.generated_replies)}\n")
        content.append("\n---\n\n")
        
        for i, reply in enumerate(self.generated_replies, 1):
            content.append(f"## Reply #{i}\n")
            content.append(f"**Post:** [{reply.post_title}]({reply.post_url})\n")
            content.append(f"**Subreddit:** r/{reply.subreddit}\n")
            content.append(f"**Trigger:** {reply.trigger_keyword}\n")
            if reply.suggested_tool:
                content.append(f"**Suggested Tool:** {reply.suggested_tool}\n")
            content.append(f"**Status:** {reply.status}\n")
            if reply.notes:
                content.append(f"**Notes:** {reply.notes}\n")
            content.append("\n### Suggested Reply:\n")
            content.append(f"{reply.suggested_reply}\n")
            content.append("\n---\n\n")
        
        REPLIES_FILE.write_text("\n".join(content))
        print(f"✅ Saved {len(self.generated_replies)} reply drafts to {REPLIES_FILE}")
    
    def _check_keywords(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for pattern in TRIGGER_KEYWORDS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return pattern
        return None
    
    def _identify_category(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for category, keywords in TOOL_PATTERNS.items():
            if any(kw in text_lower for kw in keywords):
                return category
        return None
    
    def _find_relevant_tools(self, category: str, count: int = 3) -> List[Dict]:
        if not category:
            return random.sample(self.tools, min(count, len(self.tools)))
        
        relevant = [t for t in self.tools if t.get("category", "").lower() == category.lower()]
        
        if len(relevant) < count:
            relevant.extend([t for t in self.tools if t not in relevant])
        
        return relevant[:count]
    
    def _generate_reply(self, post_title: str, post_body: str, category: Optional[str]) -> tuple[str, Optional[Dict]]:
        relevant_tools = self._find_relevant_tools(category) if category else self._find_relevant_tools(None)
        primary_tool = relevant_tools[0] if relevant_tools else None
        
        personal_experiences = [
            "I've been using {tool} for a while now and it's been solid.",
            "After trying quite a few options, I settled on {tool} and haven't looked back.",
            "Hands down, {tool} has been the most useful for my workflow.",
            "Just started using {tool} recently and the difference is noticeable.",
            "I've tested most of the popular options and {tool} stands out.",
        ]
        
        if not primary_tool:
            reply = f"""Hey! There are a bunch of AI tools out there depending on what you're looking to do. 

If you share more about your specific use case, I can point you in a better direction. Are you looking for writing, image generation, video editing, or something else?

In the meantime, you might find [Use AI Tools](https://useaitools.me) helpful - it's a curated directory of AI tools organized by category."""
        else:
            tool_name = primary_tool.get("name", "this tool")
            tool_url = primary_tool.get("affiliate_link") or primary_tool.get("url", "#")
            tool_category = primary_tool.get("category", "")
            
            exp_template = random.choice(personal_experiences).format(tool=tool_name)
            
            reply = f"""{exp_template}

**{tool_name}** has been my go-to for {tool_category.lower()} tasks. {primary_tool.get('description', '')[:150]}...

{'Pricing is ' + primary_tool.get('pricing', 'flexible') + ' if that helps with the decision.' if primary_tool.get('pricing') else ''}

{'They need a VPN to access it btw' if primary_tool.get('needs_vpn') else 'No VPN needed, works globally.'}

There's a good comparison of similar tools on [Use AI Tools](https://useaitools.me/{tool_category.lower()}) if you want to see more options.

Happy to help narrow it down if you share more about what you're trying to accomplish!"""
        
        return reply, primary_tool
    
    def _generate_vs_reply(self, post_title: str, post_body: str) -> tuple[str, Optional[tuple]]:
        tools_mentioned = []
        for category, keywords in TOOL_PATTERNS.items():
            for kw in keywords:
                if kw.lower() in post_title.lower() or kw.lower() in post_body.lower():
                    tools_mentioned.append((kw, category))
        
        if len(tools_mentioned) >= 2:
            tool1, cat1 = tools_mentioned[0]
            tool2, cat2 = tools_mentioned[1]
            
            reply = f"""Good question! Both **{tool1}** and **{tool2}** are solid choices in the AI tools space.

Here's my take after trying both:

**{tool1.title()}:**
- Strength: {random.choice(['Great for beginners', 'Excellent output quality', 'Good value for money', 'Strong feature set'])}
- Best for: {random.choice(['Quick tasks', 'Professional workflows', 'Budget-conscious users', 'Power users'])}

**{tool2.title()}:**
- Strength: {random.choice(['More advanced features', 'Better customization', 'Faster processing', 'More integrations'])}
- Best for: {random.choice(['Complex workflows', 'Team collaboration', 'Specific use cases', 'Advanced users'])}

My honest recommendation: {'Start with the free tiers of both and see which feels more intuitive for your workflow.' if cat1 == cat2 else 'They actually serve different use cases, so it depends on your primary need.'}

You can find a detailed comparison at [Use AI Tools](https://useaitools.me) - they've got in-depth reviews of both."""
            
            return reply, (tool1, tool2)
        
        return self._generate_reply(post_title, post_body, None)
    
    def simulate_posts(self, count: int = 5) -> List[Dict]:
        simulated_posts = [
            {
                "id": f"sim_{i}",
                "title": title,
                "body": body,
                "subreddit": sub,
                "url": f"https://reddit.com/r/{sub}/comments/sim_{i}"
            }
            for i, (title, body, sub) in enumerate([
                ("Looking for AI writing tool recommendations", 
                 "I need an AI writing assistant for blog posts and social media. Budget is around $50/month. What do you recommend?", 
                 "aitools"),
                ("Midjourney vs DALL-E 3 for concept art?", 
                 "Which one should I use for game concept art? Need something with good style consistency.", 
                 "gamedev"),
                ("Best AI tool for transcribing meetings?", 
                 "We have a lot of team meetings and I need something to transcribe and summarize them.", 
                 "SaaS"),
                ("Alternatives to Jasper for SEO content?", 
                 "Jasper is too expensive. Looking for something more budget-friendly but still good for SEO.", 
                 "indiehackers"),
                ("Need tool recommendation for YouTube thumbnails", 
                 "Want to create eye-catching thumbnails quickly. Any AI tools that help with this?", 
                 "ContentCreation"),
            ][:count])
        ]
        return simulated_posts
    
    def process_posts(self, posts: List[Dict]) -> int:
        processed = 0
        
        for post in posts:
            post_id = post.get("id", "")
            title = post.get("title", "")
            body = post.get("body", "")
            subreddit = post.get("subreddit", "")
            url = post.get("url", "")
            
            trigger = self._check_keywords(title + " " + body)
            if not trigger:
                continue
            
            category = self._identify_category(title + " " + body)
            
            if "vs" in title.lower() or "versus" in title.lower() or " vs " in title.lower():
                reply_text, tools = self._generate_vs_reply(title, body)
                tool_name = f"{tools[0]} vs {tools[1]}" if tools else None
            else:
                reply_text, primary_tool = self._generate_reply(title, body, category)
                tool_name = primary_tool.get("name") if primary_tool else None
            
            draft = RedditReplyDraft(
                post_id=post_id,
                post_title=title,
                post_url=url,
                subreddit=subreddit,
                trigger_keyword=trigger,
                suggested_reply=reply_text,
                suggested_tool=tool_name,
                timestamp=datetime.now().isoformat(),
                status="pending",
                notes=f"Simulated post - category: {category or 'general'}"
            )
            
            self.generated_replies.append(draft)
            self.history.interactions.append(asdict(draft))
            self.history.total_interactions += 1
            processed += 1
        
        return processed
    
    def run(self, simulate: bool = True, count: int = 5):
        print("🤖 Reddit Engagement Bot Starting...\n")
        print(f"📊 Loaded {len(self.tools)} tools from database")
        print(f"📝 Historical interactions: {self.history.total_interactions}")
        print(f"📁 Output files: {REPLIES_FILE}, {HISTORY_FILE}\n")
        
        if simulate or not requests:
            print("🔄 Simulating subreddit monitoring...")
            posts = self.simulate_posts(count)
        else:
            print("⚠️  Live Reddit API not implemented in this version.")
            print("   Running simulation instead...")
            posts = self.simulate_posts(count)
        
        processed = self.process_posts(posts)
        
        print(f"\n✅ Processed {processed} relevant posts")
        
        if self.generated_replies:
            self._save_replies()
        
        self._save_history()
        
        print("\n💡 Next Steps:")
        print("   1. Review generated replies in .tmp/reddit-replies.md")
        print("   2. Edit replies to add personal touch")
        print("   3. Post replies manually on Reddit")
        print("   4. Update status to 'posted' after publishing")
        
        return self.generated_replies


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Reddit Engagement Bot")
    parser.add_argument("--count", type=int, default=5, help="Number of posts to simulate")
    parser.add_argument("--no-simulate", action="store_true", help="Attempt live API (not implemented)")
    args = parser.parse_args()
    
    bot = RedditEngagementBot()
    replies = bot.run(simulate=not args.no_simulate, count=args.count)
    
    return len(replies)


if __name__ == "__main__":
    main()
