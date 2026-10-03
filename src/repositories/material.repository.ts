import { prisma } from "../config/prisma";
import type { Material } from "../models/material.types";

const SELECT = { id: true, nombre: true } as const;

function toMaterial(row: { id: bigint; nombre: string }): Material {
  return { ...row, id: Number(row.id) };
}

export const materialRepository = {
  async findAll(): Promise<Material[]> {
    const rows = await prisma.material.findMany({ select: SELECT, orderBy: { nombre: "asc" } });
    return rows.map(toMaterial);
  },
};
