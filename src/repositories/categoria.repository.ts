import { prisma } from "../config/prisma";
import type { Categoria } from "../models/categoria.types";

const SELECT = { id: true, nombre: true, slug: true, activo: true, orden: true } as const;

function toCategoria(row: { id: bigint; nombre: string; slug: string; activo: boolean; orden: number }): Categoria {
  return { ...row, id: Number(row.id) };
}

export const categoriaRepository = {
  async findAllActive(): Promise<Categoria[]> {
    const rows = await prisma.categoria.findMany({ select: SELECT, where: { activo: true }, orderBy: { orden: "asc" } });
    return rows.map(toCategoria);
  },
  async findAll(): Promise<Categoria[]> {
    const rows = await prisma.categoria.findMany({ select: SELECT, orderBy: { orden: "asc" } });
    return rows.map(toCategoria);
  },
  async findById(id: number): Promise<Categoria | null> {
    const row = await prisma.categoria.findUnique({ select: SELECT, where: { id } });
    return row ? toCategoria(row) : null;
  },

  async findBySlug(slug: string): Promise<Categoria | null> {
    const row = await prisma.categoria.findUnique({ select: SELECT, where: { slug } });
    return row ? toCategoria(row) : null;
  },
  async create(data: Pick<Categoria, "nombre" | "slug" | "orden">): Promise<Categoria> {
    const row = await prisma.categoria.create({ select: SELECT, data });
    return toCategoria(row);
  },
  // updateMany/deleteMany (y no update/delete) para conservar el comportamiento previo:
  // un id inexistente no lanza error.
  async update(id: number, data: Partial<Pick<Categoria, "nombre" | "slug" | "orden" | "activo">>) {
    if (Object.keys(data).length === 0) return;
    await prisma.categoria.updateMany({ where: { id }, data });
  },
  async remove(id: number) {
    await prisma.categoria.deleteMany({ where: { id } });
  },
};
