import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Prisma 7 ya no lee `package.json#prisma.seed`; el seed se configura acá.
    // Corre el JS compilado (src/scripts/seed.ts → dist/scripts/seed.js): así funciona igual en
    // local (tras `pnpm build`) y dentro de la imagen de producción, que solo trae dist/ y no tsx.
    seed: "node dist/scripts/seed.js",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
