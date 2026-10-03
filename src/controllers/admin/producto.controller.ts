import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { productoService } from "../../services/producto.service";
import { productoRepository } from "../../repositories/producto.repository";
import { categoriaRepository } from "../../repositories/categoria.repository";
import { ApiError } from "../../utils/ApiError";
import type { CrearProductoBody, ActualizarProductoBody } from "../../dtos/producto.dto";

export const productoAdminController = {
  crear: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CrearProductoBody;
    const categoria = await categoriaRepository.findById(body.categoriaId);
    if (!categoria) throw ApiError.badRequest("La categoría seleccionada no existe.");

    const creado = await productoService.crear(body, categoria.nombre);
    res.status(201).json({ data: creado });
  }),

  // Detalle con IDs reales (no nombres) para preseleccionar el formulario de edición.
  detalle: asyncHandler(async (req: Request, res: Response) => {
    const producto = await productoRepository.findParaEdicion(Number(req.params.id));
    if (!producto) throw ApiError.notFound("Producto no encontrado.");
    res.json({ data: producto });
  }),

  actualizar: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as ActualizarProductoBody;
    const actualizado = await productoService.actualizar(Number(req.params.id), body);
    res.json({ data: actualizado });
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
