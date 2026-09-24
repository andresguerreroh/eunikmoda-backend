import { z } from "zod";
export const crearCategoriaSchema = z.object({
  nombre: z.string().min(2).max(100),
  orden: z.number().int().nonnegative().optional(),
});
export const actualizarCategoriaSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  orden: z.number().int().nonnegative().optional(),
  activo: z.boolean().optional(),
});
