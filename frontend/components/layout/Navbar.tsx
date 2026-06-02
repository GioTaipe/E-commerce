"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, LogOut, User, ClipboardList, Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "productos", label: "Conoce nuestros productos" },
  { id: "categorias", label: "Categorías" },
  { id: "estilos", label: "Estilos" },
  { id: "porque", label: "Por qué TechZone" },
] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, reset } = useCartStore();
  const { openCart } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const isHome = pathname === "/";

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Resalta el pill activo según la sección visible en home (scroll spy).
  useEffect(() => {
    if (!isHome) return;
    const handler = () => {
      const sections = SECTIONS.map((s) => ({ id: s.id, el: document.getElementById(s.id) }))
        .filter((s) => s.el);
      const offset = 120; // a la altura del nav + un pelín
      let current = sections[0]?.id ?? "inicio";
      for (const s of sections) {
        const rect = s.el!.getBoundingClientRect();
        if (rect.top - offset <= 0) current = s.id;
      }
      setActiveSection(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHome]);

  const handleLogout = () => {
    logout();
    reset();
    router.push("/login");
  };

  const navLinkHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-black/[0.78] backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1280px] h-16 flex items-center justify-between px-[22px] gap-4">
        <Link
          href="/"
          className="font-heading text-[18px] font-medium tracking-[0.02em] text-ink shrink-0"
        >
          TechZone
        </Link>

        {/* Pill nav — desktop */}
        <ul className="hidden lg:flex items-center gap-1 list-none p-[5px] m-0 bg-white/[0.05] border border-white/10 rounded-full backdrop-blur-[20px]">
          {SECTIONS.map((s) => {
            const active = isHome && activeSection === s.id;
            return (
              <li key={s.id}>
                <Link href={navLinkHref(s.id)} className={pillClass(active)}>
                  {s.label}
                </Link>
              </li>
            );
          })}
          {isAuthenticated && user?.role === "admin" && (
            <li>
              <Link href="/admin" className={pillClass(pathname.startsWith("/admin"), true)}>
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-[18px]">
          <Link
            href="/#productos"
            className="text-ink opacity-[0.88] hover:opacity-100 transition-opacity"
            aria-label="Buscar"
          >
            <Search size={16} strokeWidth={1.6} />
          </Link>

          {isAuthenticated && user ? (
            <Link
              href="/orders"
              className="text-ink opacity-[0.88] hover:opacity-100 transition-opacity hidden sm:block"
              aria-label="Mis pedidos"
              title="Mis pedidos"
            >
              <ClipboardList size={16} strokeWidth={1.6} />
            </Link>
          ) : null}

          {isAuthenticated && user ? (
            <button
              onClick={handleLogout}
              className="text-ink opacity-[0.88] hover:opacity-100 transition-opacity"
              title={`Cerrar sesión (${user.name})`}
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} strokeWidth={1.6} />
            </button>
          ) : (
            <Link
              href="/login"
              className="text-ink opacity-[0.88] hover:opacity-100 transition-opacity hidden sm:block"
              aria-label="Iniciar sesión"
            >
              <User size={16} strokeWidth={1.6} />
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative text-ink opacity-[0.88] hover:opacity-100 transition-opacity"
            aria-label="Carrito"
          >
            <ShoppingBag size={16} strokeWidth={1.6} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-ink"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3 animate-fade-in">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={navLinkHref(s.id)}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-ink/80 hover:text-ink"
            >
              {s.label}
            </Link>
          ))}
          <div className="h-px bg-white/[0.08] my-1" />
          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-ink/80 hover:text-ink"
              >
                <ClipboardList size={16} />
                Mis pedidos
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-accent"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent"
              >
                <LogOut size={16} />
                Salir ({user?.name})
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-ink/80 hover:text-ink"
            >
              <User size={16} />
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function pillClass(active: boolean, isAccent = false) {
  const base = "font-heading text-[14px] font-medium px-[18px] py-2 rounded-full inline-block leading-none transition-all duration-200";
  if (active) return `${base} bg-[#f5f5f7] text-[#1d1d1f]`;
  if (isAccent) return `${base} text-accent opacity-[0.9] hover:opacity-100`;
  return `${base} text-ink opacity-[0.78] hover:opacity-100`;
}
