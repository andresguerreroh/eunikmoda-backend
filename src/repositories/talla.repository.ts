import { prisma } from "../config/prisma";
import type { Talla } from "../models/talla.types";

const SELECT = { id: true, nombre: true, orden: true } as const;

function toTalla(row: { id: bigint; nombre: string; orden: number }): Talla {
  return { ...row, id: Number(row.id) };
}

export const tallaRepository = {
  async findAll(): Promise<Talla[]> {
    const rows = await prisma.talla.findMany({ select: SELECT, orderBy: { orden: "asc" } });
    return rows.map(toTalla);
  },
};
