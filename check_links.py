#!/usr/bin/env python3
import json
import os
from urllib.parse import urlparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def validate_url(url):
    if not url:
        return False, "Empty URL"
    try:
        result = urlparse(url)
        if not result.scheme:
            return False, "Missing scheme (http/https)"
        if result.scheme not in ['http', 'https']:
            return False, f"Invalid scheme: {result.scheme}"
        if not result.netloc:
            return False, "Missing domain"
        return True, "Valid"
    except Exception as e:
        return False, str(e)

def check_url_patterns(url):
    issues = []
    if 'example.com' in url or 'test.com' in url:
        issues.append("Contains placeholder domain")
    if 'rytr.sa' in url:
        issues.append("Old rytr.sa redirect URL - should update to rytr.me")
    if url.startswith('http://'):
        issues.append("Uses HTTP instead of HTTPS")
    return issues

json_path = os.path.join(SCRIPT_DIR, 'data', 'tools.json')
with open(json_path, 'r', encoding='utf-8') as f:
    tools = json.load(f)

report_lines = []
report_lines.append("# Link Health Report\n")
report_lines.append("Generated: 2026-05-21\n")
report_lines.append(f"Total tools checked: {len(tools)}\n")
report_lines.append("---\n\n")

valid_count = 0
issue_count = 0
issues_list = []

for tool in tools:
    tool_id = tool.get('id')
    tool_name = tool.get('name', 'Unknown')
    url = tool.get('url', '')

    is_valid, status = validate_url(url)
    pattern_issues = check_url_patterns(url)

    if is_valid and not pattern_issues:
        valid_count += 1
    else:
        issue_count += 1
        issues_list.append({
            'id': tool_id,
            'name': tool_name,
            'url': url,
            'status': status,
            'issues': pattern_issues
        })

report_lines.append(f"## Summary\n")
report_lines.append(f"- **Valid URLs**: {valid_count}\n")
report_lines.append(f"- **URLs with issues**: {issue_count}\n")
report_lines.append(f"- **Success rate**: {valid_count/len(tools)*100:.1f}%\n\n")

if issues_list:
    report_lines.append("## URLs Requiring Attention\n\n")
    for item in issues_list:
        report_lines.append(f"### {item['name']} (ID: {item['id']})\n")
        report_lines.append(f"- **Current URL**: `{item['url']}`\n")
        report_lines.append(f"- **Status**: {item['status']}\n")
        if item['issues']:
            report_lines.append(f"- **Issues**:\n")
            for issue in item['issues']:
                report_lines.append(f"  - {issue}\n")
        report_lines.append("\n")

report_lines.append("## Recommendations\n\n")
report_lines.append("1. **Update rytr.sa redirects**: Several tools use the old `rytr.sa` URL which redirects to rytr.me. Update to the direct URL.\n")
report_lines.append("2. **Verify external links**: Due to network limitations, actual HTTP checks were not performed. For production, verify each link manually or via a dedicated link checking service.\n")
report_lines.append("3. **Consider adding URL validation** to the data entry process to catch issues early.\n")

report_content = '\n'.join(report_lines)
report_path = os.path.join(SCRIPT_DIR, 'link_health_report.md')
with open(report_path, 'w', encoding='utf-8') as f:
    f.write(report_content)

print(f"Link health report generated!")
print(f"Valid URLs: {valid_count}/{len(tools)}")
print(f"URLs with issues: {issue_count}")
print(f"Report saved to: link_health_report.md")