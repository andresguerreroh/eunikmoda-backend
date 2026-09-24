import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoriaService } from "../../services/categoria.service";

export const categoriaAdminController = {
  listar: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await categoriaService.listarTodas() });
  }),
  crear: asyncHandler(async (req: Request, res: Response) => {
    const { nombre, orden } = req.body as { nombre: string; orden?: number };
    const categoria = await categoriaService.crear(nombre, orden);
    res.status(201).json({ data: categoria });
  }),
  actualizar: asyncHandler(async (req: Request, res: Response) => {
    await categoriaService.actualizar(Number(req.params.id), req.body);
    res.json({ ok: true });
  }),
  eliminar: asyncHandler(async (req: Request, res: Response) => {
    await categoriaService.eliminar(Number(req.params.id));
    res.status(204).send();
  }),
};
