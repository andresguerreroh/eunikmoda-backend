import { Resend } from "resend";
import { env } from "../config/env";

let client: Resend | null = null;

function getClient(): Resend {
  if (!env.resend.apiKey) {
    throw new Error(
      "RESEND_API_KEY no está configurado. Crea una cuenta en resend.com, verifica tu dominio y agrega la key al .env."
    );
  }
  if (!client) client = new Resend(env.resend.apiKey);
  return client;
}

export const emailService = {
  async enviarATodos(destinatarios: string[], asunto: string, html: string) {
    if (destinatarios.length === 0) return { enviados: 0 };

    // Resend permite hasta 100 destinatarios por llamada en "bcc"/batch; para un
    // newsletter chico basta con lotes de 50 para no acercarse a ese límite.
    const LOTE = 50;
    let enviados = 0;
    const resend = getClient();

    for (let i = 0; i < destinatarios.length; i += LOTE) {
      const lote = destinatarios.slice(i, i + LOTE);
      await resend.emails.send({
        from: env.resend.fromEmail,
        to: env.resend.fromEmail, // "to" es la propia marca; los suscriptores van en bcc
        bcc: lote,
        subject: asunto,
        html,
      });
      enviados += lote.length;
    }

    return { enviados };
  },
};
