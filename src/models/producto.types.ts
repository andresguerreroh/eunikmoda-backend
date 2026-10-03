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

export interface ProductoImagenItem {
  id: number;
  url: string;
  orden: number;
  esPrincipal: boolean;
}

/**
 * Detalle para el formulario de edición: a diferencia de ProductoDetalle (que
 * devuelve nombres para mostrar al público), expone los IDs reales de cada
 * relación para preseleccionar selects/checkboxes.
 */
export interface ProductoParaEdicion {
  id: number;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  descripcionLarga: string | null;
  precio: number;
  precioAnterior: number | null;
  tipoDescuento: NonNullable<CrearProductoInput["tipoDescuento"]>;
  valorDescuento: number | null;
  precioFinal: number;
  categoriaId: number;
  subcategoriaId: number | null;
  marcaId: number;
  origenId: number;
  temporadaId: number | null;
  coleccionId: number | null;
  materialPrincipalId: number | null;
  colorPrincipalId: number | null;
  paisFabricacion: string | null;
  estado: string;
  destacado: boolean;
  nuevo: boolean;
  visible: boolean;
  /** Fecha de calendario (columna DATE), formato "YYYY-MM-DD". */
  fechaIngreso: string;
  imagenes: ProductoImagenItem[];
  tallaIds: number[];
  colorIds: number[];
  materialIds: number[];
  tagIds: number[];
}

export interface ActualizarProductoInput {
  nombre?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio?: number;
  precioAnterior?: number;
  tipoDescuento?: "ninguno" | "porcentaje" | "monto_fijo" | "2x1" | "3x2";
  valorDescuento?: number;
  categoriaId?: number;
  subcategoriaId?: number;
  marcaId?: number;
  origenId?: number;
  temporadaId?: number;
  coleccionId?: number;
  materialPrincipalId?: number;
  colorPrincipalId?: number;
  paisFabricacion?: string;
  estado?: "disponible" | "reservada" | "en_negociacion" | "vendida" | "agotada" | "oculta" | "archivada";
  destacado?: boolean;
  nuevo?: boolean;
  visible?: boolean;
  tallaIds?: number[];
  colorIds?: number[];
  materialIds?: number[];
  tagIds?: number[];
  imagenesNuevas?: string[];
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
