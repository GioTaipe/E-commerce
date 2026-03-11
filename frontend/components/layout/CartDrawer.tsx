"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { formatCurrency } from "@/utils/formatCurrency";
import CartDrawerItem from "./CartDrawerItem";

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUIStore();
  const { items, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isCartOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isCartOpen, isAuthenticated, fetchCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    closeCart();
    router.push("/cart");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-bg shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-heading text-lg font-semibold text-ink">
            Tu carrito
          </h2>
          <button
            onClick={closeCart}
            className="text-muted hover:text-ink transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingBag size={40} className="text-surface" />
              <p className="text-sm text-muted">Inicia sesion para ver tu carrito</p>
              <button
                onClick={() => { closeCart(); router.push("/login"); }}
                className="rounded-full bg-dark text-white px-6 py-2.5 text-sm font-medium hover:bg-ink transition-colors"
              >
                Iniciar sesion
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingBag size={40} className="text-surface" />
              <p className="text-sm text-muted">Tu carrito esta vacio</p>
              <button
                onClick={() => { closeCart(); router.push("/products"); }}
                className="rounded-full bg-dark text-white px-6 py-2.5 text-sm font-medium hover:bg-ink transition-colors"
              >
                Explorar tienda
              </button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartDrawerItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-lg font-semibold font-heading text-ink">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full rounded-full bg-dark text-white py-3 text-sm font-semibold uppercase tracking-widest hover:bg-ink transition-colors"
            >
              Ir al carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
