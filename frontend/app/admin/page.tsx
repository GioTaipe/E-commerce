"use client";

import Link from "next/link";
import { Package, Tag, Percent, UserPlus } from "lucide-react";

const cards = [
  {
    href: "/admin/products",
    label: "Productos",
    description: "Gestionar catalogo de productos",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categorias",
    description: "Crear y editar categorias",
    icon: Tag,
  },
  {
    href: "/admin/offers",
    label: "Ofertas",
    description: "Gestionar banners promocionales",
    icon: Percent,
  },
  {
    href: "/admin/users/new",
    label: "Crear usuario",
    description: "Registrar nuevos administradores",
    icon: UserPlus,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Administracion
        </span>
        <h1 className="mt-1 font-heading text-3xl">Panel de control</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-border bg-bg p-6 transition-all hover:shadow-md hover:border-accent/30"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface/50 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-lg">{label}</h2>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
