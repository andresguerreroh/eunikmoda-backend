import type { AppJwtPayload } from "../models/auth.types";
declare global {
  namespace Express {
    interface Request { user?: AppJwtPayload; }
  }
}
export {};
