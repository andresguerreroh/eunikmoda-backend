import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { productoService } from "../../services/producto.service";
import { categoriaRepository } from "../../repositories/categoria.repository";
import { ApiError } from "../../utils/ApiError";
import type { CrearProductoBody } from "../../dtos/producto.dto";

export const productoAdminController = {
  crear: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CrearProductoBody;
    const categoria = await categoriaRepository.findById(body.categoriaId);
    if (!categoria) throw ApiError.badRequest("La categoría seleccionada no existe.");

    const creado = await productoService.crear(body, categoria.nombre);
    res.status(201).json({ data: creado });
  }),

  // Reutiliza el listado público pero sin exigir "disponible" ni "visible",
  // para que el admin vea también reservados/agotados/ocultos.
  listar: asyncHandler(async (req: Request, res: Response) => {
    const resultado = await productoService.listarPublico({
      ...(req.query as any),
      soloDisponibles: "false",
    });
    res.json(resultado);
  }),
};
