import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) return res.status(err.status).json({ error: err.message, details: err.details });
  console.error(err);
  return res.status(500).json({
    error: "Error interno del servidor.",
    ...(env.nodeEnv !== "production" && { debug: String(err) }),
  });
}
export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}
