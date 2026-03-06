# MyShop — E-commerce Full-Stack

Aplicación e-commerce completa con API REST y frontend moderno.

## Tecnologías

### Backend

| Tecnología | Uso |
|---|---|
| **Node.js** | Runtime del servidor |
| **Express 5** | Framework HTTP / REST API |
| **TypeScript 5** | Tipado estático |
| **Prisma 6** | ORM y migraciones |
| **MySQL 8.4** | Base de datos relacional |
| **JWT** | Autenticación stateless (Bearer token) |
| **bcrypt** | Hashing de contraseñas |
| **class-validator / class-transformer** | Validación de DTOs con decoradores |
| **Cloudinary** | Almacenamiento de imágenes de productos |
| **express-fileupload** | Manejo de uploads (máx. 5 MB) |
| **Helmet** | Cabeceras de seguridad HTTP |
| **express-rate-limit** | Limitación de peticiones |
| **Jest + ts-jest** | Testing unitario |
| **nodemon + tsx** | Hot-reload en desarrollo |

### Frontend

| Tecnología | Uso |
|---|---|
| **Next.js 16** | Framework React con App Router |
| **React 19** | Librería de UI |
| **TypeScript 5** | Tipado estático |
| **Tailwind CSS v4** | Estilos utility-first |
| **Zustand 5** | Estado global del cliente (carrito, auth, UI) |
| **React Hook Form** | Manejo de formularios |
| **Axios** | Cliente HTTP |
| **Lucide React** | Iconografía |
| **Geist** | Tipografía |

### Infraestructura

| Herramienta | Uso |
|---|---|
| **Docker Compose** | Orquestación de servicios (MySQL, backend, frontend) |
| **Docker** | Contenedorización de cada servicio |
| **ESLint** | Linting del código frontend |

---

## Arquitectura

### Estructura del Proyecto

```
Ecommerce/
├── backend/                    # API REST
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de la base de datos
│   ├── src/
│   │   ├── config/             # Configuración (Prisma, Cloudinary, env)
│   │   ├── controllers/        # Controladores HTTP
│   │   ├── dto/                # Objetos de transferencia / validación
│   │   ├── middleware/         # Auth, roles, validación, errores
│   │   ├── repositories/      # Acceso a datos (Prisma)
│   │   ├── routes/             # Definición de rutas
│   │   ├── services/           # Lógica de negocio
│   │   ├── types/              # Tipos TypeScript
│   │   ├── utils/              # Utilidades (JWT, Cloudinary, errores)
│   │   ├── app.ts              # Configuración de Express
│   │   └── server.ts           # Punto de entrada
│   └── package.json
├── frontend/frontend/          # Aplicación Next.js
│   ├── app/
│   │   ├── (storefront)/       # Tienda pública
│   │   │   ├── page.tsx        # Home
│   │   │   ├── products/       # Listado y detalle de productos
│   │   │   ├── cart/           # Carrito de compras
│   │   │   ├── orders/         # Historial de pedidos
│   │   │   └── login/          # Inicio de sesión
│   │   └── admin/              # Panel de administración
│   │       ├── products/       # CRUD de productos
│   │       ├── categories/     # Gestión de categorías
│   │       ├── users/          # Gestión de usuarios
│   │       └── offers/         # Gestión de ofertas
│   ├── components/
│   │   ├── admin/              # Componentes del panel admin
│   │   ├── home/               # Hero, banners, categorías
│   │   ├── layout/             # Navbar, Footer, CartDrawer
│   │   ├── products/           # ProductCard, ProductGrid, filtros
│   │   └── ui/                 # Badge, Loader, Toast
│   ├── services/               # Llamadas a la API (Axios)
│   ├── store/                  # Stores de Zustand (cart, auth, UI, toast)
│   ├── types/                  # Interfaces TypeScript
│   └── package.json
└── docker-compose.yml
```

### Backend — Patrón de tres capas

```
Routes → Controllers → Services → Repositories → Prisma/DB
```

- **Routes**: Definen los endpoints y aplican cadenas de middleware (auth, roles, validación de DTOs).
- **Controllers**: Parsean la petición HTTP, delegan al servicio y envían la respuesta.
- **Services**: Contienen la lógica de negocio, orquestación, operaciones con Cloudinary y transacciones Prisma.
- **Repositories**: Capa de acceso a datos. Wrappers finos sobre Prisma, un repositorio por modelo.
- **DTOs**: Clases decoradas con `class-validator` para validar el body de las peticiones.

### Frontend — Next.js App Router

- **Server Components**: Fetching de datos asíncrono en el servidor.
- **Client Components**: Interactividad con hooks y estado local.
- **Zustand Stores**: Estado global del lado del cliente (carrito, autenticación, UI).
- **Route Groups**: `(storefront)` para la tienda pública, `admin/` para el panel de administración.

---

## Modelo de Datos

```
User ─────── Cart (1:1)
  │              │
  │          CartItem ──── Product
  │                           │
  └── Order               Category
        │
    OrderItem ──── Product
```

**Modelos**: `User`, `Category`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`

- Todos los IDs son `Int` auto-incrementales.
- `OrderItem` guarda `priceAtPurchase` para preservar el precio al momento de la compra.
- Estados de orden: `pending`, `shipped`, `delivered`, `cancelled`.
- Roles de usuario: `customer` (por defecto), `admin`.

---

## API REST — Endpoints

### Auth (`/api/auth`)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/register` | Registro de usuario | Público |
| POST | `/login` | Inicio de sesión (devuelve JWT) | Público |

### Productos (`/api/products`)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar productos | Público |
| GET | `/:id` | Detalle de producto | Público |
| POST | `/` | Crear producto | Admin |
| PUT | `/:id` | Actualizar producto | Admin |
| DELETE | `/:id` | Eliminar producto | Admin |

### Categorías (`/api/categories`)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar categorías | Público |
| POST | `/` | Crear categoría | Admin |
| PUT | `/:id` | Actualizar categoría | Admin |
| DELETE | `/:id` | Eliminar categoría | Admin |

### Carrito (`/api/cart`)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Ver carrito del usuario | Autenticado |
| POST | `/items` | Agregar item al carrito | Autenticado |
| PUT | `/items/:id` | Actualizar cantidad | Autenticado |
| DELETE | `/items/:id` | Eliminar item | Autenticado |

### Órdenes (`/api/orders`)

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar órdenes del usuario | Autenticado |
| POST | `/` | Crear orden desde el carrito | Autenticado |

---

## Autenticación y Seguridad

- **JWT stateless**: Token Bearer en el header `Authorization`.
- **Hashing**: `bcrypt` con 10 rondas de salt.
- **Payload del token**: `{ id, email, role }`, expira en 1 hora.
- **Cadena de middleware**: `authMiddleware → roleGuard → validateDto → controller`.
- **Helmet**: Cabeceras HTTP de seguridad.
- **Rate Limiting**: Limitación de peticiones por IP.

---

## Instalación y Ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) y Docker Compose
- Cuenta en [Cloudinary](https://cloudinary.com/) (para imágenes)

### Con Docker (recomendado)

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd Ecommerce
   ```

2. Configurar variables de entorno:

   **`backend/.env`**:
   ```env
   DATABASE_URL=mysql://usuario:password@mysql:3306/ecommerce
   JWT_SECRET=tu_secreto_jwt
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

   **`frontend/frontend/.env.local`**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Levantar los servicios:
   ```bash
   docker-compose up
   ```

4. Acceder a la aplicación:
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:3000
   - **MySQL**: localhost:3306

### Desarrollo local (sin Docker)

#### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev                 # Servidor en http://localhost:3000
```

#### Frontend
```bash
cd frontend/frontend
npm install
npm run dev                 # Servidor en http://localhost:3000
```

### Testing

```bash
cd backend
npm run test
```

---

## Variables de Entorno

| Variable | Servicio | Descripción |
|---|---|---|
| `DATABASE_URL` | Backend | Cadena de conexión MySQL |
| `JWT_SECRET` | Backend | Secreto para firmar tokens JWT |
| `CLOUDINARY_CLOUD_NAME` | Backend | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | Backend | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | Backend | API Secret de Cloudinary |
| `NEXT_PUBLIC_API_URL` | Frontend | URL base de la API del backend |
| `MYSQL_ROOT_PASSWORD` | Docker | Contraseña root de MySQL |
| `MYSQL_DATABASE` | Docker | Nombre de la base de datos |
| `MYSQL_USER` | Docker | Usuario de MySQL |
| `MYSQL_PASSWORD` | Docker | Contraseña del usuario MySQL |

---
