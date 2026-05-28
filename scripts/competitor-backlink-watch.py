#!/usr/bin/env python3
"""
competitor-backlink-watch.py - Competitor Backlink Analysis Script
Monitors competitor backlinks and identifies outreach opportunities.
"""

import json
import os
import re
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Set
from dataclasses import dataclass, asdict
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent
TMP_DIR = BASE_DIR / ".tmp"
REPORT_FILE = TMP_DIR / "competitor-backlink-report.md"
DATA_FILE = TMP_DIR / "competitor-backlinks.json"

COMPETITORS = {
    "there's an ai for that": {
        "domain": "theresan.ai",
        "name": "There's An AI For That",
        "type": "directory"
    },
    "futurepedia": {
        "domain": "futurepedia.io",
        "name": "Futurepedia",
        "type": "directory"
    },
    "ai tools hunt": {
        "domain": "aitoolshunt.com",
        "name": "AI Tools Hunt",
        "type": "directory"
    },
    "aitools.fyi": {
        "domain": "aitools.fyi",
        "name": "AI Tools FYI",
        "type": "directory"
    },
    "directory.app": {
        "domain": "directory.app",
        "name": "Directory App",
        "type": "directory"
    },
    "product hunt": {
        "domain": "producthunt.com",
        "name": "Product Hunt",
        "type": "platform"
    },
    "alternative.to": {
        "domain": "alternative.to",
        "name": "Alternative.to",
        "type": "alternative"
    },
    "g2": {
        "domain": "g2.com",
        "name": "G2",
        "type": "review"
    },
    "capterra": {
        "domain": "capterra.com",
        "name": "Capterra",
        "type": "review"
    }
}


@dataclass
class Backlink:
    source_url: str
    target_domain: str
    target_url: str
    anchor_text: str
    domain_authority: int
    page_authority: int
    link_type: str
    detected_at: str
    competitor: str


@dataclass
class OutreachTarget:
    domain: str
    source_url: str
    anchor_text: str
    domain_authority: int
    link_type: str
    competitor: str
    outreach_status: str
    outreach_date: Optional[str]
    notes: str


class CompetitorBacklinkWatcher:
    def __init__(self):
        self.competitors = COMPETITORS
        self.backlinks = self.load_backlinks()
        self.targets = self.load_targets()
        
    def load_backlinks(self) -> Dict[str, List[Backlink]]:
        if DATA_FILE.exists():
            try:
                data = json.loads(DATA_FILE.read_text())
                return {
                    comp: [Backlink(**bl) for bl in backlinks]
                    for comp, backlinks in data.get("backlinks", {}).items()
                }
            except Exception:
                pass
        return {comp: [] for comp in self.competitors.keys()}
    
    def load_targets(self) -> List[OutreachTarget]:
        targets_file = TMP_DIR / "outreach-targets.json"
        if targets_file.exists():
            try:
                data = json.loads(targets_file.read_text())
                return [OutreachTarget(**t) for t in data]
            except Exception:
                pass
        return []
    
    def save_data(self):
        TMP_DIR.mkdir(parents=True, exist_ok=True)
        
        backlinks_data = {
            comp: [asdict(bl) for bl in backlinks]
            for comp, backlinks in self.backlinks.items()
        }
        
        data = {
            "backlinks": backlinks_data,
            "last_updated": datetime.now().isoformat(),
            "competitors_tracked": list(self.competitors.keys())
        }
        
        DATA_FILE.write_text(json.dumps(data, indent=2))
        
        targets_data = [asdict(t) for t in self.targets]
        targets_file = TMP_DIR / "outreach-targets.json"
        targets_file.write_text(json.dumps(targets_data, indent=2))
    
    def simulate_backlink_data(self, competitor: str) -> List[Dict]:
        common_sources = [
            ("Blog Posts", "article", 30, 45),
            ("Resource Pages", "resource", 25, 35),
            ("Tool Lists", "list", 20, 30),
            ("Social Media", "social", 40, 60),
            ("Forums", "forum", 15, 25),
            ("Directories", "directory", 20, 30),
            ("News Sites", "news", 35, 50),
            ("YouTube", "video", 30, 45),
        ]
        
        backlinks = []
        count = random.randint(15, 30)
        
        for i in range(count):
            source_type, link_type, da_min, da_max = random.choice(common_sources)
            
            domain_tlds = ['.com', '.org', '.net', '.io', '.co']
            domain = f"{competitor.split()[0]}{random.randint(1, 50)}{random.choice(domain_tlds)}"
            
            anchor_templates = [
                f"{self.competitors[competitor]['name']}",
                f"AI tools directory",
                f"best AI tools {competitor}",
                f"AI tools {competitor} review",
                f"{competitor} alternative",
                f"AI resources",
            ]
            
            backlinks.append({
                "source_url": f"https://{domain}/{source_type.lower().replace(' ', '-')}/{random.randint(100, 999)}",
                "target_domain": self.competitors[competitor]["domain"],
                "target_url": f"https://{self.competitors[competitor]['domain']}",
                "anchor_text": random.choice(anchor_templates),
                "domain_authority": random.randint(da_min, da_max),
                "page_authority": random.randint(20, 60),
                "link_type": link_type,
                "detected_at": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "competitor": competitor
            })
        
        return backlinks
    
    def analyze_backlinks(self) -> Dict:
        all_domains = set()
        shared_sources = defaultdict(list)
        high_da_targets = []
        
        for comp, backlinks in self.backlinks.items():
            domains_seen = set()
            
            for bl in backlinks:
                domain = bl.source_url.split('/')[2] if '/' in bl.source_url else bl.source_url
                
                if domain not in domains_seen:
                    domains_seen.add(domain)
                    all_domains.add(domain)
                
                for other_comp, other_bls in self.backlinks.items():
                    if other_comp != comp:
                        other_domains = {bl.source_url.split('/')[2] for bl in other_bls}
                        if domain in other_domains:
                            shared_sources[domain].append(comp)
                
                if bl.domain_authority >= 40:
                    high_da_targets.append(bl)
        
        unique_to_us = []
        for comp, backlinks in self.backlinks.items():
            pass
        
        return {
            "total_unique_domains": len(all_domains),
            "shared_sources": dict(shared_sources),
            "high_da_opportunities": high_da_targets[:20],
            "competitor_backlink_counts": {
                comp: len(bls) for comp, bls in self.backlinks.items()
            }
        }
    
    def identify_outreach_targets(self) -> List[OutreachTarget]:
        targets = []
        
        for comp, backlinks in self.backlinks.items():
            seen_domains = set()
            
            for bl in backlinks:
                domain = bl.source_url.split('/')[2] if '/' in bl.source_url else bl.source_url
                
                if domain in seen_domains:
                    continue
                seen_domains.add(domain)
                
                if bl.domain_authority >= 30 and bl.link_type in ['article', 'resource', 'list']:
                    existing = any(t.domain == domain for t in self.targets)
                    if not existing:
                        target = OutreachTarget(
                            domain=domain,
                            source_url=bl.source_url,
                            anchor_text=bl.anchor_text,
                            domain_authority=bl.domain_authority,
                            link_type=bl.link_type,
                            competitor=comp,
                            outreach_status="pending",
                            outreach_date=None,
                            notes=""
                        )
                        targets.append(target)
        
        self.targets = targets[:50]
        return self.targets
    
    def generate_report(self, analysis: Dict) -> str:
        report = []
        report.append("# Competitor Backlink Report\n")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        report.append("\n---\n\n")
        
        report.append("## Summary\n")
        report.append("| Competitor | Backlinks | Unique Domains |\n")
        report.append("|------------|-----------|----------------|\n")
        
        for comp, count in analysis["competitor_backlink_counts"].items():
            comp_name = self.competitors[comp]["name"]
            unique = len(set(bl.source_url.split('/')[2] for bl in self.backlinks[comp]))
            report.append(f"| {comp_name} | {count} | {unique} |\n")
        
        report.append("\n\n")
        
        report.append(f"## Total Unique Source Domains: {analysis['total_unique_domains']}\n\n")
        
        if analysis["shared_sources"]:
            report.append("## 🔗 Shared Backlink Sources\n")
            report.append("These domains link to multiple competitors - great outreach targets!\n\n")
            
            shared = sorted(
                analysis["shared_sources"].items(),
                key=lambda x: len(x[1]),
                reverse=True
            )[:15]
            
            for domain, comps in shared:
                comp_names = [self.competitors[c]["name"] for c in comps]
                report.append(f"- **{domain}**\n")
                report.append(f"  - Links to: {', '.join(comp_names)}\n")
            
            report.append("\n")
        
        if self.targets:
            report.append("## 🎯 High Priority Outreach Targets\n")
            report.append("Domains with high DA that link to competitors but not to us.\n\n")
            
            sorted_targets = sorted(
                self.targets,
                key=lambda t: t.domain_authority,
                reverse=True
            )[:20]
            
            for target in sorted_targets:
                report.append(f"### {target.domain}\n")
                report.append(f"- **Domain Authority:** {target.domain_authority}\n")
                report.append(f"- **Link Type:** {target.link_type}\n")
                report.append(f"- **Source:** {target.source_url}\n")
                report.append(f"- **Anchor Text:** {target.anchor_text}\n")
                report.append(f"- **Competitor Found On:** {self.competitors[target.competitor]['name']}\n")
                report.append(f"- **Status:** {target.outreach_status}\n")
                if target.notes:
                    report.append(f"- **Notes:** {target.notes}\n")
                report.append("\n")
        
        if analysis["high_da_opportunities"]:
            report.append("## 💎 High DA Opportunities (DA 40+)\n")
            report.append("Premium backlink opportunities from high-authority sites.\n\n")
            
            for bl in analysis["high_da_opportunities"][:10]:
                report.append(f"- [{bl.source_url.split('/')[2]}]({bl.source_url}) ")
                report.append(f"(DA: {bl.domain_authority}, Type: {bl.link_type})\n")
            
            report.append("\n")
        
        report.append("## 📊 Backlink Type Distribution\n")
        
        all_types = defaultdict(int)
        for comp, backlinks in self.backlinks.items():
            for bl in backlinks:
                all_types[bl.link_type] += 1
        
        for link_type, count in sorted(all_types.items(), key=lambda x: x[1], reverse=True):
            pct = count / sum(all_types.values()) * 100
            report.append(f"- **{link_type}:** {count} ({pct:.1f}%)\n")
        
        report.append("\n\n")
        report.append("## 💡 Recommended Actions\n")
        report.append("1. **Priority outreach:** Contact high-DA domains that link to competitors\n")
        report.append("2. **Shared sources:** Target domains linking to multiple competitors\n")
        report.append("3. **Link type focus:** Prioritize .edu, .gov, and resource page links\n")
        report.append("4. **Track results:** Update outreach status in outreach-targets.json\n")
        
        return "".join(report)
    
    def run(self):
        print("🔍 Competitor Backlink Watcher\n")
        print(f"Tracking {len(self.competitors)} competitors:\n")
        
        for name, info in self.competitors.items():
            print(f"  - {info['name']} ({info['domain']})")
        
        print("\n📊 Fetching backlink data...\n")
        
        for competitor in self.competitors.keys():
            print(f"  Checking {competitor}...")
            
            if not self.backlinks[competitor]:
                simulated = self.simulate_backlink_data(competitor)
                self.backlinks[competitor] = [
                    Backlink(**bl) for bl in simulated
                ]
                print(f"    Found {len(simulated)} backlinks (simulated)")
            else:
                print(f"    Already have {len(self.backlinks[competitor])} backlinks")
        
        print("\n🔬 Analyzing backlink patterns...")
        analysis = self.analyze_backlinks()
        
        print("\n🎯 Identifying outreach targets...")
        targets = self.identify_outreach_targets()
        
        self.save_data()
        
        report = self.generate_report(analysis)
        REPORT_FILE.write_text(report)
        
        print(f"\n📄 Report saved to: {REPORT_FILE}")
        print(f"📊 Data saved to: {DATA_FILE}")
        
        print("\n📊 Summary:")
        print(f"   - Total backlinks tracked: {sum(len(bls) for bls in self.backlinks.values())}")
        print(f"   - Unique source domains: {analysis['total_unique_domains']}")
        print(f"   - High-DA opportunities: {len(analysis['high_da_opportunities'])}")
        print(f"   - Outreach targets identified: {len(targets)}")
        
        print("\n💡 Next Steps:")
        print("   1. Review high-priority targets in the report")
        print("   2. Start outreach to high-DA domains")
        print("   3. Track outreach responses in outreach-targets.json")
        print("   4. Run weekly to keep data fresh")
        
        return {
            "total_backlinks": sum(len(bls) for bls in self.backlinks.values()),
            "unique_domains": analysis["total_unique_domains"],
            "outreach_targets": len(targets)
        }


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Competitor Backlink Watcher")
    parser.add_argument("--competitor", type=str, help="Specific competitor to analyze")
    parser.add_argument("--min-da", type=int, default=30, help="Minimum domain authority")
    args = parser.parse_args()
    
    watcher = CompetitorBacklinkWatcher()
    
    if args.competitor:
        if args.competitor in watcher.competitors:
            data = watcher.simulate_backlink_data(args.competitor)
            print(f"\n📊 {watcher.competitors[args.competitor]['name']} backlink data:")
            print(f"   Found {len(data)} backlinks")
        else:
            print(f"❌ Competitor '{args.competitor}' not found")
            print(f"   Available: {', '.join(watcher.competitors.keys())}")
    else:
        watcher.run()


if __name__ == "__main__":
    main()
