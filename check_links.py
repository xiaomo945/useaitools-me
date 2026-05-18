#!/usr/bin/env python3
import json
import sys
import time
from urllib.parse import urlparse
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# 读取工具数据
with open('data/tools.json', 'r', encoding='utf-8') as f:
    tools = json.load(f)

print(f"开始检查 {len(tools)} 个工具的链接...")

# 准备检查结果
dead_links = []
results = []

# 设置超时和重试
TIMEOUT = 10
MAX_RETRIES = 2

def check_url(tool):
    url = tool['url']
    name = tool['name']
    tool_id = tool['id']
    
    # 检查 URL 格式
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return (tool_id, name, url, "Invalid URL format", False)
    except Exception as e:
        return (tool_id, name, url, str(e), False)
    
    # 尝试 HEAD 请求
    for attempt in range(MAX_RETRIES):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.head(url, headers=headers, timeout=TIMEOUT, allow_redirects=True)
            
            if response.status_code == 200:
                return (tool_id, name, url, "OK (200)", True)
            elif 300 <= response.status_code < 400:
                return (tool_id, name, url, f"Redirect ({response.status_code})", True)
            else:
                # HEAD 失败，尝试 GET
                try:
                    response = requests.get(url, headers=headers, timeout=TIMEOUT, allow_redirects=True, stream=True)
                    if response.status_code == 200 or 300 <= response.status_code < 400:
                        return (tool_id, name, url, f"OK via GET ({response.status_code})", True)
                except:
                    pass
                
                return (tool_id, name, url, f"Status {response.status_code}", False)
                
        except requests.exceptions.Timeout:
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
                continue
            return (tool_id, name, url, "Timeout", False)
        except requests.exceptions.ConnectionError:
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
                continue
            return (tool_id, name, url, "Connection error", False)
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
                continue
            return (tool_id, name, url, str(e), False)

# 并发检查
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(check_url, tool) for tool in tools]
    
    for i, future in enumerate(as_completed(futures), 1):
        result = future.result()
        results.append(result)
        tool_id, name, url, status, is_ok = result
        
        if not is_ok:
            dead_links.append((tool_id, name, url, status))
            print(f"❌ [{i}/{len(tools)}] {name}: {url} - {status}")
        else:
            print(f"✅ [{i}/{len(tools)}] {name}: {status}")

# 汇总结果
print("\n" + "="*80)
print("检查完成！")
print(f"✅ 正常链接: {len(tools) - len(dead_links)}")
print(f"❌ 失效链接: {len(dead_links)}")

if dead_links:
    print("\n失效链接列表：")
    print("-"*80)
    for tool_id, name, url, status in dead_links:
        print(f"ID: {tool_id} | 工具: {name}")
        print(f"  URL: {url}")
        print(f"  状态: {status}")
        print()

# 保存失效链接列表到文件
if dead_links:
    dead_links_file = 'dead_links_report.json'
    with open(dead_links_file, 'w', encoding='utf-8') as f:
        json.dump({
            'report_date': '2026-05-18',
            'total_tools': len(tools),
            'dead_links_count': len(dead_links),
            'dead_links': [
                {
                    'id': tool_id,
                    'name': name,
                    'url': url,
                    'status': status
                }
                for tool_id, name, url, status in dead_links
            ]
        }, f, ensure_ascii=False, indent=2)
    print(f"失效链接报告已保存到: {dead_links_file}")
