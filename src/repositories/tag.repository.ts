import { prisma } from "../config/prisma";
import type { Tag } from "../models/tag.types";

const SELECT = { id: true, nombre: true, slug: true } as const;

function toTag(row: { id: bigint; nombre: string; slug: string }): Tag {
  return { ...row, id: Number(row.id) };
}

export const tagRepository = {
  async findAll(): Promise<Tag[]> {
    const rows = await prisma.tag.findMany({ select: SELECT, orderBy: { nombre: "asc" } });
    return rows.map(toTag);
  },
};
