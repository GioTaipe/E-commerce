"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";

interface AddToCartButtonProps {
  productId: number;
  inStock: boolean;
}

export default function AddToCartButton({ productId, inStock }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCartStore();
  const { openCart } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const handleAdd = async () => {
    if (!isAuthenticated) {
      addToast("Inicia sesion para agregar productos", "info");
      return;
    }
    try {
      await addItem(productId, 1);
      openCart();
      addToast("Producto agregado al carrito", "success");
    } catch {
      addToast("Error al agregar producto", "error");
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || isLoading}
      className="flex items-center justify-center gap-3 rounded-full bg-dark py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50 transition-colors w-full max-w-sm"
    >
      <ShoppingBag size={16} />
      {!inStock ? "Agotado" : isLoading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}
