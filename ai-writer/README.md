# AI Writer - 智能写作助手

一个强大的 AI 写作工具，帮助你快速生成高质量内容。

## 功能特性

- ✍️ **多种写作模板** - 博客文章、商务邮件、社交媒体、故事小说等
- 🎨 **精美界面** - 现代化设计，简洁易用
- ⚡ **实时生成** - 打字机效果，流畅体验
- 📝 **字数控制** - 可调节生成内容长度
- 🔄 **一键复制** - 方便复制生成的内容
- 🌐 **响应式设计** - 支持桌面和移动端

## 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 快速开始

### 安装依赖

```bash
cd ai-writer
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
/workspace/ai-writer/
├── app/
│   ├── api/
│   │   └── generate/route.ts   # AI 生成 API
│   ├── layout.tsx              # 布局组件
│   └── page.tsx                # 主页面
├── public/                     # 静态资源
├── package.json
└── README.md
```

## 配置真实 AI 服务

当前项目使用模拟数据演示。要集成真实的 AI 服务：

1. 复制 `.env.example` 为 `.env.local`
2. 添加您的 API 密钥
3. 修改 `app/api/generate/route.ts` 调用真实 API

示例：

```typescript
// app/api/generate/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ... 调用真实 API ...
```

## 独立运行说明

此项目位于 `/workspace/ai-writer/`，与原有的 `/workspace/` 项目完全独立：

- 两个项目可以同时运行（注意端口不要冲突）
- 可以独立部署到不同的域名
- 代码和依赖完全隔离

## 部署

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/ai-writer)

### 其他平台

支持任何支持 Next.js 的部署平台：Netlify、Cloudflare Pages、Docker 等。

## 许可证

MIT
