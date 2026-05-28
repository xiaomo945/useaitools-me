#!/usr/bin/env python3
"""
Competitor Backlink Watcher
Monitors competitors' new backlinks weekly
Generates target list for outreach
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

# Define main competitors to monitor
COMPETITORS = [
    {
        "name": "There's An AI For That",
        "domain": "theresanaiforthat.com",
        "description": "Leading AI tools directory"
    },
    {
        "name": "Futurepedia",
        "domain": "futurepedia.io",
        "description": "Popular AI tools database"
    },
    {
        "name": "AI Tool Hunt",
        "domain": "aitoolhunt.com",
        "description": "AI tools discovery platform"
    },
    {
        "name": "Product Hunt",
        "domain": "producthunt.com",
        "description": "Product discovery platform"
    }
]

def simulate_competitor_backlinks():
    """Simulate competitor backlink discovery (replace with real data)"""
    print("🔍 Simulating competitor backlink monitoring...")
    print("-" * 80)
    
    all_backlinks = []
    
    for competitor in COMPETITORS:
        print(f"\n📊 Checking backlinks for {competitor['name']}...")
        
        # Simulated backlinks per competitor
        competitor_links = [
            {
                "source_domain": "techcrunch.com",
                "source_url": f"https://techcrunch.com/{datetime.now().year}/best-ai-tools",
                "target_url": f"https://{competitor['domain']}",
                "anchor_text": competitor['name'],
                "domain_authority": 93,
                "page_authority": 78,
                "first_seen": (datetime.now() - timedelta(days=3)).isoformat(),
                "link_type": "dofollow",
                "topic": "AI tools"
            },
            {
                "source_domain": "medium.com",
                "source_url": "https://medium.com/@author/ai-directory",
                "target_url": f"https://{competitor['domain']}",
                "anchor_text": "AI tools directory",
                "domain_authority": 93,
                "page_authority": 45,
                "first_seen": (datetime.now() - timedelta(days=7)).isoformat(),
                "link_type": "dofollow",
                "topic": "AI tools list"
            },
            {
                "source_domain": "reddit.com",
                "source_url": "https://reddit.com/r/ai/comments/links",
                "target_url": f"https://{competitor['domain']}",
                "anchor_text": "check this out",
                "domain_authority": 95,
                "page_authority": 67,
                "first_seen": (datetime.now() - timedelta(days=2)).isoformat(),
                "link_type": "nofollow",
                "topic": "AI discussion"
            },
            {
                "source_domain": "indiehackers.com",
                "source_url": "https://indiehackers.com/post/ai-tools",
                "target_url": f"https://{competitor['domain']}",
                "anchor_text": competitor['name'],
                "domain_authority": 75,
                "page_authority": 52,
                "first_seen": (datetime.now() - timedelta(days=5)).isoformat(),
                "link_type": "dofollow",
                "topic": "Indie maker tools"
            }
        ]
        
        print(f"   ✅ Found {len(competitor_links)} backlinks")
        
        for link in competitor_links:
            all_backlinks.append({
                "competitor": competitor,
                **link
            })
    
    return all_backlinks

def analyze_competitor_backlinks(backlinks):
    """Analyze backlinks for our outreach opportunities"""
    print("\n📈 Analyzing competitor backlinks for opportunities...")
    print("-" * 80)
    
    # Group by domain authority
    high_da = [b for b in backlinks if b["domain_authority"] >= 70]
    medium_da = [b for b in backlinks if 50 <= b["domain_authority"] < 70]
    
    # Get unique source domains
    unique_domains = list({b["source_domain"] for b in backlinks})
    
    print(f"\n📊 Total backlinks analyzed: {len(backlinks)}")
    print(f"🔗 Unique source domains: {len(unique_domains)}")
    print(f"⭐ High DA (70+): {len(high_da)}")
    print(f"📈 Medium DA (50-70): {len(medium_da)}")
    
    # Generate outreach targets
    outreach_targets = []
    seen_domains = set()
    
    for backlink in sorted(backlinks, key=lambda x: -x["domain_authority"]):
        if backlink["source_domain"] not in seen_domains:
            seen_domains.add(backlink["source_domain"])
            
            target = {
                "domain": backlink["source_domain"],
                "source_url": backlink["source_url"],
                "competitor_linked": backlink["competitor"]["name"],
                "topic": backlink["topic"],
                "anchor_text_used": backlink["anchor_text"],
                "domain_authority": backlink["domain_authority"],
                "link_type": backlink["link_type"],
                "priority": "high" if backlink["domain_authority"] >= 70 else "medium",
                "outreach_tactic": "Request mention of Use AI Tools as another great resource",
                "suggested_anchor_text": "Use AI Tools",
                "suggested_link": "https://useaitools.me"
            }
            outreach_targets.append(target)
    
    print(f"\n🎯 Generated {len(outreach_targets)} outreach targets!")
    for i, target in enumerate(outreach_targets[:5], 1):
        print(f"\n{i}. {target['domain']} (DA: {target['domain_authority']})")
        print(f"   Linked to: {target['competitor_linked']}")
        print(f"   Topic: {target['topic']}")
        print(f"   Priority: {target['priority']}")
    
    return outreach_targets

def save_competitor_report(backlinks, outreach_targets):
    """Save competitor backlink report"""
    tmp_dir = Path(__file__).parent.parent / ".tmp"
    tmp_dir.mkdir(exist_ok=True)
    
    report_path = tmp_dir / "competitor-backlinks.json"
    report = {
        "generated_at": datetime.now().isoformat(),
        "period": "Last 7 days",
        "competitors": COMPETITORS,
        "summary": {
            "total_backlinks": len(backlinks),
            "unique_domains": len(list({b["source_domain"] for b in backlinks})),
            "high_da_backlinks": len([b for b in backlinks if b["domain_authority"] >= 70]),
            "outreach_targets": len(outreach_targets)
        },
        "backlinks": backlinks,
        "outreach_targets": outreach_targets
    }
    
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Competitor report saved to: {report_path}")
    
    # Markdown report
    md_path = tmp_dir / "competitor-backlink-report.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# Competitor Backlink Report\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Period: Last 7 days\n\n")
        
        f.write("## Summary\n")
        f.write(f"- **Total backlinks:** {len(backlinks)}\n")
        f.write(f"- **Unique domains:** {len(list({b['source_domain'] for b in backlinks}))}\n")
        f.write(f"- **High DA (70+):** {len([b for b in backlinks if b['domain_authority'] >= 70])}\n")
        f.write(f"- **Outreach targets:** {len(outreach_targets)}\n\n")
        
        f.write("## 🎯 Top Outreach Targets\n\n")
        for target in outreach_targets[:10]:
            f.write(f"### {target['domain']} (DA: {target['domain_authority']})\n")
            f.write(f"- **Priority:** {target['priority']}\n")
            f.write(f"- **Linked competitor:** {target['competitor_linked']}\n")
            f.write(f"- **Topic:** {target['topic']}\n")
            f.write(f"- **URL:** {target['source_url']}\n")
            f.write(f"- **Tactic:** {target['outreach_tactic']}\n\n")
    
    print(f"💾 Markdown report saved to: {md_path}")
    return report_path

def main():
    print("🔍 Competitor Backlink Watcher")
    print("=" * 80)
    
    print(f"📋 Monitoring {len(COMPETITORS)} competitors:")
    for comp in COMPETITORS:
        print(f"   • {comp['name']} ({comp['domain']})")
    print("-" * 80)
    
    backlinks = simulate_competitor_backlinks()
    outreach_targets = analyze_competitor_backlinks(backlinks)
    save_competitor_report(backlinks, outreach_targets)
    
    print("\n✅ Done! Review the reports and start outreach!")

if __name__ == "__main__":
    main()
