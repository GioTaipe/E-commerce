# Entornos y base de datos (dev / prod)

Guía para trabajar en local y subir cambios a producción de forma segura,
usando **migraciones de Prisma** (no `db push`).

## Principio clave

La app **siempre** lee una sola variable: `DATABASE_URL`.
Lo único que cambia entre entornos es **su valor**, nunca el `schema.prisma`.

| Entorno | Dónde se define `DATABASE_URL` | Valor |
|---|---|---|
| Local (`npm run dev`) | `backend/.env` | `mysql://root:rootpassword@localhost:3306/ecommerce_db` |
| Docker Compose (stack) | `.env` raíz → override en `docker-compose.yml` | `mysql://root:rootpassword@mysql:3306/ecommerce_db` |
| Producción (Railway) | Panel de Railway → Variables del servicio | la URL del MySQL de Railway |

> Nunca pongas la URL de producción en `backend/.env`. Ahí solo va la de dev.

---

## 1. Levantar el entorno de DEV

```bash
# 1) MySQL en Docker (solo la DB; el backend corre en el host)
docker-compose up -d mysql

# 2) Backend
cd backend
npm install
npm run prisma:generate     # genera el cliente Prisma
npm run prisma:migrate      # aplica migraciones a la DB local (modo dev)
npm run prisma:seed         # crea el usuario admin
npm run dev                 # http://localhost:3001

# 3) Frontend (otra terminal)
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

`frontend/.env.local` ya apunta a `http://localhost:3001`.

### Resetear la DB de dev desde cero
```bash
cd backend
npm run prisma:reset        # borra, re-aplica TODAS las migraciones y re-siembra
```

---

## 2. Flujo de trabajo con migraciones

Cada vez que cambies `schema.prisma`:

```bash
cd backend
# Crea el archivo de migración + lo aplica a tu DB local
npm run prisma:migrate -- --name descripcion_del_cambio
```

Esto genera una carpeta en `prisma/migrations/<timestamp>_descripcion_del_cambio/`.
**Commitea esa carpeta** junto con el cambio de `schema.prisma`.

> Regla de oro: el esquema de la DB solo cambia mediante migraciones versionadas.
> Nunca más `db push` ni ALTER manuales en prod.

---

## 3. Baseline (SOLO UNA VEZ — DBs que ya existían antes de las migraciones)

Tu DB de dev y la de prod se crearon con `db push`, así que **ya tienen las tablas**
pero no la tabla de control `_prisma_migrations`. Hay que "marcar" la migración
inicial `0001_init` como ya aplicada para que Prisma no intente recrear las tablas.

### Dev (recrear desde cero — opción elegida)
```bash
cd backend
docker-compose down -v          # (desde la raíz) borra el volumen de la DB local
docker-compose up -d mysql
npm run prisma:migrate          # crea todo limpio aplicando 0001_init
npm run prisma:seed
```

### Producción (Railway) — baseline NO destructivo
Como prod **ya tiene** las tablas y columnas actuales, solo se marca como aplicada:
```bash
# Apuntando temporalmente a la URL de prod (NO la dejes en backend/.env):
DATABASE_URL="<URL_DE_PROD_RAILWAY>" npx prisma migrate resolve --applied 0001_init
```
A partir de aquí, prod queda enganchado al historial de migraciones.

---

## 4. Subir cambios a PRODUCCIÓN

Una vez probado en dev y con las migraciones commiteadas:

1. **Railway (backend):** configura el *Pre-deploy command* o el start como:
   ```bash
   npm run prisma:deploy     # = prisma migrate deploy (aplica solo migraciones pendientes)
   ```
   o usa directamente `npm run start:prod` (hace `migrate deploy` y luego arranca).
   `migrate deploy` **no** borra datos: solo aplica las migraciones que falten.

2. **Vercel (frontend):** asegúrate de que `NEXT_PUBLIC_API_URL` apunte al backend de Railway.

### Migrar DATOS (catálogo) de dev a prod
Las migraciones suben el **esquema**, no los datos. Para llevar datos nuevos:
- Productos/categorías: créalos en prod por el panel de admin, **o**
- Exporta solo las tablas de catálogo con `mysqldump --no-create-info --insert-ignore`
  y aplícalo a prod (haz **backup de prod primero**). Nunca exportes `User`/`Order`.

---

## Variables de entorno

Copia los ejemplos y rellena los valores reales (los `.env` reales están en `.gitignore`):
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```
