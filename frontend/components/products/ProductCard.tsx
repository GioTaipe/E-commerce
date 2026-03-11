"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast("Inicia sesion para agregar productos", "info");
      return;
    }

    try {
      await addItem(product.id, 1);
      openCart();
      addToast("Producto agregado al carrito", "success");
    } catch {
      addToast("Error al agregar producto", "error");
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        {isNew && <Badge>Nuevo</Badge>}

        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag size={40} className="text-surface" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/40 to-transparent">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-800 hover:bg-cream hover:text-gray-900 transition-colors"
          >
            <ShoppingBag size={14} />
            Agregar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {product.category && (
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-ink truncate">{product.name}</h3>
        <p className="text-sm font-semibold text-accent">
          {formatCurrency(Number(product.price))}
        </p>
      </div>
    </Link>
  );
}
