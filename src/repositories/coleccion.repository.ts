import { prisma } from "../config/prisma";
import type { Coleccion } from "../models/coleccion.types";

const SELECT = { id: true, nombre: true, slug: true, descripcion: true } as const;

function toColeccion(row: { id: bigint; nombre: string; slug: string; descripcion: string | null }): Coleccion {
  return { ...row, id: Number(row.id) };
}

export const coleccionRepository = {
  async findAllActive(): Promise<Coleccion[]> {
    const rows = await prisma.coleccion.findMany({ select: SELECT, where: { activo: true }, orderBy: { nombre: "asc" } });
    return rows.map(toColeccion);
  },
};
