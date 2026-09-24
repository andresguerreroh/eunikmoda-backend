import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { newsletterService } from "../../services/newsletter.service";

export const newsletterAdminController = {
  notificarNovedades: asyncHandler(async (req: Request, res: Response) => {
    const { asunto, productoIds } = req.body as { asunto: string; productoIds: number[] };
    const resultado = await newsletterService.notificarNovedades(asunto, productoIds);
    res.json({ data: resultado });
  }),
};
