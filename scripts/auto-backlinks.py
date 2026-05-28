#!/usr/bin/env python3
"""
Backlink Monitoring Script
Monitors web for brand mentions, distinguishes linked vs unlinked
Generates outreach opportunities
"""

import json
from datetime import datetime
from pathlib import Path

def load_data():
    """Load our data sources"""
    try:
        tools_path = Path(__file__).parent.parent / "data" / "tools.json"
        with open(tools_path, "r", encoding="utf-8") as f:
            tools = json.load(f)
        return tools
    except Exception as e:
        print(f"⚠️ Could not load tools: {e}")
        return []

def simulate_backlink_discovery(tools):
    """Simulate backlink discovery (replace with real web crawler)"""
    print("🔍 Simulating web discovery for brand mentions...")
    print("-" * 80)
    
    # Simulated mentions
    simulated_mentions = [
        {
            "source": "Tech Blog",
            "url": "https://example.com/ai-tools-review",
            "tool_name": "Rytr",
            "has_link": True,
            "link_url": "https://rytr.me",
            "is_affiliate": False,
            "mention_context": "Rytr is one of the best AI writing tools available today for content creators.",
            "domain_authority": 65,
            "discovered_date": datetime.now().isoformat()
        },
        {
            "source": "Reddit Comment",
            "url": "https://reddit.com/r/ai/comments/abc123",
            "tool_name": "Midjourney",
            "has_link": False,
            "link_url": None,
            "is_affiliate": False,
            "mention_context": "Midjourney makes amazing AI art, but it's hard to use sometimes.",
            "domain_authority": 95,
            "discovered_date": datetime.now().isoformat()
        },
        {
            "source": "YouTube Description",
            "url": "https://youtube.com/watch?v=xyz789",
            "tool_name": "VEED.io",
            "has_link": True,
            "link_url": "https://veed.io",
            "is_affiliate": False,
            "mention_context": "I use VEED.io for all my video editing needs these days.",
            "domain_authority": 100,
            "discovered_date": datetime.now().isoformat()
        },
        {
            "source": "Twitter Thread",
            "url": "https://twitter.com/user/status/456",
            "tool_name": "ChatGPT",
            "has_link": False,
            "link_url": None,
            "is_affiliate": False,
            "mention_context": "ChatGPT is great, but sometimes I need better writing output.",
            "domain_authority": 100,
            "discovered_date": datetime.now().isoformat()
        },
        {
            "source": "AI Directory",
            "url": "https://ai-directory.example.com/tools",
            "tool_name": "Jasper",
            "has_link": True,
            "link_url": "https://jasper.ai",
            "is_affiliate": False,
            "mention_context": "Our top pick for professional writing: Jasper",
            "domain_authority": 42,
            "discovered_date": datetime.now().isoformat()
        },
        {
            "source": "Medium Article",
            "url": "https://medium.com/@author/ai-tools",
            "tool_name": "Notion AI",
            "has_link": False,
            "link_url": None,
            "is_affiliate": False,
            "mention_context": "Notion AI helps organize my notes and workflows.",
            "domain_authority": 93,
            "discovered_date": datetime.now().isoformat()
        }
    ]
    
    return simulated_mentions

def analyze_opportunities(mentions, tools):
    """Analyze mentions for outreach opportunities"""
    print("\n📊 Analyzing backlink opportunities...")
    print("-" * 80)
    
    linked_count = sum(1 for m in mentions if m["has_link"])
    unlinked_count = len(mentions) - linked_count
    
    print(f"\n📈 Total mentions found: {len(mentions)}")
    print(f"✅ Already linked: {linked_count}")
    print(f"🎯 Unlinked mentions (outreach targets): {unlinked_count}")
    
    opportunities = []
    for mention in mentions:
        if not mention["has_link"]:
            tool_info = next((t for t in tools if t["name"].lower() == mention["tool_name"].lower()), None)
            
            if tool_info:
                opportunity = {
                    **mention,
                    "opportunity_type": "unlinked_mention",
                    "priority": "high" if mention["domain_authority"] >= 50 else "medium",
                    "suggested_action": "Reach out and request a link",
                    "suggested_anchor_text": mention["tool_name"],
                    "our_link": f"https://useaitools.me/tools/{tool_info['id']}"
                }
                opportunities.append(opportunity)
                print(f"\n🎯 High-value opportunity: {mention['tool_name']} on {mention['source']}")
                print(f"   DA: {mention['domain_authority']} | Priority: {opportunity['priority']}")
                print(f"   URL: {mention['url']}")
                print(f"   Mention: {mention['mention_context']}")
    
    return opportunities

def save_report(mentions, opportunities):
    """Save backlink report"""
    tmp_dir = Path(__file__).parent.parent / ".tmp"
    tmp_dir.mkdir(exist_ok=True)
    
    report_path = tmp_dir / "backlink-report.json"
    report = {
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "total_mentions": len(mentions),
            "linked_mentions": sum(1 for m in mentions if m["has_link"]),
            "unlinked_mentions": sum(1 for m in mentions if not m["has_link"]),
            "opportunities_count": len(opportunities)
        },
        "all_mentions": mentions,
        "opportunities": opportunities
    }
    
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Report saved to: {report_path}")
    
    # Also save as markdown
    md_path = tmp_dir / "backlink-report.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# Backlink Monitoring Report\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n\n")
        f.write("## Summary\n")
        f.write(f"- **Total mentions:** {len(mentions)}\n")
        f.write(f"- **Linked:** {sum(1 for m in mentions if m['has_link'])}\n")
        f.write(f"- **Unlinked:** {sum(1 for m in mentions if not m['has_link'])}\n")
        f.write(f"- **Opportunities:** {len(opportunities)}\n\n")
        
        f.write("## 🎯 Outreach Opportunities\n\n")
        for opp in opportunities:
            f.write(f"### {opp['tool_name']} on {opp['source']}\n")
            f.write(f"- **URL:** {opp['url']}\n")
            f.write(f"- **DA:** {opp['domain_authority']}\n")
            f.write(f"- **Priority:** {opp['priority']}\n")
            f.write(f"- **Action:** {opp['suggested_action']}\n")
            f.write(f"- **Suggested link:** {opp['our_link']}\n")
            f.write(f"- **Context:** {opp['mention_context']}\n\n")
    
    print(f"💾 Markdown report saved to: {md_path}")
    return report_path

def main():
    print("🔗 Backlink Monitoring & Outreach Script")
    print("=" * 80)
    
    tools = load_data()
    if not tools:
        print("❌ No tools data found, exiting")
        return
    
    print(f"📦 Loaded {len(tools)} tools from database")
    print("-" * 80)
    
    mentions = simulate_backlink_discovery(tools)
    opportunities = analyze_opportunities(mentions, tools)
    save_report(mentions, opportunities)
    
    print("\n✅ Done! Review the reports in the .tmp directory.")

if __name__ == "__main__":
    main()
