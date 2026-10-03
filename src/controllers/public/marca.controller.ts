import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { marcaService } from "../../services/marca.service";

export const marcaPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await marcaService.listarPublicas() });
  }),
};
