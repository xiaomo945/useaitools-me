import { DefaultSession } from 'next-auth';

/**
 * 扩展 next-auth 的 Session 类型，使 session.user.id 可被类型系统识别。
 * 这样可消除全项目 API 路由中 `(session?.user as any)?.id` 的类型绕过。
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string;
  }
}
