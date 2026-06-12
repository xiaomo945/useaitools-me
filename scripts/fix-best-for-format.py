#!/usr/bin/env python3
"""Fix best_for fields: convert strings to single-element arrays."""
import json

with open('data/tools.json') as f:
    tools = json.load(f)

fixed = 0
for tool in tools:
    bf = tool.get('best_for')
    if isinstance(bf, str) and bf:
        tool['best_for'] = [bf]
        fixed += 1

with open('data/tools.json', 'w') as f:
    json.dump(tools, f, indent=2, ensure_ascii=False)

print(f'Fixed {fixed} best_for fields from string to array')
print(f'Total tools: {len(tools)}')
# Verify
bad = [t for t in tools if isinstance(t.get('best_for'), str)]
print(f'Remaining string best_for: {len(bad)}')
for t in bad:
    print(f'  #{t["id"]} {t["name"]}: {t["best_for"]}')