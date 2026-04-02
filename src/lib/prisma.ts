import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientCtor } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  try {
    return new PrismaClientCtor({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch {
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL && prisma !== null;
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error("DATABASE_URL is not configured");
  }
  return prisma;
}
