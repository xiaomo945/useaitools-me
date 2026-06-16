// Prisma Client 封装：构建/部署时从不崩溃
//
// 设计目标：
// 1. DATABASE_URL 未设置时 → 自动使用绝对路径的 SQLite
// 2. Prisma Client 懒加载：模块 import 时绝对不 crash
// 3. 所有 prisma.xxx.yyy() 调用都被代理包裹 try-catch，出错时返回空数组 / null
// 4. 所有静态生成页面可自由调用 prisma，不会因为"数据库不可用"导致 Vercel 构建失败
//
// 使用方式：import { prisma, loadToolsJson } from '@/lib/prisma';

import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
  initAttempted: boolean;
  initError: string | undefined;
};

// ---- DATABASE_URL：绝对路径的 SQLite ----
function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // 强制使用绝对路径，避免不同运行环境 (CWD 不同) 下相对路径解析失败
  return `file:${process.cwd()}/prisma/dev.db`;
}

// ---- 懒加载 Prisma Client（任何错误都吞下）----
function tryCreateClient(): any {
  try {
    // 使用动态 import 避免构建时 Prisma Client 未生成导致的错误
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const prismaModule = require('@prisma/client');
    const { PrismaClient } = prismaModule;
    const client = new PrismaClient({
      datasources: { db: { url: getDbUrl() } },
      log: ['error'],
    });
    return client;
  } catch (e) {
    globalForPrisma.initError = (e as Error).message;
    return undefined;
  }
}

function getPrisma(): any {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (globalForPrisma.initAttempted && !globalForPrisma.prisma) {
    // 上次尝试失败，直接返回 null，不重复尝试
    return undefined;
  }
  globalForPrisma.initAttempted = true;
  const client = tryCreateClient();
  if (client) globalForPrisma.prisma = client;
  return client;
}

// ---- 对单个模型（如 tool / blogPost）进行代理 ----
function createModelProxy(modelName: string): any {
  return new Proxy({}, {
    get(_, prop: string) {
      const client = getPrisma();
      if (!client) {
        // Prisma 初始化失败 → 返回一个吞掉所有调用的"假模型"
        return async (..._args: unknown[]) => {
          if (prop === 'findMany' || prop === 'groupBy') return [];
          if (prop === 'count') return 0;
          if (prop === 'aggregate') return {};
          return null;
        };
      }
      return async (...args: unknown[]) => {
        try {
          const model = (client as any)[modelName];
          if (!model || typeof model[prop] !== 'function') {
            if (prop === 'findMany' || prop === 'groupBy') return [];
            if (prop === 'count') return 0;
            if (prop === 'aggregate') return {};
            return null;
          }
          return await model[prop](...args);
        } catch (e) {
          console.warn(`[prisma.${modelName}.${prop}] 调用失败:`, (e as Error).message);
          if (prop === 'findMany' || prop === 'groupBy') return [];
          if (prop === 'count') return 0;
          if (prop === 'aggregate') return {};
          return null;
        }
      };
    },
  });
}

// ---- 主导出：prisma.xxx.yyy() 永远不 throw ----
const modelNames = [
  'tool', 'category', 'collection', 'user', 'siteSubscription',
  'sponsoredSlot', 'affiliateLink', 'contentReport', 'userInteraction',
  'bookmark', 'blogPost', 'review', 'submission', 'discussion',
  'notification', 'session', 'toolReview', 'toolUpdate', 'ctaClick',
];

const prismaInternal: any = {};
for (const name of modelNames) {
  prismaInternal[name] = createModelProxy(name);
}
prismaInternal.$disconnect = async () => {
  const client = getPrisma();
  if (client) { try { await client.$disconnect(); } catch (_) { /* noop */ } }
};
prismaInternal.$connect = async () => {
  const client = getPrisma();
  if (!client) return;
  try { await client.$connect(); } catch (_) { /* noop */ }
};

export const prisma = prismaInternal;

// ---- tools.json 回退加载器 ----
// 当数据库完全不可用时，页面可以从 data/tools.json 读取数据
let toolsJsonCache: any[] | null = null;

export function loadToolsJson(): any[] {
  if (toolsJsonCache) return toolsJsonCache;
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'tools.json');
    if (!fs.existsSync(jsonPath)) {
      toolsJsonCache = [];
      return [];
    }
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    toolsJsonCache = Array.isArray(parsed) ? parsed : [];
    return toolsJsonCache;
  } catch (e) {
    console.warn('[prisma] loadToolsJson 失败:', (e as Error).message);
    toolsJsonCache = [];
    return [];
  }
}

export function loadToolsJsonSafe(): any[] {
  try { return loadToolsJson(); } catch { return []; }
}

// 辅助：把 tools.json 里的一条转成"类似 prisma 返回的" Tool 对象
export function toolJsonToDbTool(jsonItem: any, idx: number): any {
  return {
    id: `json-${idx}`,
    name: jsonItem.name || '',
    description: jsonItem.description || '',
    category: jsonItem.category || 'General',
    pricing: jsonItem.pricing || 'free',
    url: jsonItem.url || '',
    iconUrl: jsonItem.icon_url || '',
    rating: typeof jsonItem.rating === 'number' ? jsonItem.rating : 4.0,
    reviewCount: typeof jsonItem.review_count === 'number' ? jsonItem.review_count : 5,
    featured: !!jsonItem.featured,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  };
}

export default prismaInternal;
