import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import type { Rol } from "../models/auth.types";

export function requireRole(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.rol)) return next(ApiError.forbidden("Tu rol no tiene permiso para esta acción."));
    next();
  };
}
