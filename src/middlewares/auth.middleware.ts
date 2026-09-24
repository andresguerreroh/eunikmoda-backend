import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

const COOKIE_NAME = "eunikmoda_session";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7) : undefined;
  const token = req.cookies?.[COOKIE_NAME] ?? bearer;
  if (!token) return next(ApiError.unauthorized("Debes iniciar sesión para continuar."));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Tu sesión expiró o el token no es válido."));
  }
}
export { COOKIE_NAME };
