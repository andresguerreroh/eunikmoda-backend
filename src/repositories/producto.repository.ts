import { prisma } from "../config/prisma";
import type { Prisma, TipoDescuento } from "../generated/prisma/client";
import type {
  ProductoListItem,
  ProductoDetalle,
  CrearProductoInput,
} from "../models/producto.types";

export interface ProductoFiltros {
  categoriaSlug?: string;
  marcaSlug?: string;
  tallaNombre?: string;
  destacado?: boolean;
  nuevo?: boolean;
  soloDisponibles?: boolean;
  ordenar?: "recientes" | "precio_asc" | "precio_desc";
  pagina: number;
  porPagina: number;
}

const ORDER_MAP: Record<string, Prisma.ProductoOrderByWithRelationInput[]> = {
  recientes: [{ fechaIngreso: "desc" }, { id: "desc" }],
  precio_asc: [{ precioFinal: "asc" }],
  precio_desc: [{ precioFinal: "desc" }],
};

// Los valores "2x1"/"3x2" no son identificadores válidos para un enum de Prisma;
// en el schema se mapean (@map) a dos_x_uno/tres_x_dos, pero en la BD siguen siendo "2x1"/"3x2".
const TIPO_DESCUENTO: Record<NonNullable<CrearProductoInput["tipoDescuento"]>, TipoDescuento> = {
  ninguno: "ninguno",
  porcentaje: "porcentaje",
  monto_fijo: "monto_fijo",
  "2x1": "dos_x_uno",
  "3x2": "tres_x_dos",
};

/** Columna DATE → "YYYY-MM-DD" (Prisma la entrega como medianoche UTC). */
function fechaComoTexto(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/** DECIMAL(10,2) como string con 2 decimales ("19990.00"); lo usa el HTML del newsletter. */
function decimalComoTexto(valor: Prisma.Decimal): string {
  return valor.toFixed(2);
}

const ORDEN_IMAGENES: Prisma.ProductoImagenOrderByWithRelationInput[] = [{ esPrincipal: "desc" }, { orden: "asc" }];

export const productoRepository = {
  async listPublic(filtros: ProductoFiltros): Promise<{ items: ProductoListItem[]; total: number }> {
    const where: Prisma.ProductoWhereInput = { visible: true };

    if (filtros.soloDisponibles !== false) where.estado = "disponible";
    if (filtros.categoriaSlug) where.categoria = { slug: filtros.categoriaSlug };
    if (filtros.marcaSlug) where.marca = { slug: filtros.marcaSlug };
    if (filtros.destacado) where.destacado = true;
    if (filtros.nuevo) where.nuevo = true;
    if (filtros.tallaNombre) where.tallas = { some: { talla: { nombre: filtros.tallaNombre } } };

    const orderBy = ORDER_MAP[filtros.ordenar ?? "recientes"] ?? ORDER_MAP.recientes;
    const limit = Math.max(1, Math.min(100, Math.trunc(filtros.porPagina)));
    const offset = Math.max(0, Math.trunc((Math.max(1, filtros.pagina) - 1) * limit));

    const [total, rows] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        select: {
          id: true, sku: true, nombre: true, slug: true, descripcionCorta: true,
          precio: true, precioAnterior: true, precioFinal: true, estado: true,
          destacado: true, nuevo: true, fechaIngreso: true,
          categoria: { select: { nombre: true, slug: true } },
          marca: { select: { nombre: true } },
          colorPrincipal: { select: { nombre: true } },
          imagenes: { select: { url: true }, orderBy: ORDEN_IMAGENES, take: 1 },
          tallas: { select: { talla: { select: { nombre: true } } }, orderBy: { talla: { orden: "asc" } } },
        },
      }),
    ]);

    const items = rows.map((p) => ({
      id: Number(p.id),
      sku: p.sku,
      nombre: p.nombre,
      slug: p.slug,
      descripcionCorta: p.descripcionCorta,
      precio: p.precio.toNumber(),
      precioAnterior: p.precioAnterior !== null ? p.precioAnterior.toNumber() : null,
      precioFinal: p.precioFinal.toNumber(),
      estado: p.estado,
      categoria: p.categoria.nombre,
      categoriaSlug: p.categoria.slug,
      marca: p.marca.nombre,
      colorPrincipal: p.colorPrincipal?.nombre ?? null,
      imagenPrincipal: p.imagenes[0]?.url ?? null,
      tallas: p.tallas.map((t) => t.talla.nombre),
      destacado: p.destacado,
      nuevo: p.nuevo,
      fechaIngreso: fechaComoTexto(p.fechaIngreso),
    }));

    return { items, total };
  },

  async findDetalleBySlug(slug: string): Promise<ProductoDetalle | null> {
    const p = await prisma.producto.findUnique({
      where: { slug, visible: true },
      select: {
        id: true, sku: true, nombre: true, slug: true, descripcionCorta: true, descripcionLarga: true,
        precio: true, precioAnterior: true, precioFinal: true, estado: true,
        paisFabricacion: true, fechaIngreso: true,
        categoria: { select: { nombre: true, slug: true } },
        marca: { select: { nombre: true } },
        origen: { select: { nombre: true } },
        colorPrincipal: { select: { nombre: true } },
        materialPrincipal: { select: { nombre: true } },
        imagenes: { select: { url: true }, orderBy: ORDEN_IMAGENES },
        tallas: { select: { talla: { select: { nombre: true } } }, orderBy: { talla: { orden: "asc" } } },
        colores: { select: { color: { select: { nombre: true } } }, orderBy: { colorId: "asc" } },
        materiales: { select: { material: { select: { nombre: true } } }, orderBy: { materialId: "asc" } },
        tags: { select: { tag: { select: { nombre: true } } }, orderBy: { tagId: "asc" } },
      },
    });
    if (!p) return null;

    return {
      id: Number(p.id),
      sku: p.sku,
      nombre: p.nombre,
      slug: p.slug,
      descripcionCorta: p.descripcionCorta,
      descripcionLarga: p.descripcionLarga,
      precio: p.precio.toNumber(),
      precioAnterior: p.precioAnterior !== null ? p.precioAnterior.toNumber() : null,
      precioFinal: p.precioFinal.toNumber(),
      estado: p.estado,
      categoria: p.categoria.nombre,
      categoriaSlug: p.categoria.slug,
      marca: p.marca.nombre,
      origen: p.origen.nombre,
      colorPrincipal: p.colorPrincipal?.nombre ?? null,
      materialPrincipal: p.materialPrincipal?.nombre ?? null,
      paisFabricacion: p.paisFabricacion,
      fechaIngreso: fechaComoTexto(p.fechaIngreso),
      imagenes: p.imagenes.map((i) => i.url),
      tallas: p.tallas.map((t) => t.talla.nombre),
      colores: p.colores.map((c) => c.color.nombre),
      materiales: p.materiales.map((m) => m.material.nombre),
      tags: p.tags.map((t) => t.tag.nombre),
    };
  },

  /**
   * Crea el producto con sus relaciones en una sola transacción. El SKU y el slug
   * incluyen el id autoincremental, así que se inserta con valores temporales únicos
   * y se reemplazan con `identificadores(id)` antes de hacer commit.
   */
  async crear(
    data: CrearProductoInput,
    calculados: {
      precioFinal: Prisma.Decimal;
      identificadores: (id: number) => { sku: string; slug: string };
    }
  ): Promise<{ id: number; sku: string; slug: string }> {
    return prisma.$transaction(async (tx) => {
      const temp = `TEMP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const creado = await tx.producto.create({
        select: { id: true },
        data: {
          sku: temp,
          slug: temp,
          nombre: data.nombre,
          descripcionCorta: data.descripcionCorta ?? null,
          descripcionLarga: data.descripcionLarga ?? null,
          precio: data.precio,
          precioAnterior: data.precioAnterior ?? null,
          tipoDescuento: TIPO_DESCUENTO[data.tipoDescuento ?? "ninguno"],
          valorDescuento: data.valorDescuento ?? null,
          precioFinal: calculados.precioFinal,
          categoriaId: data.categoriaId,
          subcategoriaId: data.subcategoriaId ?? null,
          marcaId: data.marcaId,
          origenId: data.origenId,
          temporadaId: data.temporadaId ?? null,
          coleccionId: data.coleccionId ?? null,
          materialPrincipalId: data.materialPrincipalId ?? null,
          colorPrincipalId: data.colorPrincipalId ?? null,
          paisFabricacion: data.paisFabricacion ?? null,
          fechaIngreso: new Date(data.fechaIngreso ?? new Date().toISOString().slice(0, 10)),

          tallas: { createMany: { data: data.tallaIds.map((tallaId) => ({ tallaId })) } },
          colores: data.colorIds?.length
            ? { createMany: { data: data.colorIds.map((colorId) => ({ colorId })) } }
            : undefined,
          materiales: data.materialIds?.length
            ? { createMany: { data: data.materialIds.map((materialId) => ({ materialId })) } }
            : undefined,
          tags: data.tagIds?.length
            ? { createMany: { data: data.tagIds.map((tagId) => ({ tagId })) } }
            : undefined,
          imagenes: data.imagenes?.length
            ? { createMany: { data: data.imagenes.map((url, i) => ({ url, orden: i, esPrincipal: i === 0 })) } }
            : undefined,
        },
      });

      const id = Number(creado.id);
      const { sku, slug } = calculados.identificadores(id);
      await tx.producto.update({ where: { id: creado.id }, data: { sku, slug } });

      return { id, sku, slug };
    });
  },

  async listarAgregadosDesde(fechaISO: string): Promise<{ id: number; nombre: string; slug: string }[]> {
    const rows = await prisma.producto.findMany({
      where: { createdAt: { gte: new Date(fechaISO) }, visible: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, nombre: true, slug: true },
    });
    return rows.map((r) => ({ ...r, id: Number(r.id) }));
  },

  async listarPorIds(ids: number[]): Promise<{ id: number; nombre: string; slug: string; precio_final: string }[]> {
    if (ids.length === 0) return [];
    const rows = await prisma.producto.findMany({
      where: { id: { in: ids } },
      select: { id: true, nombre: true, slug: true, precioFinal: true },
    });
    return rows.map((r) => ({ id: Number(r.id), nombre: r.nombre, slug: r.slug, precio_final: decimalComoTexto(r.precioFinal) }));
  },
};
