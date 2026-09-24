import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoriaService } from "../../services/categoria.service";

export const categoriaPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await categoriaService.listarPublicas() });
  }),
};
