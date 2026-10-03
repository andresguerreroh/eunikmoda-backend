import { prisma } from "../config/prisma";
import type { Origen } from "../models/origen.types";

const SELECT = { id: true, nombre: true, tipo: true } as const;

function toOrigen(row: { id: bigint; nombre: string; tipo: string }): Origen {
  return { ...row, id: Number(row.id) };
}

export const origenRepository = {
  async findAll(): Promise<Origen[]> {
    const rows = await prisma.origen.findMany({ select: SELECT, orderBy: { nombre: "asc" } });
    return rows.map(toOrigen);
  },
};
