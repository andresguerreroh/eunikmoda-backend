import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { productoService } from "../../services/producto.service";

export const productoPublicController = {
  listar: asyncHandler(async (req: Request, res: Response) => {
    const resultado = await productoService.listarPublico(req.query as any);
    res.json(resultado);
  }),

  detalle: asyncHandler(async (req: Request, res: Response) => {
    const detalle = await productoService.obtenerDetalle(req.params.slug);
    res.json({ data: detalle });
  }),
};
