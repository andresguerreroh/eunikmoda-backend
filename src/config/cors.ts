import type { CorsOptions } from "cors";

/**
 * Decide si un origen puede leer las respuestas de la API (CORS). Acepta:
 *  a) orígenes exactos de CORS_ORIGIN (lista separada por comas en el env);
 *  b) cualquier https://*.vercel.app: dominio por defecto de Vercel y previews,
 *     cuya URL cambia en cada rama/PR (regla fija en el código, no en el env).
 * CORS no es la barrera de autorización: las rutas admin exigen JWT + rol.
 */
export function esOrigenPermitido(origin: string, permitidos: readonly string[]): boolean {
  if (permitidos.includes(origin)) return true;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false; // p. ej. "null" (iframes sandbox, file://)
  }
  return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
}

export function corsOrigin(permitidos: readonly string[]): CorsOptions["origin"] {
  return (origin, callback) => {
    // Sin header Origin (curl, servidor-a-servidor): se permite, como hace cors() por defecto.
    if (!origin) return callback(null, true);
    // false (y no un Error): cors() omite los headers y el navegador bloquea la lectura,
    // en vez de responder 500 desde el error middleware.
    callback(null, esOrigenPermitido(origin, permitidos));
  };
}
