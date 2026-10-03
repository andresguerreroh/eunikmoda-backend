import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { materialService } from "../../services/material.service";

export const materialPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await materialService.listarPublicas() });
  }),
};
