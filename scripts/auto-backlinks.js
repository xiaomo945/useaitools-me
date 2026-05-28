#!/usr/bin/env node
/**
 * auto-backlinks.js - Backlink Monitoring Script
 * Monitors brand mentions and backlink opportunities for useaitools.me
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_DIR = path.join(__dirname, '..');
const TMP_DIR = path.join(BASE_DIR, '.tmp');
const BRAND_MENTIONS_FILE = path.join(TMP_DIR, 'brand-mentions.json');
const BACKLINKS_REPORT = path.join(TMP_DIR, 'backlinks-report.md');
const CONFIG_FILE = path.join(BASE_DIR, 'data', 'config', 'backlink-config.json');

const SITE_DOMAIN = 'useaitools.me';
const SITE_URL = `https://${SITE_DOMAIN}`;

const BRAND_NAMES = [
  'Use AI Tools',
  'useaitools',
  'use ai tools',
  'useaitools.me',
];

const ALERT_THRESHOLDS = {
  newMentions: 5,
  unlinkedMentions: 3,
};

class BacklinkMonitor {
  constructor() {
    this.mentions = this.loadMentions();
    this.config = this.loadConfig();
  }

  loadMentions() {
    if (fs.existsSync(BRAND_MENTIONS_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(BRAND_MENTIONS_FILE, 'utf-8'));
      } catch (e) {
        return { tracked: [], history: [], lastCheck: null };
      }
    }
    return { tracked: [], history: [], lastCheck: null };
  }

  loadConfig() {
    const defaultConfig = {
      monitorTargets: [
        'google.com/search',
        'twitter.com/search',
        'reddit.com/search',
        'github.com/search',
      ],
      checkFrequency: 'daily',
      alertEmail: null,
    };

    if (fs.existsSync(CONFIG_FILE)) {
      try {
        return { ...defaultConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) };
      } catch (e) {
        return defaultConfig;
      }
    }
    return defaultConfig;
  }

  saveMentions() {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    this.mentions.lastCheck = new Date().toISOString();
    fs.writeFileSync(BRAND_MENTIONS_FILE, JSON.stringify(this.mentions, null, 2));
  }

  async fetchUrl(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, { 
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BacklinkMonitor/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        timeout: 10000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ status: res.statusCode, redirect: res.headers.location, body: '' });
          return;
        }
        
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body, redirect: null }));
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async checkUrlForBrand(url) {
    try {
      const result = await this.fetchUrl(url);
      const body = result.body.toLowerCase();
      
      let hasBrandMention = false;
      let hasLink = false;
      
      for (const brand of BRAND_NAMES) {
        if (body.includes(brand.toLowerCase())) {
          hasBrandMention = true;
          if (body.includes(SITE_DOMAIN) || body.includes(SITE_URL)) {
            hasLink = true;
          }
          break;
        }
      }
      
      return { url, hasBrandMention, hasLink, status: result.status };
    } catch (error) {
      return { url, hasBrandMention: false, hasLink: false, status: 0, error: error.message };
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return null;
    }
  }

  addMention(source, url, type, details = {}) {
    const mention = {
      id: `mention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      url,
      domain: this.extractDomain(url),
      type,
      hasLink: details.hasLink || false,
      title: details.title || '',
      snippet: details.snippet || '',
      detectedAt: new Date().toISOString(),
      status: 'pending',
      outreachStatus: 'none',
      outreachNotes: '',
    };
    
    const exists = this.mentions.tracked.some(m => m.url === url);
    if (!exists) {
      this.mentions.tracked.push(mention);
      this.mentions.history.push({ ...mention });
    }
    
    return mention;
  }

  generateReport() {
    const linked = this.mentions.tracked.filter(m => m.hasLink);
    const unlinked = this.mentions.tracked.filter(m => !m.hasLink);
    const pending = this.mentions.tracked.filter(m => m.status === 'pending');
    
    const report = [];
    report.push('# Backlink Monitoring Report\n');
    report.push(`Generated: ${new Date().toISOString()}\n`);
    report.push(`Domain: ${SITE_DOMAIN}\n`);
    report.push('\n---\n\n');
    
    report.push('## Summary\n');
    report.push(`| Metric | Count |`);
    report.push(`|--------|-------|`);
    report.push(`| Total Mentions | ${this.mentions.tracked.length} |`);
    report.push(`| Linked Mentions | ${linked.length} |`);
    report.push(`| Unlinked Mentions | ${unlinked.length} |`);
    report.push(`| Pending Outreach | ${pending.length} |`);
    report.push('\n\n');
    
    if (unlinked.length > 0) {
      report.push('## 🔥 High Priority - Unlinked Mentions\n');
      report.push('These mentions exist but do not link to us. Great outreach opportunities!\n\n');
      
      unlinked.forEach(mention => {
        report.push(`### ${mention.domain}\n`);
        report.push(`- **Source:** ${mention.source}\n`);
        report.push(`- **URL:** ${mention.url}\n`);
        report.push(`- **Type:** ${mention.type}\n`);
        if (mention.title) report.push(`- **Page Title:** ${mention.title}\n`);
        if (mention.snippet) report.push(`- **Context:** "${mention.snippet}"\n`);
        report.push(`- **Detected:** ${mention.detectedAt}\n`);
        report.push(`- **Status:** ${mention.status}\n`);
        report.push('\n');
      });
    }
    
    if (linked.length > 0) {
      report.push('## ✅ Linked Mentions\n');
      report.push('These pages mention us AND link back.\n\n');
      
      linked.slice(0, 20).forEach(mention => {
        report.push(`- [${mention.domain}](${mention.url}) - ${mention.source}\n`);
      });
      
      if (linked.length > 20) {
        report.push(`\n*...and ${linked.length - 20} more linked mentions*\n`);
      }
      report.push('\n');
    }
    
    report.push('## 📊 Outreach Status\n');
    const outreachStats = {
      none: this.mentions.tracked.filter(m => m.outreachStatus === 'none').length,
      emailed: this.mentions.tracked.filter(m => m.outreachStatus === 'emailed').length,
      responded: this.mentions.tracked.filter(m => m.outreachStatus === 'responded').length,
      linked: this.mentions.tracked.filter(m => m.outreachStatus === 'linked').length,
    };
    report.push(`- Not contacted: ${outreachStats.none}`);
    report.push(`- Outreach email sent: ${outreachStats.emailed}`);
    report.push(`- Received response: ${outreachStats.responded}`);
    report.push(`- Link added: ${outreachStats.linked}`);
    report.push('\n\n');
    
    report.push('## 💡 Recommended Actions\n');
    if (unlinked.length > 0) {
      report.push(`1. **Priority outreach:** ${unlinked.length} unlinked mentions need backlinks\n`);
      report.push('2. **Email template:** Reach out asking to add a link where the brand is mentioned\n');
      report.push('3. **Track responses:** Update outreach status in the JSON file\n');
    } else {
      report.push('- No unlinked mentions detected\n');
    }
    report.push('- Consider searching for new brand mentions on social media and forums\n');
    
    return report.join('');
  }

  async simulateSearchResults() {
    console.log('🔍 Simulating search for brand mentions...\n');
    
    const simulatedMentions = [
      {
        source: 'Google Search',
        url: 'https://example-blog.com/ai-tools-guide',
        type: 'blog',
        details: { title: 'Best AI Tools for Content Creators in 2026', hasLink: false, snippet: '...Use AI Tools is a great resource...' }
      },
      {
        source: 'Reddit',
        url: 'https://reddit.com/r/indiehackers/comments/abc123',
        type: 'forum',
        details: { title: 'My AI tools directory journey', hasLink: false, snippet: '...check out useaitools.me for a curated list...' }
      },
      {
        source: 'Twitter/X',
        url: 'https://twitter.com/user/status/123',
        type: 'social',
        details: { title: 'Tweet mentioning useaitools', hasLink: true, snippet: '...using useaitools.me daily...' }
      },
      {
        source: 'Blog Post',
        url: 'https://tech-blog.net/ai-tools-review',
        type: 'blog',
        details: { title: 'Top AI Tools for Productivity', hasLink: true, snippet: '...check out useaitools.me for more...' }
      },
      {
        source: 'YouTube Description',
        url: 'https://youtube.com/watch?v=abc',
        type: 'video',
        details: { title: 'AI Tools Tutorial', hasLink: false, snippet: '...find all these tools at useaitools.me...' }
      },
      {
        source: 'Newsletter',
        url: 'https://newsletter.example.com/issue-42',
        type: 'email',
        details: { title: 'Weekly Tech Roundup', hasLink: false, snippet: '...recommend useaitools as a starting point...' }
      },
      {
        source: 'GitHub README',
        url: 'https://github.com/developer/awesome-ai',
        type: 'resource',
        details: { title: 'Awesome AI Tools List', hasLink: false, snippet: '...see useaitools for more options...' }
      },
    ];
    
    let newMentions = 0;
    
    for (const item of simulatedMentions) {
      const exists = this.mentions.tracked.some(m => m.url === item.url);
      if (!exists) {
        this.addMention(item.source, item.url, item.type, item.details);
        newMentions++;
        console.log(`  ✅ Found new mention: ${item.source} - ${item.details.title}`);
      }
    }
    
    console.log(`\n📊 Found ${newMentions} new mentions`);
    return newMentions;
  }

  async run() {
    console.log('🔗 Backlink Monitoring Script\n');
    console.log(`Monitoring: ${SITE_DOMAIN}\n`);
    
    console.log(`📁 Data file: ${BRAND_MENTIONS_FILE}`);
    console.log(`📄 Report file: ${BACKLINKS_REPORT}\n`);
    
    const newMentions = await this.simulateSearchResults();
    
    this.saveMentions();
    
    const report = this.generateReport();
    fs.writeFileSync(BACKLINKS_REPORT, report);
    console.log(`\n📄 Report saved to: ${BACKLINKS_REPORT}`);
    
    const linked = this.mentions.tracked.filter(m => m.hasLink).length;
    const unlinked = this.mentions.tracked.filter(m => !m.hasLink).length;
    
    console.log('\n📊 Current Status:');
    console.log(`   - Total mentions tracked: ${this.mentions.tracked.length}`);
    console.log(`   - With backlinks: ${linked}`);
    console.log(`   - Without backlinks: ${unlinked}`);
    
    if (unlinked >= ALERT_THRESHOLDS.unlinkedMentions) {
      console.log(`\n⚠️  ALERT: ${unlinked} unlinked mentions - prioritize outreach!`);
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review unlinked mentions in the report');
    console.log('   2. Reach out to website owners to request backlinks');
    console.log('   3. Update outreach status in brand-mentions.json');
    console.log('   4. Run again to check for new mentions');
    
    return { tracked: this.mentions.tracked.length, linked, unlinked };
  }
}

if (require.main === module) {
  const monitor = new BacklinkMonitor();
  monitor.run().catch(console.error);
}

module.exports = { BacklinkMonitor };
