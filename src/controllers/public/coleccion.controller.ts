import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { coleccionService } from "../../services/coleccion.service";

export const coleccionPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await coleccionService.listarPublicas() });
  }),
};
