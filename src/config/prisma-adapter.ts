import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma 7 se conecta a MySQL vía el driver `mariadb`, que solo acepta URLs
 * `mariadb://`; por eso DATABASE_URL (formato `mysql://`, el que usa la CLI)
 * se descompone acá en opciones del pool.
 */
export function crearAdapter(databaseUrl: string) {
  const url = new URL(databaseUrl);
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 10,
    // MySQL 8+ usa caching_sha2_password; sin TLS, el primer login necesita pedir
    // la llave pública al servidor (mysql2 lo hacía automáticamente).
    allowPublicKeyRetrieval: true,
  });
}
