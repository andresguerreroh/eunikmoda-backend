import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { AppJwtPayload } from "../models/auth.types";

export function signToken(payload: AppJwtPayload): string {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.jwt.secret, options);
}
export function verifyToken(token: string): AppJwtPayload {
  return jwt.verify(token, env.jwt.secret) as unknown as AppJwtPayload;
}
