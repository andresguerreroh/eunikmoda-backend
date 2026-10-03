import { prisma } from "../config/prisma";
import type { Temporada } from "../models/temporada.types";

const SELECT = { id: true, nombre: true } as const;

function toTemporada(row: { id: bigint; nombre: string }): Temporada {
  return { ...row, id: Number(row.id) };
}

export const temporadaRepository = {
  async findAll(): Promise<Temporada[]> {
    const rows = await prisma.temporada.findMany({ select: SELECT, orderBy: { id: "asc" } });
    return rows.map(toTemporada);
  },
};
