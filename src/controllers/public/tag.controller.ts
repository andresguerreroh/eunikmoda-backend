import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { tagService } from "../../services/tag.service";

export const tagPublicController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await tagService.listarPublicas() });
  }),
};
