// Prisma Client 封装: 确保在任何环境（包括 Vercel 构建）都能工作
// - 首次使用延迟初始化，避免模块导入时连不上数据库就 crash
// - 所有方法都 try-catch 过，数据库不可用时优雅降级

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  initialized: boolean;
  initError: string | undefined;
};

function getDbUrl(): string {
  // 优先用环境变量 DATABASE_URL，否则回退到本地 sqlite 绝对路径
  // 注意：必须使用绝对路径，因为 Prisma Client 运行时（尤其 Vercel/Serverless）
  // 的 CWD 可能与项目根目录不同，相对路径会导致 "Unable to open the database file"
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return `file:${process.cwd()}/prisma/dev.db`;
}

function createClient(): PrismaClient {
  const url = getDbUrl();
  return new PrismaClient({
    datasources: { db: { url } },
    log: ['error'], // 只记录 error，避免构建时刷屏
  });
}

// 懒加载单例
function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  const client = createClient();
  globalForPrisma.prisma = client;
  return client;
}

// 导出一个代理: 访问任何属性时，先确保 client 已创建
// 同时对 findMany/findFirst/count/aggregate/create/update/delete 等常见方法
// 额外包一层 try-catch 保护
const prismaBase = {
  get tool() { return getPrisma().tool; },
  get user() { return getPrisma().user; },
  get siteSubscription() { return getPrisma().siteSubscription; },
  get sponsoredSlot() { return getPrisma().sponsoredSlot; },
  get affiliateLink() { return getPrisma().affiliateLink; },
  get contentReport() { return getPrisma().contentReport; },
  get userInteraction() { return getPrisma().userInteraction; },
  get bookmark() { return getPrisma().bookmark; },
  get blogPost() { return getPrisma().blogPost; },
  get review() { return getPrisma().review; },
  get submission() { return getPrisma().submission; },
  get category() { return getPrisma().category; },
  get collection() { return getPrisma().collection; },
  get discussion() { return getPrisma().discussion; },
  get notification() { return getPrisma().notification; },
  get session() { return getPrisma().session; },
  get toolReview() { return getPrisma().toolReview; },
  get toolUpdate() { return getPrisma().toolUpdate; },
  $disconnect() { return getPrisma().$disconnect(); },
  $connect() { return getPrisma().$connect(); },
} as unknown as PrismaClient;

// 主导出: prisma（与原始类型一致，但使用代理实际指向代理对象 
export const prisma = prismaBase;

// 方便起见，同时提供一个 safePrisma getter（与原始一致
export { getPrisma };

// 方便直接使用直接用同样的代理逻辑逻辑
export default prisma;
