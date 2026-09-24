/** Ítem del listado, ya en la forma que devuelve GET /products. */
export interface ProductoListItem {
  id: number;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  precio: number;
  precioAnterior: number | null;
  precioFinal: number;
  estado: string;
  categoria: string;
  categoriaSlug: string;
  marca: string;
  colorPrincipal: string | null;
  imagenPrincipal: string | null;
  tallas: string[];
  destacado: boolean;
  nuevo: boolean;
  /** Fecha de calendario (columna DATE), formato "YYYY-MM-DD". */
  fechaIngreso: string;
}

export interface ProductoListado {
  items: ProductoListItem[];
  total: number;
  pagina: number;
  porPagina: number;
}

/** Detalle, ya en la forma que devuelve GET /products/:slug. */
export interface ProductoDetalle {
  id: number;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  descripcionLarga: string | null;
  precio: number;
  precioAnterior: number | null;
  precioFinal: number;
  estado: string;
  categoria: string;
  categoriaSlug: string;
  marca: string;
  origen: string;
  colorPrincipal: string | null;
  materialPrincipal: string | null;
  paisFabricacion: string | null;
  /** Fecha de calendario (columna DATE), formato "YYYY-MM-DD". */
  fechaIngreso: string;
  imagenes: string[];
  tallas: string[];
  colores: string[];
  materiales: string[];
  tags: string[];
}

export interface CrearProductoInput {
  nombre: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio: number;
  precioAnterior?: number;
  tipoDescuento?: "ninguno" | "porcentaje" | "monto_fijo" | "2x1" | "3x2";
  valorDescuento?: number;
  categoriaId: number;
  subcategoriaId?: number;
  marcaId: number;
  origenId: number;
  temporadaId?: number;
  coleccionId?: number;
  materialPrincipalId?: number;
  colorPrincipalId?: number;
  paisFabricacion?: string;
  fechaIngreso?: string;
  tallaIds: number[];
  colorIds?: number[];
  materialIds?: number[];
  tagIds?: number[];
  imagenes?: string[];
}
