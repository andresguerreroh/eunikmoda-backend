const ABREVIATURAS: Record<string, string> = {
  Abrigos: "ABR",
  Chaquetas: "CHA",
  Vestidos: "VES",
  Blazers: "BLZ",
  Faldas: "FAL",
  Jeans: "JEA",
  Pantalones: "PAN",
  Poleras: "POL",
  Blusas: "BLU",
  Sweaters: "SWE",
  Accesorios: "ACC",
  Zapatos: "ZAP",
};

export function abreviaturaCategoria(nombreCategoria: string): string {
  return ABREVIATURAS[nombreCategoria] ?? nombreCategoria.slice(0, 3).toUpperCase();
}

export function construirSku(nombreCategoria: string, insertId: number): string {
  return `EUNI-${abreviaturaCategoria(nombreCategoria)}-${String(insertId).padStart(6, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
