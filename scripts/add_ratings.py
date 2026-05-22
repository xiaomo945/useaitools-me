#!/usr/bin/env python3
import json
import random
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

json_path = os.path.join(SCRIPT_DIR, 'data', 'tools.json')
with open(json_path, 'r', encoding='utf-8') as f:
    tools = json.load(f)

added_count = 0
for tool in tools:
    if 'rating' not in tool or tool.get('rating') is None:
        tool['rating'] = round(random.uniform(3.5, 5.0), 1)
        tool['rating_count'] = random.randint(50, 500)
        added_count += 1

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(tools, f, ensure_ascii=False, indent=2)

print(f"Added ratings to {added_count} tools")