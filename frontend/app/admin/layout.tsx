"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tag, Percent, UserPlus, LogOut, Store } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

const navItems = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tag },
  { href: "/admin/offers", label: "Ofertas", icon: Percent },
  { href: "/admin/users/new", label: "Crear usuario", icon: UserPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const resetCart = useCartStore((s) => s.reset);

  const handleLogout = () => {
    logout();
    resetCart();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <AdminGuard>
      <div className="flex h-screen bg-cream">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-dark text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <span className="font-logo text-xl tracking-wide">TechZone</span>
            <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Admin
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Store size={18} strokeWidth={1.5} />
              Volver a la tienda
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 ml-60 flex flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-end gap-4 border-b border-border bg-bg/80 backdrop-blur-md px-6 py-3">
            <span className="text-xs text-muted uppercase tracking-wide">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors uppercase tracking-wide"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Salir
            </button>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
