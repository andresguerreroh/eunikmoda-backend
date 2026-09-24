import { prisma } from "../config/prisma";
import type { Usuario } from "../models/auth.types";

const SELECT = { id: true, nombre: true, email: true, passwordHash: true, rol: true, activo: true } as const;

function toUsuario({ id, passwordHash, ...rest }: { id: bigint; passwordHash: string } & Omit<Usuario, "id" | "password_hash">): Usuario {
  return { id: Number(id), password_hash: passwordHash, ...rest };
}

export const usuarioRepository = {
  async findByEmail(email: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ select: SELECT, where: { email } });
    return row ? toUsuario(row) : null;
  },
  async findById(id: number): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ select: SELECT, where: { id } });
    return row ? toUsuario(row) : null;
  },
};
