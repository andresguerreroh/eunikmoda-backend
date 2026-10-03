import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { origenService } from "../../services/origen.service";

export const origenPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await origenService.listarPublicas() });
  }),
};
