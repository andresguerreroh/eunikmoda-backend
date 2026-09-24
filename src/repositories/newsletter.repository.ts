import { prisma } from "../config/prisma";
import type { Suscriptor } from "../models/newsletter.types";

export const newsletterRepository = {
  async suscribir(email: string): Promise<void> {
    // upsert: si ya existe (inactivo por ejemplo), lo reactiva sin duplicar filas.
    await prisma.suscriptor.upsert({
      where: { email },
      create: { email, activo: true },
      update: { activo: true },
    });
  },

  async listarActivos(): Promise<Suscriptor[]> {
    const rows = await prisma.suscriptor.findMany({ where: { activo: true } });
    return rows.map((r) => ({
      id: Number(r.id),
      email: r.email,
      activo: r.activo,
      fecha_suscripcion: r.fechaSuscripcion,
    }));
  },

  async desuscribir(email: string): Promise<void> {
    await prisma.suscriptor.updateMany({ where: { email }, data: { activo: false } });
  },
};
