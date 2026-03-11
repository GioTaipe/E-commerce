"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { useToastStore } from "@/store/toast.store";
import Loader from "@/components/ui/Loader";
import { useAuthReady } from "@/hooks/useHydration";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const ready = useAuthReady();
  const { items, isLoading, error, fetchCart, updateQuantity, removeItem, clear } = useCartStore();
  const { addToast } = useToastStore();

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

  const handleCreateOrder = async () => {
    try {
      await api.post("/orders", {});
      await clear();
      addToast("Pedido creado exitosamente", "success");
      router.push("/orders");
    } catch {
      addToast("Error al crear la orden. Intenta de nuevo.", "error");
    }
  };

  if (!ready || !isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center gap-4">
        <Link
          href="/products"
          className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Seguir comprando
        </Link>
      </div>

      <div className="mb-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Tu seleccion
        </span>
        <h1 className="mt-2 font-heading text-4xl">Mi carrito</h1>
      </div>

      {isLoading && <Loader text="Cargando carrito..." />}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-cream py-20">
          <ShoppingBag size={48} className="text-surface" />
          <p className="text-sm text-muted">Tu carrito esta vacio</p>
          <Link
            href="/products"
            className="rounded-full bg-dark px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink transition-colors"
          >
            Explorar tienda
          </Link>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-2xl border border-border bg-bg p-4 animate-fade-in"
              >
                {/* Image */}
                <div className="relative h-28 w-22 flex-shrink-0 overflow-hidden rounded-xl bg-cream">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="88px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      Sin img
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink">{item.product.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        Precio unitario: {formatCurrency(Number(item.product.price))}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-muted hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 border border-border rounded-full">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="p-2 text-muted hover:text-ink disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
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
                    <span className="text-sm font-semibold text-ink">
                      {formatCurrency(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-cream p-6">
              <h3 className="font-heading text-lg font-semibold mb-6">Resumen</h3>

              <div className="space-y-3 border-b border-border pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    {items.length} {items.length === 1 ? "producto" : "productos"}
                  </span>
                  <button
                    onClick={() => clear()}
                    disabled={isLoading}
                    className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                  >
                    Vaciar
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-ink">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Envio</span>
                  <span className="font-medium text-accent">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold uppercase tracking-widest text-muted">Total</span>
                <span className="text-2xl font-semibold font-heading text-ink">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isLoading}
                className="w-full rounded-full bg-dark py-3.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
