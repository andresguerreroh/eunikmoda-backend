import { prisma } from "../config/prisma";
import type { Prisma, TipoDescuento } from "../generated/prisma/client";
import type {
  ProductoListItem,
  ProductoDetalle,
  ProductoParaEdicion,
  CrearProductoInput,
  ActualizarProductoInput,
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

// Dirección inversa de TIPO_DESCUENTO, para devolver al formulario de edición
// el mismo formato ("2x1"/"3x2") que usa crearProductoSchema, no el de la BD.
const TIPO_DESCUENTO_INVERSO: Record<TipoDescuento, NonNullable<CrearProductoInput["tipoDescuento"]>> = {
  ninguno: "ninguno",
  porcentaje: "porcentaje",
  monto_fijo: "monto_fijo",
  dos_x_uno: "2x1",
  tres_x_dos: "3x2",
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
   * Detalle para el formulario de edición: a diferencia de findDetalleBySlug
   * (pensado para mostrar al público, con nombres), esta devuelve los IDs
   * reales de cada relación para preseleccionar selects/checkboxes.
   */
  async findParaEdicion(id: number): Promise<ProductoParaEdicion | null> {
    const p = await prisma.producto.findUnique({
      where: { id },
      select: {
        id: true, sku: true, nombre: true, slug: true, descripcionCorta: true, descripcionLarga: true,
        precio: true, precioAnterior: true, tipoDescuento: true, valorDescuento: true, precioFinal: true,
        categoriaId: true, subcategoriaId: true, marcaId: true, origenId: true, temporadaId: true,
        coleccionId: true, materialPrincipalId: true, colorPrincipalId: true,
        paisFabricacion: true, estado: true, destacado: true, nuevo: true, visible: true, fechaIngreso: true,
        imagenes: { select: { id: true, url: true, orden: true, esPrincipal: true }, orderBy: ORDEN_IMAGENES },
        tallas: { select: { tallaId: true }, orderBy: { tallaId: "asc" } },
        colores: { select: { colorId: true }, orderBy: { colorId: "asc" } },
        materiales: { select: { materialId: true }, orderBy: { materialId: "asc" } },
        tags: { select: { tagId: true }, orderBy: { tagId: "asc" } },
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
      tipoDescuento: TIPO_DESCUENTO_INVERSO[p.tipoDescuento],
      valorDescuento: p.valorDescuento !== null ? p.valorDescuento.toNumber() : null,
      precioFinal: p.precioFinal.toNumber(),
      categoriaId: Number(p.categoriaId),
      subcategoriaId: p.subcategoriaId !== null ? Number(p.subcategoriaId) : null,
      marcaId: Number(p.marcaId),
      origenId: Number(p.origenId),
      temporadaId: p.temporadaId !== null ? Number(p.temporadaId) : null,
      coleccionId: p.coleccionId !== null ? Number(p.coleccionId) : null,
      materialPrincipalId: p.materialPrincipalId !== null ? Number(p.materialPrincipalId) : null,
      colorPrincipalId: p.colorPrincipalId !== null ? Number(p.colorPrincipalId) : null,
      paisFabricacion: p.paisFabricacion,
      estado: p.estado,
      destacado: p.destacado,
      nuevo: p.nuevo,
      visible: p.visible,
      fechaIngreso: fechaComoTexto(p.fechaIngreso),
      imagenes: p.imagenes.map((i) => ({ id: Number(i.id), url: i.url, orden: i.orden, esPrincipal: i.esPrincipal })),
      tallaIds: p.tallas.map((t) => Number(t.tallaId)),
      colorIds: p.colores.map((c) => Number(c.colorId)),
      materialIds: p.materiales.map((m) => Number(m.materialId)),
      tagIds: p.tags.map((t) => Number(t.tagId)),
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

  /**
   * UPDATE de los campos simples que vengan en `data` — nunca pisa con NULL lo
   * que no se mandó. sku y slug son inmutables desde acá (no forman parte de
   * ActualizarProductoInput) para no romper links existentes al producto.
   * Acepta un `client` opcional para poder participar de la transacción de
   * `actualizar()`; por defecto usa el cliente global.
   */
  async actualizarEscalares(
    id: number,
    data: ActualizarProductoInput,
    precioFinal?: Prisma.Decimal,
    client: Prisma.TransactionClient = prisma
  ): Promise<void> {
    const campos: Prisma.ProductoUncheckedUpdateInput = {};
    if (data.nombre !== undefined) campos.nombre = data.nombre;
    if (data.descripcionCorta !== undefined) campos.descripcionCorta = data.descripcionCorta;
    if (data.descripcionLarga !== undefined) campos.descripcionLarga = data.descripcionLarga;
    if (data.precio !== undefined) campos.precio = data.precio;
    if (data.precioAnterior !== undefined) campos.precioAnterior = data.precioAnterior;
    if (data.tipoDescuento !== undefined) campos.tipoDescuento = TIPO_DESCUENTO[data.tipoDescuento];
    if (data.valorDescuento !== undefined) campos.valorDescuento = data.valorDescuento;
    if (precioFinal !== undefined) campos.precioFinal = precioFinal;
    if (data.categoriaId !== undefined) campos.categoriaId = data.categoriaId;
    if (data.subcategoriaId !== undefined) campos.subcategoriaId = data.subcategoriaId;
    if (data.marcaId !== undefined) campos.marcaId = data.marcaId;
    if (data.origenId !== undefined) campos.origenId = data.origenId;
    if (data.temporadaId !== undefined) campos.temporadaId = data.temporadaId;
    if (data.coleccionId !== undefined) campos.coleccionId = data.coleccionId;
    if (data.materialPrincipalId !== undefined) campos.materialPrincipalId = data.materialPrincipalId;
    if (data.colorPrincipalId !== undefined) campos.colorPrincipalId = data.colorPrincipalId;
    if (data.paisFabricacion !== undefined) campos.paisFabricacion = data.paisFabricacion;
    if (data.estado !== undefined) campos.estado = data.estado;
    if (data.destacado !== undefined) campos.destacado = data.destacado;
    if (data.nuevo !== undefined) campos.nuevo = data.nuevo;
    if (data.visible !== undefined) campos.visible = data.visible;

    if (Object.keys(campos).length === 0) return;
    await client.producto.update({ where: { id }, data: campos });
  },

  /** Reemplazo completo del set de tallas (no merge). */
  async reemplazarTallas(id: number, tallaIds: number[], client: Prisma.TransactionClient = prisma): Promise<void> {
    await client.productoTalla.deleteMany({ where: { productoId: id } });
    if (tallaIds.length) {
      await client.productoTalla.createMany({ data: tallaIds.map((tallaId) => ({ productoId: id, tallaId })) });
    }
  },

  /** Reemplazo completo del set de colores (no merge). */
  async reemplazarColores(id: number, colorIds: number[], client: Prisma.TransactionClient = prisma): Promise<void> {
    await client.productoColor.deleteMany({ where: { productoId: id } });
    if (colorIds.length) {
      await client.productoColor.createMany({ data: colorIds.map((colorId) => ({ productoId: id, colorId })) });
    }
  },

  /** Reemplazo completo del set de materiales (no merge). */
  async reemplazarMateriales(id: number, materialIds: number[], client: Prisma.TransactionClient = prisma): Promise<void> {
    await client.productoMaterial.deleteMany({ where: { productoId: id } });
    if (materialIds.length) {
      await client.productoMaterial.createMany({ data: materialIds.map((materialId) => ({ productoId: id, materialId })) });
    }
  },

  /** Reemplazo completo del set de tags (no merge). */
  async reemplazarTags(id: number, tagIds: number[], client: Prisma.TransactionClient = prisma): Promise<void> {
    await client.productoTag.deleteMany({ where: { productoId: id } });
    if (tagIds.length) {
      await client.productoTag.createMany({ data: tagIds.map((tagId) => ({ productoId: id, tagId })) });
    }
  },

  /**
   * Agrega imágenes nuevas al final de las existentes (append, no reemplaza).
   * Si el producto todavía no tenía ninguna marcada como principal, la primera
   * de las nuevas pasa a serlo; si ya tenía, se respeta la que ya existía.
   */
  async agregarImagenes(id: number, urls: string[], client: Prisma.TransactionClient = prisma): Promise<void> {
    if (!urls.length) return;
    const [agregado, principales] = await Promise.all([
      client.productoImagen.aggregate({ where: { productoId: id }, _max: { orden: true } }),
      client.productoImagen.count({ where: { productoId: id, esPrincipal: true } }),
    ]);
    const ordenInicial = (agregado._max.orden ?? -1) + 1;
    await client.productoImagen.createMany({
      data: urls.map((url, i) => ({
        productoId: id,
        url,
        orden: ordenInicial + i,
        esPrincipal: principales === 0 && i === 0,
      })),
    });
  },

  /**
   * Actualiza un producto existente en una sola transacción: campos simples +
   * reemplazo de los sets que vengan (tallas/colores/materiales/tags) + imágenes
   * nuevas (append). Todo o nada, igual que crear().
   */
  async actualizar(
    id: number,
    data: ActualizarProductoInput,
    calculados?: { precioFinal: Prisma.Decimal }
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this.actualizarEscalares(id, data, calculados?.precioFinal, tx);
      if (data.tallaIds !== undefined) await this.reemplazarTallas(id, data.tallaIds, tx);
      if (data.colorIds !== undefined) await this.reemplazarColores(id, data.colorIds, tx);
      if (data.materialIds !== undefined) await this.reemplazarMateriales(id, data.materialIds, tx);
      if (data.tagIds !== undefined) await this.reemplazarTags(id, data.tagIds, tx);
      if (data.imagenesNuevas?.length) await this.agregarImagenes(id, data.imagenesNuevas, tx);
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
