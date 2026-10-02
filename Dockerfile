# syntax=docker/dockerfile:1

# ============================================================
# Stage 1 — builder: instala todo (incluye devDependencies) y compila
# ============================================================
FROM node:22-alpine AS builder

# El schema engine de Prisma (migrate) necesita openssl, que alpine no trae.
RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# --ignore-scripts: el postinstall (`prisma generate`) necesita el schema, que se copia en la capa siguiente.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Capa propia para el cliente Prisma: solo se regenera si cambia el schema.
COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
# El cliente generado vive en src/generated/prisma (.ts), así que tsc lo compila a dist/generated/prisma.
RUN pnpm build

# Schema, migraciones y config de la CLI: el stage final los necesita para `migrate deploy` y
# `db seed` (el seed ya viene compilado en dist/scripts/seed.js; ver README, "Deploy").
COPY prisma ./prisma
COPY prisma.config.ts ./

# ============================================================
# Stage 2 — runtime: solo dependencias de producción + código compilado
# ============================================================
FROM node:22-alpine AS runtime

RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
# `prisma` (CLI) está en dependencies porque `migrate deploy` corre en runtime.
# --ignore-scripts: el cliente ya viene generado y compilado dentro de dist/.
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 4000

# Las migraciones se aplican al arrancar (en build time no hay acceso a la BD real).
# `exec` deja a node como PID 1 para que reciba SIGTERM en `docker compose down/up`.
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/server.js"]
