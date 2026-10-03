import { prisma } from "../config/prisma";
import type { Marca } from "../models/marca.types";

const SELECT = { id: true, nombre: true, slug: true } as const;

function toMarca(row: { id: bigint; nombre: string; slug: string }): Marca {
  return { ...row, id: Number(row.id) };
}

export const marcaRepository = {
  async findAllActive(): Promise<Marca[]> {
    const rows = await prisma.marca.findMany({ select: SELECT, where: { activo: true }, orderBy: { nombre: "asc" } });
    return rows.map(toMarca);
  },
};
