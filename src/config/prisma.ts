import { PrismaClient } from "../generated/prisma/client";
import { crearAdapter } from "./prisma-adapter";
import { env } from "./env";

// Singleton: en dev, reutiliza la instancia entre recargas para no abrir un pool nuevo cada vez.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: crearAdapter(env.databaseUrl) });

if (env.nodeEnv !== "production") globalForPrisma.prisma = prisma;
