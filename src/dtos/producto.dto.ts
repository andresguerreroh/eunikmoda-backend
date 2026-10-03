import { z } from "zod";

export const listarProductosQuerySchema = z.object({
  categoria: z.string().optional(),
  marca: z.string().optional(),
  talla: z.string().optional(),
  destacado: z.string().optional(),
  nuevo: z.string().optional(),
  pagina: z.string().optional(),
  porPagina: z.string().optional(),
  ordenar: z.enum(["recientes", "precio_asc", "precio_desc"]).optional(),
});

export const crearProductoSchema = z.object({
  nombre: z.string().min(2).max(160),
  descripcionCorta: z.string().max(255).optional(),
  descripcionLarga: z.string().optional(),
  precio: z.number().positive(),
  precioAnterior: z.number().positive().optional(),
  tipoDescuento: z.enum(["ninguno", "porcentaje", "monto_fijo", "2x1", "3x2"]).optional(),
  valorDescuento: z.number().nonnegative().optional(),
  categoriaId: z.number().int().positive(),
  subcategoriaId: z.number().int().positive().optional(),
  marcaId: z.number().int().positive(),
  origenId: z.number().int().positive(),
  temporadaId: z.number().int().positive().optional(),
  coleccionId: z.number().int().positive().optional(),
  materialPrincipalId: z.number().int().positive().optional(),
  colorPrincipalId: z.number().int().positive().optional(),
  paisFabricacion: z.string().max(80).optional(),
  fechaIngreso: z.string().optional(),
  tallaIds: z.array(z.number().int().positive()).min(1, "Selecciona al menos una talla."),
  colorIds: z.array(z.number().int().positive()).optional(),
  materialIds: z.array(z.number().int().positive()).optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
  imagenes: z.array(z.string().url()).optional(),
});

export type CrearProductoBody = z.infer<typeof crearProductoSchema>;

export const actualizarProductoSchema = z.object({
  nombre: z.string().min(2).max(160).optional(),
  descripcionCorta: z.string().max(255).optional(),
  descripcionLarga: z.string().optional(),
  precio: z.number().positive().optional(),
  precioAnterior: z.number().positive().optional(),
  tipoDescuento: z.enum(["ninguno", "porcentaje", "monto_fijo", "2x1", "3x2"]).optional(),
  valorDescuento: z.number().nonnegative().optional(),
  categoriaId: z.number().int().positive().optional(),
  subcategoriaId: z.number().int().positive().optional(),
  marcaId: z.number().int().positive().optional(),
  origenId: z.number().int().positive().optional(),
  temporadaId: z.number().int().positive().optional(),
  coleccionId: z.number().int().positive().optional(),
  materialPrincipalId: z.number().int().positive().optional(),
  colorPrincipalId: z.number().int().positive().optional(),
  paisFabricacion: z.string().max(80).optional(),
  estado: z.enum(["disponible", "reservada", "en_negociacion", "vendida", "agotada", "oculta", "archivada"]).optional(),
  destacado: z.boolean().optional(),
  nuevo: z.boolean().optional(),
  visible: z.boolean().optional(),
  tallaIds: z.array(z.number().int().positive()).optional(),
  colorIds: z.array(z.number().int().positive()).optional(),
  materialIds: z.array(z.number().int().positive()).optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
  imagenesNuevas: z.array(z.string().url()).optional(),
});

export type ActualizarProductoBody = z.infer<typeof actualizarProductoSchema>;
