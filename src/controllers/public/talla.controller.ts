import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { tallaService } from "../../services/talla.service";

export const tallaPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await tallaService.listarPublicas() });
  }),
};
