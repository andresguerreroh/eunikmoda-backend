// ============================================================
// EUNIKMODA — Crear o resetear un usuario admin/editor
// Herramienta de mantenimiento por CLI. NUNCA debe exponerse como endpoint
// HTTP — sería una puerta trasera de autenticación.
//
// Uso (requiere `pnpm build` antes, corre el JS compilado, igual que seed.ts):
//   NUEVO_USUARIO_NOMBRE="Ana Admin" \
//   NUEVO_USUARIO_EMAIL="ana@eunikmoda.cl" \
//   NUEVO_USUARIO_PASSWORD="..." \
//   NUEVO_USUARIO_ROL="admin" \
//   node dist/scripts/crear-usuario.js
//
// Si el email ya existe, actualiza su password/nombre/rol (sirve también
// para resetear contraseña). Si no existe, lo crea.
// ============================================================
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { crearAdapter } from "../config/prisma-adapter";

const prisma = new PrismaClient({ adapter: crearAdapter(process.env.DATABASE_URL ?? "") });

// Mismo costo que usa el hash de referencia en auth.service.ts.
const SALT_ROUNDS = 10;

const ROLES_PERMITIDOS = ["admin", "editor"] as const;
type RolPermitido = (typeof ROLES_PERMITIDOS)[number];

function leerVariables() {
  const nombre = process.env.NUEVO_USUARIO_NOMBRE;
  const email = process.env.NUEVO_USUARIO_EMAIL;
  const password = process.env.NUEVO_USUARIO_PASSWORD;
  const rol = process.env.NUEVO_USUARIO_ROL ?? "admin";

  if (!nombre || !email || !password) {
    console.error(
      "Faltan variables de entorno. Se requieren NUEVO_USUARIO_NOMBRE, NUEVO_USUARIO_EMAIL y " +
        "NUEVO_USUARIO_PASSWORD (NUEVO_USUARIO_ROL es opcional, default \"admin\")."
    );
    process.exit(1);
  }

  if (!ROLES_PERMITIDOS.includes(rol as RolPermitido)) {
    console.error(`NUEVO_USUARIO_ROL inválido: "${rol}". Debe ser "admin" o "editor".`);
    process.exit(1);
  }

  return { nombre, email, password, rol: rol as RolPermitido };
}

async function main() {
  const { nombre, email, password, rol } = leerVariables();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    create: { nombre, email, passwordHash, rol, activo: true },
    update: { nombre, passwordHash, rol, activo: true },
    select: { email: true, rol: true },
  });

  console.log(`Usuario listo → email: ${usuario.email} · rol: ${usuario.rol}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
