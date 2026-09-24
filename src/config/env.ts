import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  uploadsDir: process.env.UPLOADS_DIR ?? "uploads",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? "",
    fromEmail: process.env.RESEND_FROM_EMAIL ?? "EUNIKMODA <novedades@eunikmoda.cl>",
  },
};
