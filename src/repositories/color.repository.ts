import { prisma } from "../config/prisma";
import type { Color } from "../models/color.types";

const SELECT = { id: true, nombre: true, hex: true } as const;

function toColor(row: { id: bigint; nombre: string; hex: string | null }): Color {
  return { ...row, id: Number(row.id) };
}

export const colorRepository = {
  async findAll(): Promise<Color[]> {
    const rows = await prisma.color.findMany({ select: SELECT, orderBy: { nombre: "asc" } });
    return rows.map(toColor);
  },
};
