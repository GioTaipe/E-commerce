"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, LogOut, ClipboardList, Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, reset } = useCartStore();
  const { openCart } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    reset();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-9xl px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-logo text-2xl text-ink tracking-wide">
          TechZone
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
            Tienda
          </Link>
          {isAuthenticated && (
            <Link href="/orders" className="text-sm font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
              Pedidos
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/admin" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors tracking-wide uppercase">
              Admin
            </Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Link href="/products" className="text-ink hover:text-accent transition-colors hidden sm:block">
            <Search size={20} strokeWidth={1.5} />
          </Link>

          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-muted uppercase tracking-wide">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-muted hover:text-accent transition-colors"
                title="Cerrar sesion"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-ink hover:text-accent transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative text-ink hover:text-accent transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-4 flex flex-col gap-4 animate-fade-in">
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-muted hover:text-ink tracking-wide uppercase"
          >
            Tienda
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink tracking-wide uppercase"
              >
                <ClipboardList size={16} />
                Pedidos
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 tracking-wide uppercase"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent tracking-wide uppercase"
              >
                <LogOut size={16} />
                Salir ({user?.name})
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted hover:text-ink tracking-wide uppercase"
            >
              Iniciar sesion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
