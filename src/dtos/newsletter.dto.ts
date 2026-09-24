import { z } from "zod";

export const suscribirSchema = z.object({
  email: z.string().email("Correo inválido."),
});

export const notificarNovedadesSchema = z.object({
  asunto: z.string().min(3).max(150),
  productoIds: z.array(z.number().int().positive()).min(1, "Selecciona al menos un producto."),
});
