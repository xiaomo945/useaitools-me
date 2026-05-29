#!/usr/bin/env python3
"""
GSC 自动提交脚本
自动提交新博客文章到 Google Search Console
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

# 尝试导入Google API库
try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    HAS_GOOGLE_API = True
except ImportError:
    HAS_GOOGLE_API = False
    print("⚠️ Google API 库未安装，请运行: pip install google-auth google-api-python-client")

# 配置
SITE_URL = "https://useaitools.me"
MAX_DAILY_SUBMISSIONS = 200
LOG_DIR = Path(".tmp")
LOG_FILE = LOG_DIR / "gsc-submit-log.md"
CREDENTIALS_FILE = "credentials.json"
DATA_DIR = Path("data/blog-posts")


def init_log():
    """初始化日志文件"""
    LOG_DIR.mkdir(exist_ok=True)
    
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write("# GSC 自动提交日志\n\n")
            f.write("| 日期 | 提交数量 | 状态 |\n")
            f.write("|------|---------|------|\n")


def get_recent_articles(days=1):
    """获取最近N天内新增的文章"""
    cutoff_date = datetime.now() - timedelta(days=days)
    recent_articles = []
    
    if not DATA_DIR.exists():
        print(f"⚠️ 数据目录不存在: {DATA_DIR}")
        return recent_articles
    
    for file_path in DATA_DIR.glob("*.json"):
        try:
            file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
            if file_mtime >= cutoff_date:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if "slug" in data:
                        recent_articles.append({
                            "file": file_path.name,
                            "slug": data["slug"],
                            "title": data.get("title", ""),
                            "date": data.get("date", ""),
                            "mtime": file_mtime
                        })
        except Exception as e:
            print(f"⚠️ 读取文件失败 {file_path}: {e}")
    
    recent_articles.sort(key=lambda x: x["mtime"], reverse=True)
    return recent_articles


def submit_url_to_gsc(url):
    """提交单个URL到Google Search Console"""
    if not HAS_GOOGLE_API:
        print(f"⚠️ 跳过 {url} (Google API 库未安装)")
        return False
    
    if not Path(CREDENTIALS_FILE).exists():
        print(f"⚠️ 跳过 {url} (credentials.json 不存在)")
        return False
    
    try:
        # 认证
        credentials = Credentials.from_service_account_file(
            CREDENTIALS_FILE,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        
        # 创建API服务
        service = build("indexing", "v3", credentials=credentials)
        
        # 提交URL
        body = {
            "url": url,
            "type": "URL_UPDATED"
        }
        
        response = service.urlNotifications().publish(body=body).execute()
        
        print(f"✅ 提交成功: {url}")
        print(f"   响应: {response.get('urlNotificationMetadata', {}).get('latestUpdate', {})}")
        return True
        
    except Exception as e:
        print(f"❌ 提交失败 {url}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="GSC 自动提交脚本")
    parser.add_argument("--days", type=int, default=1, help="检查最近N天内的文章")
    parser.add_argument("--dry-run", action="store_true", help="仅显示，不实际提交")
    args = parser.parse_args()
    
    init_log()
    print(f"\n🚀 GSC 自动提交启动\n")
    print(f"📅 检查最近 {args.days} 天内新增的文章...")
    
    # 获取最近文章
    recent_articles = get_recent_articles(days=args.days)
    
    if not recent_articles:
        print("ℹ️  没有找到最近新增的文章")
        return
    
    print(f"✅ 找到 {len(recent_articles)} 篇最近文章:\n")
    
    urls_to_submit = []
    for article in recent_articles:
        url = f"{SITE_URL}/blog/{article['slug']}"
        urls_to_submit.append(url)
        print(f"   - {article['title'][:60]}...")
        print(f"     {url}")
    
    if len(urls_to_submit) > MAX_DAILY_SUBMISSIONS:
        print(f"\n⚠️ 超过每日配额限制 (最多 {MAX_DAILY_SUBMISSIONS} 个URL)")
        urls_to_submit = urls_to_submit[:MAX_DAILY_SUBMISSIONS]
        print(f"   将只提交前 {MAX_DAILY_SUBMISSIONS} 个")
    
    if args.dry_run:
        print(f"\nℹ️  模拟运行，不实际提交")
        return
    
    if not urls_to_submit:
        print(f"\nℹ️  没有URL需要提交")
        return
    
    print(f"\n🚀 开始提交 {len(urls_to_submit)} 个URL...")
    
    success_count = 0
    for i, url in enumerate(urls_to_submit, 1):
        print(f"\n[{i}/{len(urls_to_submit)}] 提交: {url}")
        
        if submit_url_to_gsc(url):
            success_count += 1
        
        # 避免API限流
        if i < len(urls_to_submit):
            time.sleep(1)
    
    # 记录日志
    log_entry = f"| {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | {success_count}/{len(urls_to_submit)} | {'成功' if success_count == len(urls_to_submit) else '部分失败'} |\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry)
    
    print(f"\n✅ 完成！提交了 {success_count}/{len(urls_to_submit)} 个URL")
    print(f"📝 详细日志已保存到: {LOG_FILE}")


if __name__ == "__main__":
    main()
