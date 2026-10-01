# EUNIKMODA — Backend

Node.js + Express + TypeScript + MySQL (vía Prisma ORM 7), arquitectura por capas
(routes → middlewares → controllers → services → repositories).

## Setup

```bash
pnpm install
cp .env.example .env   # completa DATABASE_URL, JWT_SECRET, RESEND_API_KEY

npx prisma migrate dev   # crea la BD (si no existe) y aplica prisma/migrations
npx prisma db seed       # carga catálogos + admin (prisma/seed.ts)

pnpm dev   # http://localhost:4000
```

`pnpm install` corre `prisma generate` (postinstall), que genera el cliente en
`src/generated/prisma` (no se versiona). Si cambias `prisma/schema.prisma`,
crea una migración nueva con `npx prisma migrate dev --name <cambio>`.

> **Base de datos que ya tiene el schema anterior (db/legacy/schema.sql.bak)
> con datos:** no uses `migrate dev` (querría resetearla). La única diferencia
> estructural es `precio_final`, que dejó de ser columna generada:
>
> ```bash
> mysql ... -e "ALTER TABLE productos MODIFY precio_final DECIMAL(10,2) NOT NULL"
> npx prisma migrate resolve --applied <carpeta_de_la_migracion_init>
> ```
>
> El `ALTER` conserva los valores ya calculados; desde ahí la app mantiene
> `precio_final` (ver `calcularPrecioFinal` en `services/producto.service.ts`).

> El seed crea un admin con password placeholder. Genera el hash real con
> `node -e "console.log(require('bcryptjs').hashSync('tu-password', 10))"`
> y actualízalo en la tabla `usuarios` antes de usarlo en producción
> (por ejemplo con `npx prisma studio`).

## Endpoints

**Públicos** (`/api/v1/public`, sin JWT):
- `GET /categorias` — categorías activas
- `GET /products?categoria=&marca=&talla=&destacado=true&nuevo=true&pagina=&porPagina=&ordenar=recientes|precio_asc|precio_desc` — listado paginado
- `GET /products/:slug` — detalle completo (imágenes, tallas, colores, materiales, tags)
- `POST /newsletter/suscribir` — `{ email }`, conectado al formulario del home

**Admin** (`/api/v1/admin`, JWT + rol):
- `POST /auth/login` — `{ email, password }`
- `GET /productos` — listado sin restricción de "disponible/visible"
- `POST /productos` — crea producto (ver forma del body en `dtos/producto.dto.ts`); genera SKU (`EUNI-CHA-000124`) y slug automáticamente, dentro de una transacción
- `POST /uploads` — `multipart/form-data`, campo `file`; devuelve `{ url: "/uploads/xxx.jpg" }` para usar en `imagenes` al crear el producto
- `POST /newsletter/notificar-novedades` — `{ asunto, productoIds: [1,2,3] }`, envía manualmente el resumen a todas las suscriptoras activas vía Resend (nunca automático por producto — evita spam)

## Tallas

La tabla `tallas` acepta cualquier texto (`nombre` es único): el seed incluye
XS–XXL, "Única" y numeración de pantalones (34–44). Un mismo producto puede
tener varias tallas asociadas (`producto_tallas`, tabla muchos-a-muchos) — así
se resuelve "la misma prenda puede ser M o L".

**Calzado (pendiente, no implementado):** hoy no hay productos de Zapatos, así
que no hay tallas de calzado. Cuando los haya, el diseño acordado es que la
relación válida sea "categoría → tallas ofrecidas para esa categoría", no
"talla → tipo". Se agregará una tabla puente `categoria_tallas (categoria_id,
talla_id)` que defina qué tallas se pueden seleccionar en el formulario de admin
según la categoría elegida, **sin tocar la tabla `tallas`**. (Ya se probó un
discriminador `tallas.tipo` ropa/calzado y se revirtió en la migración
`revertir_talla_tipo`: no resolvía un problema real.) Ojo: "36" de pantalón y
"36" de calzado tendrían que compartir fila, o usar nombres distintos, porque
`nombre` sigue siendo único; conviene decidirlo al diseñar `categoria_tallas`.

## Email (Resend)

1. Crea cuenta en [resend.com](https://resend.com) (gratis hasta 3.000 correos/mes).
2. Verifica tu dominio (o usa el dominio de pruebas de Resend mientras tanto).
3. Copia la API key a `RESEND_API_KEY` en `.env`.
4. El envío de novedades es **manual**: el admin llama a
   `POST /newsletter/notificar-novedades` con los productos que quiere anunciar
   (por ejemplo, un botón "Avisar novedades" en el panel) — no hay ningún
   trigger automático por producto creado.

## Imágenes subidas

`POST /uploads` guarda el archivo en `./uploads` (configurable vía
`UPLOADS_DIR`) y Express lo sirve estático en `/uploads/<archivo>`. Para
producción, considera mover esto a un bucket (S3, Spaces de DigitalOcean) y
que `imagenes` guarde la URL del bucket en vez de la ruta local — la
interfaz del repository no cambia, solo de dónde viene la URL.

## Deploy (Docker en droplet de DigitalOcean)

Producción corre con `docker-compose.prod.yml`: dos contenedores en una red
propia (`eunikmoda_net`), independientes de cualquier otro proyecto del droplet.

| Servicio | Qué es | Expuesto |
|---|---|---|
| `eunikmoda_backend` | Esta API (imagen del `Dockerfile`) | Puerto **4001** del host → 4000 del contenedor |
| `eunikmoda_db` | `mysql:8`, datos en el volumen `eunikmoda_mysql_data` | No: solo desde el backend, por la red interna |

Al arrancar, el backend corre `prisma migrate deploy` (aplica migraciones
pendientes) y luego levanta la API. Las imágenes subidas viven en `./uploads`
del droplet (volumen), no dentro de la imagen.

### Primera vez (manual, en el droplet)

Requisitos: Docker con el plugin `docker compose`, y un usuario que pueda usar
docker sin `sudo` (el mismo que usará GitHub Actions).

```bash
# 1. Clonar el repo en el home del usuario de deploy (el workflow hace `cd ~/eunikmoda-backend`).
#    Si el repo es privado, el droplet necesita acceso de lectura (p. ej. una deploy key en GitHub).
cd ~
git clone git@github.com:andresguerreroh/eunikmoda-backend.git
cd eunikmoda-backend

# 2. Crear el .env de producción (está en .gitignore; nunca se commitea).
cp .env.production.example .env.production
nano .env.production
#    - Contraseñas nuevas (solo letras y números: `openssl rand -hex 24`), y las mismas en DATABASE_URL.
#    - JWT_SECRET NUEVO, distinto al de desarrollo: `openssl rand -base64 48`
#    - CORS_ORIGIN y FRONTEND_URL = dominio real del frontend en Vercel.

# 3. Levantar todo (crea la base, aplica las migraciones y arranca la API).
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f eunikmoda_backend   # Ctrl+C para salir

# 4. Cargar los catálogos iniciales UNA vez. La imagen final no incluye tsx (devDependency),
#    así que el seed corre desde el stage "builder" del mismo Dockerfile:
docker build --target builder -t eunikmoda-seed .
docker run --rm --network eunikmoda_net --env-file .env.production eunikmoda-seed npx prisma db seed
docker image rm eunikmoda-seed

# 5. Reemplazar el password placeholder del admin (ver "Setup") por un hash real:
docker compose -f docker-compose.prod.yml exec eunikmoda_db \
  sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
#    UPDATE usuarios SET password_hash = '<hash bcrypt>' WHERE email = 'admin@eunikmoda.cl';
```

Configura en GitHub (Settings → Secrets and variables → Actions) los secrets
que usa el workflow:

| Secret | Valor |
|---|---|
| `DO_HOST` | IP o hostname del droplet |
| `DO_USERNAME` | Usuario SSH de deploy (el que clonó el repo en su home) |
| `DO_SSH_KEY` | Llave privada SSH completa; la pública va en `~/.ssh/authorized_keys` de ese usuario |
| `DO_PORT` | Puerto SSH (22 salvo que el droplet use otro; si no se define, se usa 22) |

### De ahí en adelante (automático)

Cada push a `main` dispara `.github/workflows/deploy.yml`:

1. **Typecheck y build** en GitHub. Si falla, no se despliega nada.
2. **Deploy:** por SSH al droplet → `cd ~/eunikmoda-backend` → `git pull --ff-only`
   → `docker compose -f docker-compose.prod.yml up -d --build`. Se reconstruye la
   imagen y, al arrancar, se aplican las migraciones nuevas.

Queda manual: cambios en `.env.production` (luego `docker compose -f
docker-compose.prod.yml up -d` para recrear los contenedores) y volver a correr
el seed si se agregan catálogos nuevos (el seed se puede re-ejecutar sin duplicar).

### HTTPS (necesario para el frontend en Vercel)

El frontend se sirve por `https`, y el navegador bloquea las llamadas a una API
en `http://IP:4001` (contenido mixto). La API necesita un dominio con TLS: un
reverse proxy en el droplet (nginx, Caddy, Traefik, etc.) que termine HTTPS y
reenvíe a `localhost:4001`. Si ese proxy corre en el host, conviene publicar el
puerto solo en loopback (`"127.0.0.1:4001:4000"` en `docker-compose.prod.yml`).
Docker abre los puertos publicados saltándose `ufw`, así que `4001:4000` queda
accesible desde internet.

## Estructura

```
src/
├── config/        env.ts, prisma.ts (PrismaClient singleton), prisma-adapter.ts (driver MySQL)
├── routes/{public,admin}/
├── middlewares/   auth, role, validate (zod), error, upload (multer)
├── controllers/{public,admin}/
├── services/      producto (SKU + transacción), newsletter, email (Resend), categoria, auth
├── repositories/  solo acceso a datos (Prisma Client)
├── models/        tipos TS
├── dtos/          esquemas zod
├── utils/         ApiError, asyncHandler, jwt, sku (generación + slugify)
└── generated/     cliente Prisma generado (gitignored)
prisma/
├── schema.prisma  modelos (camelCase en TS, @map a las columnas snake_case reales)
├── migrations/    historial de migraciones SQL
└── seed.ts        categorías, tallas (letra + numéricas), colores, materiales, pipeline, admin
prisma.config.ts   config de la CLI de Prisma (DATABASE_URL, ruta de migraciones, comando de seed)
Dockerfile         imagen de producción (multi-stage: builder + runtime)
docker-compose.prod.yml  backend + MySQL para el droplet (red eunikmoda_net)
.github/workflows/deploy.yml  deploy automático en cada push a main
db/legacy/         schema.sql.bak y seed.sql.bak: SQL anterior a Prisma, solo referencia histórica
```

## Patrón para agregar un recurso nuevo

Usa `producto.*` como plantilla — es el más completo (filtros, paginación,
transacción). Para algo simple, `categoria.*` es más corto de seguir.
