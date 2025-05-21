import { PrismaClient } from "@prisma/client"

declare global {
  // Allow globalThis.prisma to be of type PrismaClient or undefined
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db