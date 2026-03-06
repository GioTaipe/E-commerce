# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce app ("MyShop") with a REST API backend and Next.js frontend, orchestrated via Docker Compose.

- **Backend**: `backend/` — Express 5, TypeScript, Prisma 6, MySQL
- **Frontend**: `frontend/frontend/` — Next.js 16 (App Router), React 19, Tailwind CSS v4, Zustand

## Commands

### Backend (`cd backend/`)

```bash
npm run dev              # Dev server with nodemon + tsx (hot-reload, port 3000)
npm run build            # Compile TypeScript → dist/
npm run start            # Run compiled output (node dist/server.js)
npm run test             # Run Jest tests
npm run prisma:migrate   # Run Prisma migrations (dev)
npm run prisma:generate  # Regenerate Prisma Client after schema changes
```

### Frontend (`cd frontend/frontend/`)

```bash
npm run dev     # Next.js dev server
npm run build   # Production build
npm run lint    # ESLint
```

### Docker (from repo root)

```bash
docker-compose up   # MySQL (3306), backend (3000), frontend (4200)
```

## Architecture

### Backend — Three-Layer Pattern

**Routes → Controllers → Services → Repositories**

- **Routes** (`src/routes/`): Mount controllers, apply middleware chains (auth, role, validation).
- **Controllers** (`src/controllers/`): Parse HTTP requests, delegate to services, send responses. Methods are arrow function class properties for correct `this` binding in Express.
- **Services** (`src/services/`): Business logic, orchestration, Cloudinary operations, Prisma transactions.
- **Repositories** (`src/repositories/`): Data access only. Thin Prisma wrappers, one class per model.
- **DTOs** (`src/dto/`): `class-validator`/`class-transformer` decorated classes for request validation.

### Frontend — Next.js App Router

- `app/` — File-system routing with server components (async data fetching) and client components
- `store/` — Zustand stores for client-side state (cart)
- `services/` — API call wrappers using `fetch`
- Path alias: `@/` maps to project root (e.g., `@/components/Foo`)

## Database

- **ORM**: Prisma 6 — schema at `backend/prisma/schema.prisma`
- **DB**: MySQL via `DATABASE_URL` env var
- Models: `User`, `Category`, `Product`, `Cart` (1:1 with User), `CartItem`, `Order`, `OrderItem`
- All IDs are auto-increment `Int`

## Authentication

- Stateless JWT (Bearer token in `Authorization` header)
- `bcrypt` for password hashing (salt rounds: 10)
- Token payload: `{ id, email, role }`, expires in 1h
- Two roles: `"customer"` (default), `"admin"`
- Middleware chain for protected routes: `authMiddleware → roleGuard → validateDto → controller`

## Key Conventions

- **Language**: UI text and comments in **Spanish**; code identifiers in English
- **ES Modules**: Backend uses `"type": "module"` — all internal imports must use `.js` extension (even for `.ts` source files)
- **File naming**: `<name>.<type>.ts` (e.g., `product.controller.ts`, `auth.services.ts`, `cart.dto.ts`)
- **TypeScript**: `strict: true` with `experimentalDecorators` and `emitDecoratorMetadata` enabled (required for class-validator)
- **Error responses**: `{ error: string }` or `{ errors: string[] }` for validation errors
- **Image uploads**: Cloudinary via `express-fileupload`, max 5MB, stored at `ECOMMERCE/PRODUCTS/<timestamp>_<name>`

## Required Environment Variables

### Backend (`backend/.env`)

- `DATABASE_URL` — MySQL connection string (required, app throws on startup if missing)
- `JWT_SECRET` — JWT signing secret (required)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for Cloudinary image uploads

### Frontend (`frontend/frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` — Backend API base URL
