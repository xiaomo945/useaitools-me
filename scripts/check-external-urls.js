const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const LIMIT = 50;
const TIMEOUT_MS = 5000;
const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const REPORT_DIR = path.join(__dirname, '..', '.tmp');
const REPORT_PATH = path.join(REPORT_DIR, 'external-url-health-report.md');

function checkUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URLChecker/1.0)',
      },
    };

    const req = lib.request(options, (res) => {
      // Follow one redirect manually to get the final status
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        resolve({ status: res.statusCode, location: res.headers.location });
      } else {
        resolve({ status: res.statusCode });
      }
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'timeout' });
    });

    req.on('error', (err) => {
      resolve({ status: 'error', error: err.message });
    });

    req.end();
  });
}

async function main() {
  // Ensure .tmp directory exists
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // Read tools data
  const raw = fs.readFileSync(TOOLS_PATH, 'utf-8');
  const tools = JSON.parse(raw);

  // Filter tools with a url field and limit
  const toolsToCheck = tools.filter((t) => t.url).slice(0, LIMIT);

  console.log(`Checking ${toolsToCheck.length} tool URLs (limit: ${LIMIT})...\n`);

  const results = [];

  for (const tool of toolsToCheck) {
    const result = await checkUrl(tool.url);
    results.push({
      id: tool.id,
      name: tool.name,
      url: tool.url,
      status: result.status,
      location: result.location || '',
      error: result.error || '',
    });

    const statusLabel = result.status === 'timeout' ? 'TIMEOUT' : result.status === 'error' ? `ERROR: ${result.error}` : result.status;
    process.stdout.write(`  [${results.length}/${toolsToCheck.length}] ${tool.name}: ${statusLabel}\n`);
  }

  // Categorize results
  const accessible = results.filter((r) => r.status === 200);
  const warnings = results.filter((r) => [301, 302, 303, 307, 308, 403].includes(r.status));
  const errors = results.filter((r) => [404, 500, 502, 503].includes(r.status));
  const timeouts = results.filter((r) => r.status === 'timeout');
  const networkErrors = results.filter((r) => r.status === 'error');

  const totalChecked = results.length;
  const totalAccessible = accessible.length;
  const totalWarnings = warnings.length;
  const totalErrors = errors.length + networkErrors.length;
  const totalTimeouts = timeouts.length;

  // Generate markdown report
  const lines = [];
  lines.push('# External URL Health Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push(`**Tools checked:** ${totalChecked} (limit: ${LIMIT})`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Count |');
  lines.push('|--------|-------|');
  lines.push(`| Total checked | ${totalChecked} |`);
  lines.push(`| ✅ Accessible (200) | ${totalAccessible} |`);
  lines.push(`| ⚠️ Warnings (3xx/403) | ${totalWarnings} |`);
  lines.push(`| ❌ Errors (4xx/5xx/network) | ${totalErrors} |`);
  lines.push(`| ⏱️ Timeouts | ${totalTimeouts} |`);
  lines.push('');

  // Non-200 table
  const non200 = results.filter((r) => r.status !== 200);
  if (non200.length > 0) {
    lines.push('## Tools with Non-200 Status Codes');
    lines.push('');
    lines.push('| ID | Name | Status | URL | Details |');
    lines.push('|----|------|--------|-----|---------|');
    for (const r of non200) {
      const details = r.location ? `→ ${r.location}` : r.error || '';
      lines.push(`| ${r.id} | ${r.name} | ${r.status} | ${r.url} | ${details} |`);
    }
    lines.push('');
  }

  // Timeout table
  if (timeouts.length > 0) {
    lines.push('## Tools with Timeout Errors');
    lines.push('');
    lines.push('| ID | Name | URL |');
    lines.push('|----|------|-----|');
    for (const r of timeouts) {
      lines.push(`| ${r.id} | ${r.name} | ${r.url} |`);
    }
    lines.push('');
  }

  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf-8');

  // Print summary to console
  console.log('\n--- Summary ---');
  console.log(`Total checked:  ${totalChecked}`);
  console.log(`Accessible:     ${totalAccessible}`);
  console.log(`Warnings:       ${totalWarnings}`);
  console.log(`Errors:         ${totalErrors}`);
  console.log(`Timeouts:       ${totalTimeouts}`);
  console.log(`\nReport saved to: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
