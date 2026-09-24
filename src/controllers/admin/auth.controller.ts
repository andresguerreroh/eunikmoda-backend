import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "../../services/auth.service";
import { COOKIE_NAME } from "../../middlewares/auth.middleware";
import { env } from "../../config/env";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const { token, usuario } = await authService.login(email, password);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ usuario, token });
  }),
  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ ok: true });
  }),
  me: asyncHandler(async (req: Request, res: Response) => {
    res.json({ usuario: req.user });
  }),
};
