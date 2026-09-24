import { Prisma } from "../generated/prisma/client";
import { productoRepository, type ProductoFiltros } from "../repositories/producto.repository";
import { construirSku, slugify } from "../utils/sku";
import { ApiError } from "../utils/ApiError";
import type { CrearProductoInput } from "../models/producto.types";

/**
 * precio_final ya no es una columna generada de MySQL: se calcula acá con la misma
 * fórmula que tenía el CASE y se guarda en cada create/update (así se puede seguir
 * ordenando/paginando por precio real en la BD). Se redondea igual que MySQL:
 * DECIMAL(10,2) al guardar y ROUND(..., 2) mitad-lejos-de-cero.
 */
export function calcularPrecioFinal(
  precio: number,
  tipoDescuento: CrearProductoInput["tipoDescuento"],
  valorDescuento: number | undefined
): Prisma.Decimal {
  const redondear = (v: number | Prisma.Decimal) => new Prisma.Decimal(v).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  const p = redondear(precio);
  // Sin valor de descuento el CASE de SQL daba NULL (y el listado mostraba precioFinal 0); acá se toma como 0.
  const v = redondear(valorDescuento ?? 0);

  switch (tipoDescuento) {
    case "porcentaje":
      return redondear(p.minus(p.times(v).dividedBy(100)));
    case "monto_fijo":
      return redondear(p.minus(v));
    default:
      return p;
  }
}

export const productoService = {
  async listarPublico(query: {
    categoria?: string;
    marca?: string;
    talla?: string;
    destacado?: string;
    nuevo?: string;
    pagina?: string;
    porPagina?: string;
    ordenar?: string;
    soloDisponibles?: string;
  }) {
    const filtros: ProductoFiltros = {
      categoriaSlug: query.categoria,
      marcaSlug: query.marca,
      tallaNombre: query.talla,
      destacado: query.destacado === "true",
      nuevo: query.nuevo === "true",
      soloDisponibles: query.soloDisponibles !== "false",
      ordenar: (query.ordenar as ProductoFiltros["ordenar"]) ?? "recientes",
      pagina: Number(query.pagina ?? 1),
      porPagina: Number(query.porPagina ?? 12),
    };

    const { items, total } = await productoRepository.listPublic(filtros);
    const porPagina = Math.max(1, Math.min(100, Math.trunc(filtros.porPagina)));

    return {
      data: items,
      meta: {
        total,
        pagina: Math.max(1, filtros.pagina),
        porPagina,
        totalPaginas: Math.max(1, Math.ceil(total / porPagina)),
      },
    };
  },

  async obtenerDetalle(slug: string) {
    const detalle = await productoRepository.findDetalleBySlug(slug);
    if (!detalle) throw ApiError.notFound("Producto no encontrado.");
    return detalle;
  },

  async crear(input: CrearProductoInput, nombreCategoria: string) {
    if (!input.tallaIds || input.tallaIds.length === 0) {
      throw ApiError.badRequest("Selecciona al menos una talla.");
    }

    return productoRepository.crear(input, {
      precioFinal: calcularPrecioFinal(input.precio, input.tipoDescuento, input.valorDescuento),
      identificadores: (id) => ({
        sku: construirSku(nombreCategoria, id),
        slug: `${slugify(input.nombre)}-${id}`,
      }),
    });
  },
};
