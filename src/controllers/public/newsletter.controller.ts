import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { newsletterService } from "../../services/newsletter.service";

export const newsletterPublicController = {
  suscribir: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    await newsletterService.suscribir(email);
    res.status(201).json({ ok: true });
  }),
};
