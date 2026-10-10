import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
    const mariadb = require('mariadb');

    // The mariadb driver requires mariadb:// URL scheme instead of mysql://
    const dbUrl = process.env.DATABASE_URL.replace(/^mysql:\/\//i, 'mariadb://');
    const pool = mariadb.createPool(dbUrl);
    const adapter = new PrismaMariaDb(pool);
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error('Failed to create Prisma driver adapter:', err.message);
    return null;
  }
}

// Fallback proxy to ensure model methods like prisma.user.findUnique exist if DB is offline
const dummyPrismaProxy = new Proxy(
  {},
  {
    get(_target, _prop) {
      return new Proxy(
        {},
        {
          get() {
            return () => Promise.reject(new Error('Prisma database is unavailable.'));
          },
        }
      );
    },
  }
);

export const prisma =
  globalForPrisma.prisma || createPrismaClient() || dummyPrismaProxy;

if (process.env.NODE_ENV !== 'production' && prisma && prisma !== dummyPrismaProxy) {
  globalForPrisma.prisma = prisma;
}

export default prisma;