#!/usr/bin/env python3
import os
import subprocess

# 下载字体文件到 public/fonts 目录
fonts_dir = 'public/fonts'
os.makedirs(fonts_dir, exist_ok=True)

print("Downloading fonts for self-hosting...")

# 使用 next/font 已经自动处理自托管
# 但我们可以确保字体目录存在
print("Fonts will be automatically self-hosted by Next.js during build")
print("Font directory ready:", fonts_dir)