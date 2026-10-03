import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { colorService } from "../../services/color.service";

export const colorPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await colorService.listarPublicas() });
  }),
};
