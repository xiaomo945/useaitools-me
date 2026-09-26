import { PrismaClient } from '@prisma/client';

/**
 * Prisma 7 no longer reads the connection URL from schema.prisma and rejects
 * the `datasources` constructor option, so a bare `new PrismaClient()` throws
 * "needs to be constructed with a non-empty, valid PrismaClientOptions" and
 * every seed script dies before it touches the database. lib/prisma.ts wires
 * the same SQLite adapter; this helper exists so the seeds share it.
 */
function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Absolute path: the working directory differs between the Vercel build and
  // a local run, and a relative `file:./dev.db` breaks in one of them.
  return `file:${process.cwd()}/prisma/dev.db`;
}

export function createSeedClient(): PrismaClient {
  const url = getDbUrl();
  const options: Record<string, unknown> = {};

  if (url.startsWith('file:')) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaLibSql } = require('@prisma/adapter-libsql');
    options.adapter = new PrismaLibSql({ url });
  }

  return new PrismaClient(options);
}

export default createSeedClient;
