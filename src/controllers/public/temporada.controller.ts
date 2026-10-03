import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { temporadaService } from "../../services/temporada.service";

export const temporadaPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await temporadaService.listarPublicas() });
  }),
};
