"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/utils/formatCurrency";
import Loader from "@/components/ui/Loader";
import { useAuthReady } from "@/hooks/useHydration";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const ready = useAuthReady();
  const { items, isLoading, error, fetchCart, updateQuantity, removeItem, clear } = useCartStore();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchCart();
  }, [ready, isAuthenticated, router, fetchCart]);

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!ready || !isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex items-center gap-4">
        <Link
          href="/#productos"
          className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.16em] text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Seguir comprando
        </Link>
      </div>

      <div className="mb-12">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          Tu selección
        </span>
        <h1 className="mt-2 font-heading font-semibold text-[40px] sm:text-[56px] tracking-[-0.015em] leading-[1.05] text-ink">
          Mi carrito.
        </h1>
      </div>

      {isLoading && <Loader text="Cargando carrito..." />}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] bg-[#0a0a0a] border border-white/[0.04] py-24">
          <ShoppingBag size={48} className="text-muted" />
          <p className="text-[17px] text-muted">Tu carrito está vacío</p>
          <Link
            href="/#productos"
            className="neu-button px-6 py-2.5 text-[14px] font-medium"
          >
            Explorar tienda
          </Link>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-5 animate-fade-in"
              >
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-[#161617]">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-3"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      Sin img
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink text-[16px]">{item.product.name}</p>
                      <p className="text-[13px] text-muted mt-1">
                        {formatCurrency(Number(item.product.price))} / unidad
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-muted hover:text-red-400 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-[#1d1d1f] rounded-full">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="p-2 text-muted hover:text-ink disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-7 text-center text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-2 text-muted hover:text-ink disabled:opacity-30 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-[15px] font-semibold text-ink">
                      {formatCurrency(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6">
              <h3 className="font-heading text-[19px] font-semibold mb-6 text-ink">Resumen</h3>

              <div className="space-y-3 border-b border-white/[0.08] pb-4 mb-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted">
                    {items.length} {items.length === 1 ? "producto" : "productos"}
                  </span>
                  <button
                    onClick={() => clear()}
                    disabled={isLoading}
                    className="text-[12px] font-medium text-red-400 hover:underline disabled:opacity-50"
                  >
                    Vaciar
                  </button>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-ink">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted">Envío</span>
                  <span className="font-medium text-accent">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Total
                </span>
                <span className="text-[28px] font-semibold font-heading text-ink tracking-[-0.015em]">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="neu-button w-full py-3.5 text-[14px] font-medium"
              >
                Continuar al pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
