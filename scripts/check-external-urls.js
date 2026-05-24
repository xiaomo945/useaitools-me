#!/usr/bin/env node

/**
 * External URL Health Check Script
 * 
 * This script checks all external URLs in tools.json for availability.
 * It helps identify broken or redirected links that need attention.
 * 
 * Usage: node scripts/check-external-urls.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const REPORT_FILE = path.join(__dirname, '..', '.tmp', 'external-url-health-report.md');
const TIMEOUT = 5000; // 5 seconds
const CONCURRENCY = 5; // Process 5 URLs at a time
const DELAY_BETWEEN_BATCHES = 200; // Small delay between batches

// HTTP/HTTPS request wrapper with timeout
const fetchUrl = (url) => {
  return new Promise((resolve) => {
    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      resolve({ status: 'invalid', url, error: 'Invalid URL format' });
      return;
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const timeoutId = setTimeout(() => {
      resolve({ status: 'timeout', url });
    }, TIMEOUT);
    
    const req = protocol.get(url, { 
      method: 'HEAD',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'UseAItools-HealthCheck/1.0'
      }
    }, (res) => {
      clearTimeout(timeoutId);
      resolve({ 
        status: res.statusCode, 
        url,
        redirect: res.headers.location || null
      });
    });
    
    req.on('error', (err) => {
      clearTimeout(timeoutId);
      resolve({ status: 'error', url, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      clearTimeout(timeoutId);
      resolve({ status: 'timeout', url });
    });
  });
};

// Status category helper
const getStatusCategory = (status) => {
  if (status === 200) return 'success';
  if (status === 301 || status === 302) return 'redirect';
  if (status >= 300 && status < 400) return 'redirect';
  if (status === 404) return 'not_found';
  if (status === 'error' || status === 'timeout') return 'error';
  if (status >= 500) return 'server_error';
  return 'unknown';
};

// Main check function
async function checkExternalUrls() {
  console.log('🔍 Starting External URL Health Check...\n');
  
  // Read tools data
  let tools;
  try {
    const data = fs.readFileSync(TOOLS_FILE, 'utf8');
    tools = JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to read tools.json:', err.message);
    process.exit(1);
  }
  
  // Extract unique URLs
  const urls = new Map();
  tools.forEach(tool => {
    if (tool.url) {
      urls.set(tool.url, { toolId: tool.id, toolName: tool.name, type: 'main' });
    }
    if (tool.affiliate_link) {
      urls.set(tool.affiliate_link, { toolId: tool.id, toolName: tool.name, type: 'affiliate' });
    }
  });
  
  console.log(`📊 Found ${urls.size} unique URLs to check\n`);
  
  // Check all URLs with concurrency control
  const results = [];
  const urlEntries = Array.from(urls.entries());
  
  for (let i = 0; i < urlEntries.length; i += CONCURRENCY) {
    const batch = urlEntries.slice(i, i + CONCURRENCY);
    const batchNum = Math.floor(i / CONCURRENCY) + 1;
    const totalBatches = Math.ceil(urlEntries.length / CONCURRENCY);
    process.stdout.write(`\r  Batch [${batchNum}/${totalBatches}]: Checking ${batch.length} URLs...`);
    
    const batchPromises = batch.map(([url, info]) => fetchUrl(url).then(result => ({ ...result, ...info })));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
  }
  
  console.log('\n\n✅ Check complete!\n');
  
  // Categorize results
  const categorized = {
    success: results.filter(r => r.status === 200),
    redirect: results.filter(r => r.status === 301 || r.status === 302),
    not_found: results.filter(r => r.status === 404),
    server_error: results.filter(r => r.status >= 500),
    error: results.filter(r => r.status === 'error'),
    timeout: results.filter(r => r.status === 'timeout'),
    unknown: results.filter(r => !['success', 'redirect', 'not_found', 'server_error', 'error', 'timeout'].includes(getStatusCategory(r.status)))
  };
  
  // Generate report
  let report = `# External URL Health Report

Generated: ${new Date().toISOString()}

## Summary

| Status | Count |
|:---|---:|
| ✅ Working (200) | ${categorized.success.length} |
| 🔄 Redirect (301/302) | ${categorized.redirect.length} |
| ❌ Not Found (404) | ${categorized.not_found.length} |
| ⚠️ Server Error (5xx) | ${categorized.server_error.length} |
| 💥 Error | ${categorized.error.length} |
| ⏱️ Timeout | ${categorized.timeout.length} |
| **Total Checked** | **${results.length}** |

`;
  
  // Add details for problematic URLs
  if (categorized.not_found.length > 0) {
    report += `\n## ❌ Not Found URLs (404)\n\n`;
    report += `| Tool | URL | Type |\n`;
    report += `|:---|:---|:---|\n`;
    categorized.not_found.forEach(r => {
      report += `| ${r.toolName} (ID: ${r.toolId}) | \`${r.url}\` | ${r.type} |\n`;
    });
  }
  
  if (categorized.redirect.length > 0) {
    report += `\n## 🔄 Redirected URLs\n\n`;
    report += `| Tool | URL | Status | Redirect To |\n`;
    report += `|:---|:---|:---:|:---|\n`;
    categorized.redirect.forEach(r => {
      report += `| ${r.toolName} (ID: ${r.toolId}) | \`${r.url}\` | ${r.status} | ${r.redirect || 'N/A'} |\n`;
    });
  }
  
  if (categorized.server_error.length > 0) {
    report += `\n## ⚠️ Server Errors (5xx)\n\n`;
    report += `| Tool | URL | Status |\n`;
    report += `|:---|:---|:---|\n`;
    categorized.server_error.forEach(r => {
      report += `| ${r.toolName} (ID: ${r.toolId}) | \`${r.url}\` | ${r.status} |\n`;
    });
  }
  
  if (categorized.error.length > 0) {
    report += `\n## 💥 Connection Errors\n\n`;
    report += `| Tool | URL | Error |\n`;
    report += `|:---|:---|:---|\n`;
    categorized.error.forEach(r => {
      report += `| ${r.toolName} (ID: ${r.toolId}) | \`${r.url}\` | ${r.error} |\n`;
    });
  }
  
  if (categorized.timeout.length > 0) {
    report += `\n## ⏱️ Timeout URLs\n\n`;
    report += `| Tool | URL |\n`;
    report += `|:---|:---|\n`;
    categorized.timeout.forEach(r => {
      report += `| ${r.toolName} (ID: ${r.toolId}) | \`${r.url}\` |\n`;
    });
  }
  
  if (categorized.success.length > 0) {
    report += `\n## ✅ Working URLs (Sample)\n\n`;
    report += `Showing first 20 of ${categorized.success.length} working URLs:\n\n`;
    report += `| Tool | URL |\n`;
    report += `|:---|:---|\n`;
    categorized.success.slice(0, 20).forEach(r => {
      report += `| ${r.toolName} | \`${r.url}\` |\n`;
    });
  }
  
  // Write report
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  
  // Console output
  console.log(`📄 Report saved to: ${REPORT_FILE}\n`);
  
  if (categorized.not_found.length > 0) {
    console.log(`❌ ${categorized.not_found.length} URLs returned 404`);
  }
  if (categorized.redirect.length > 0) {
    console.log(`🔄 ${categorized.redirect.length} URLs have redirects`);
  }
  if (categorized.error.length > 0) {
    console.log(`💥 ${categorized.error.length} URLs had connection errors`);
  }
  if (categorized.timeout.length > 0) {
    console.log(`⏱️ ${categorized.timeout.length} URLs timed out`);
  }
  
  console.log(`\n✅ ${categorized.success.length} URLs are working correctly`);
  
  // Exit with error if any critical issues
  const criticalIssues = categorized.not_found.length + categorized.error.length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

checkExternalUrls().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
