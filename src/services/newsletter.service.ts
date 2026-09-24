import { newsletterRepository } from "../repositories/newsletter.repository";
import { productoRepository } from "../repositories/producto.repository";
import { emailService } from "./email.service";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

function formatCLP(value: number) {
  return value.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function armarHtml(asunto: string, productos: { nombre: string; slug: string; precio_final: string }[]) {
  const items = productos
    .map(
      (p) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e0d8;">
          <a href="${env.frontendUrl}/producto/${p.slug}" style="color:#191817;text-decoration:none;font-size:15px;">
            ${p.nombre}
          </a>
          <div style="color:#A64B35;font-size:14px;margin-top:2px;">${formatCLP(Number(p.precio_final))}</div>
        </td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#F6F1E9;padding:32px 24px;">
      <p style="letter-spacing:0.2em;text-transform:uppercase;font-size:12px;color:#687266;margin:0 0 16px;">EUNIKMODA</p>
      <h1 style="font-size:22px;color:#191817;margin:0 0 20px;">${asunto}</h1>
      <table width="100%" cellpadding="0" cellspacing="0">${items}</table>
      <p style="margin-top:24px;font-size:12px;color:#19181780;">
        Recibes este correo porque te suscribiste en eunikmoda.cl.
      </p>
    </div>`;
}

export const newsletterService = {
  suscribir(email: string) {
    return newsletterRepository.suscribir(email);
  },

  desuscribir(email: string) {
    return newsletterRepository.desuscribir(email);
  },

  async notificarNovedades(asunto: string, productoIds: number[]) {
    const [productos, suscriptores] = await Promise.all([
      productoRepository.listarPorIds(productoIds),
      newsletterRepository.listarActivos(),
    ]);

    if (productos.length === 0) throw ApiError.badRequest("Ninguno de los productos indicados existe.");
    if (suscriptores.length === 0) throw ApiError.badRequest("No hay suscriptoras activas todavía.");

    const html = armarHtml(asunto, productos);
    const destinatarios = suscriptores.map((s) => s.email);
    const { enviados } = await emailService.enviarATodos(destinatarios, asunto, html);

    return { enviados, productos: productos.length };
  },
};
