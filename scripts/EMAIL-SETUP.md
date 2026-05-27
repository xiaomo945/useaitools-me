# 邮件自动分类脚本 — 使用说明

## 功能
自动连接邮箱（Gmail / QQ邮箱），检测最近 3 天的新邮件，按规则分类为：
- **紧急**：发件人包含 grammarly、roundbarnlabs、pictory、synthesia、notion、descript、partnerstack、impact.com
- **广告**：主题包含 sale、discount、limited time、buy now、subscribe
- **普通**：其他

紧急邮件的英文内容会自动翻译成中文摘要。

## 前置准备

### Gmail 用户
1. 登录 Google 账号 → 管理 Google 账号 → 安全性
2. 开启 **两步验证**（如已开启可跳过）
3. 搜索 **"应用专用密码"** → 生成一个新的应用密码（16 位）
4. 保存这个密码，运行脚本时使用

### QQ 邮箱用户
1. 登录 QQ 邮箱 → 设置 → 账户
2. 找到 **POP3/IMAP/SMTP** 服务，开启 **IMAP/SMTP 服务**
3. 按提示获取 **授权码**（不是 QQ 密码）
4. 保存这个授权码，运行脚本时使用

## 运行方法

```bash
python scripts/email-filter.py 你的邮箱地址
```

示例：
```bash
python scripts/email-filter.py your-email@gmail.com
python scripts/email-filter.py your-qq@qq.com
```

运行后输入密码/应用专用密码/授权码，脚本会自动连接邮箱并输出分类结果。

## 输出格式
```
=== 紧急邮件 ===
1. [Grammarly] Weekly writing insights — 本周写作数据：你写了 2,341 个词...
=== 广告邮件 ===
2. [Promo] Flash Sale — 50% Off!（跳过）
=== 普通邮件 ===
3. [Newsletter] AI Tool Weekly（跳过）

共计 3 封邮件（紧急: 1, 广告: 1, 普通: 1）
```

## 注意事项
- 脚本通过 **IMAP SSL（端口 993）** 连接，密码仅在内存中使用，不会保存到磁盘
- 翻译服务使用免费的 MyMemory API，无需申请密钥
- 如果连接失败，请检查是否已开启 IMAP 服务和应用专用密码
