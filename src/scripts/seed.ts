// ============================================================
// EUNIKMODA — Seed inicial (mismos datos que db/legacy/seed.sql.bak)
// Ejecutar con: npx prisma db seed  (corre el JS compilado, dist/scripts/seed.js;
// en local hace falta `pnpm build` antes. En producción ver README, "Deploy").
// ============================================================
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { crearAdapter } from "../config/prisma-adapter";

const prisma = new PrismaClient({ adapter: crearAdapter(process.env.DATABASE_URL ?? "") });

async function main() {
  // skipDuplicates: permite re-ejecutar el seed sin fallar por claves únicas.
  await prisma.pipelineEtapa.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Nuevo", orden: 1 }, { nombre: "Pregunta", orden: 2 }, { nombre: "Conversando", orden: 3 },
      { nombre: "Interesada", orden: 4 }, { nombre: "Reservado", orden: 5 }, { nombre: "Pendiente Pago", orden: 6 },
      { nombre: "Pagado", orden: 7 }, { nombre: "Despachado", orden: 8 }, { nombre: "Entregado", orden: 9 },
      { nombre: "Finalizado", orden: 10 }, { nombre: "Perdido", orden: 11 },
    ],
  });

  // Tallas: letra + numéricas de pantalón/jeans. Las de calzado se agregarán junto con
  // los primeros productos de Zapatos (ver README, sección "Tallas").
  await prisma.talla.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "XS", orden: 1 }, { nombre: "S", orden: 2 }, { nombre: "M", orden: 3 }, { nombre: "L", orden: 4 },
      { nombre: "XL", orden: 5 }, { nombre: "XXL", orden: 6 }, { nombre: "Única", orden: 7 },
      { nombre: "34", orden: 10 }, { nombre: "36", orden: 11 }, { nombre: "38", orden: 12 },
      { nombre: "40", orden: 13 }, { nombre: "42", orden: 14 }, { nombre: "44", orden: 15 },
    ],
  });

  await prisma.temporada.createMany({
    skipDuplicates: true,
    data: [{ nombre: "Verano" }, { nombre: "Otono" }, { nombre: "Invierno" }, { nombre: "Primavera" }],
  });

  await prisma.categoria.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Abrigos", slug: "abrigos", orden: 1 }, { nombre: "Chaquetas", slug: "chaquetas", orden: 2 },
      { nombre: "Vestidos", slug: "vestidos", orden: 3 }, { nombre: "Blazers", slug: "blazers", orden: 4 },
      { nombre: "Faldas", slug: "faldas", orden: 5 }, { nombre: "Jeans", slug: "jeans", orden: 6 },
      { nombre: "Pantalones", slug: "pantalones", orden: 7 }, { nombre: "Poleras", slug: "poleras", orden: 8 },
      { nombre: "Blusas", slug: "blusas", orden: 9 }, { nombre: "Sweaters", slug: "sweaters", orden: 10 },
      { nombre: "Accesorios", slug: "accesorios", orden: 11 }, { nombre: "Zapatos", slug: "zapatos", orden: 12 },
    ],
  });

  await prisma.origen.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Chile", tipo: "pais" }, { nombre: "Estados Unidos", tipo: "pais" }, { nombre: "Europa", tipo: "pais" },
      { nombre: "Importadora", tipo: "importadora" }, { nombre: "Cliente", tipo: "cliente" },
      { nombre: "Donación", tipo: "donacion" }, { nombre: "Compra directa", tipo: "compra_directa" },
    ],
  });

  await prisma.coleccion.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Nueva colección", slug: "nueva-coleccion", descripcion: "Lo último en llegar a la boutique." },
      { nombre: "Vintage", slug: "vintage", descripcion: "Piezas de otra época, con carácter propio." },
      { nombre: "Minimalista", slug: "minimalista", descripcion: "Líneas limpias, básicos con caída perfecta." },
      { nombre: "Oficina", slug: "oficina", descripcion: "Estructura y elegancia para el día a día." },
      { nombre: "Casual", slug: "casual", descripcion: "Comodidad sin perder identidad." },
      { nombre: "Invierno", slug: "invierno", descripcion: "Abrigo con actitud." },
    ],
  });

  await prisma.tag.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Minimalista", slug: "minimalista" }, { nombre: "Oversize", slug: "oversize" },
      { nombre: "Core", slug: "core" }, { nombre: "Coquette", slug: "coquette" },
      { nombre: "Vintage", slug: "vintage" }, { nombre: "Office", slug: "office" },
      { nombre: "Fiesta", slug: "fiesta" }, { nombre: "Casual", slug: "casual" },
      { nombre: "Premium", slug: "premium" },
    ],
  });

  await prisma.color.createMany({
    skipDuplicates: true,
    data: [
      { nombre: "Negro carbón", hex: "#191817" }, { nombre: "Marfil", hex: "#F6F1E9" },
      { nombre: "Terracota", hex: "#A64B35" }, { nombre: "Rosa arcilla", hex: "#D8AAA0" },
      { nombre: "Verde salvia", hex: "#687266" }, { nombre: "Camel", hex: "#C19A6B" },
      { nombre: "Azul medio", hex: "#4A6FA5" }, { nombre: "Azul oscuro", hex: "#1E2A47" },
      { nombre: "Café", hex: "#6F4E37" }, { nombre: "Blanco", hex: "#FFFFFF" },
      { nombre: "Beige", hex: "#E8DCC8" }, { nombre: "Gris", hex: "#8C8C8C" },
    ],
  });

  await prisma.material.createMany({
    skipDuplicates: true,
    data: ["Algodón", "Lino", "Lana", "Cuero", "Denim", "Poliéster", "Viscosa", "Seda"].map((nombre) => ({ nombre })),
  });

  // Password temporal: "EunikModa2026!" (cambiar en el primer login)
  await prisma.usuario.createMany({
    skipDuplicates: true,
    data: [
      {
        nombre: "Admin EUNIKMODA",
        email: "admin@eunikmoda.cl",
        passwordHash: "$2b$10$PLACEHOLDER_REEMPLAZAR_AL_CORRER_SEED",
        rol: "admin",
      },
    ],
  });
}

main()
  .then(() => console.log("Seed completado."))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
