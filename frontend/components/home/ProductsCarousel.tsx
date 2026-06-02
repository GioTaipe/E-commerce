"use client";

import { useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";

interface ProductsCarouselProps {
  products: Product[];
}

export default function ProductsCarousel({ products }: ProductsCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const scroll = (dir: -1 | 1) => {
    if (!rowRef.current) return;
    const step = Math.min(rowRef.current.clientWidth * 0.85, 334);
    rowRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const handleAdd = async (productId: number) => {
    if (!isAuthenticated) {
      addToast("Inicia sesión para agregar productos", "info");
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

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="productos" className="relative px-[22px] pt-[88px] scroll-mt-[110px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -top-[120px] h-[180px] z-[3] backdrop-blur-[14px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 55%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 60%, #000 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 60%, #000 100%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto mb-6">
        <h2 className="font-heading font-semibold text-[36px] sm:text-[56px] tracking-[-0.015em] leading-[1.05] text-ink m-0">
          Conoce nuestros productos.
        </h2>
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          className="absolute left-2 sm:left-4 top-[140px] sm:top-[160px] -translate-y-1/2 z-[4] w-11 h-11 rounded-full bg-[#1d1d1f]/85 backdrop-blur-md text-ink flex items-center justify-center cursor-pointer hover:bg-[#2a2a2c] transition-colors text-xl"
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Siguiente"
          className="absolute right-2 sm:right-4 top-[140px] sm:top-[160px] -translate-y-1/2 z-[4] w-11 h-11 rounded-full bg-[#1d1d1f]/85 backdrop-blur-md text-ink flex items-center justify-center cursor-pointer hover:bg-[#2a2a2c] transition-colors text-xl"
        >
          ›
        </button>

      <div
        ref={rowRef}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
        className="no-scrollbar grid grid-flow-col auto-cols-[280px] sm:auto-cols-[320px] gap-3.5 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <article
            key={product.id}
            className="snap-start flex flex-col bg-[#0a0a0a] hover:bg-[#131315] rounded-[20px] overflow-hidden transition-all duration-300 group"
          >
            <div className="relative aspect-square flex items-center justify-center bg-[#0a0a0a] group-hover:bg-[#131315] transition-colors">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="320px"
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-muted">Sin imagen</div>
              )}
            </div>
            <div className="p-6 pt-5 flex flex-col gap-2 flex-1">
              {product.category && (
                <p className="font-heading text-[11px] font-semibold tracking-[0.16em] uppercase text-muted m-0">
                  {product.category.name}
                </p>
              )}
              <h3 className="font-heading text-[19px] font-semibold tracking-[-0.01em] leading-tight text-ink m-0">
                {product.name}
              </h3>
              <p className="text-[14px] text-muted m-0">
                Desde <strong className="text-ink font-semibold">{formatCurrency(Number(product.price))}</strong>
              </p>
              <button
                onClick={() => handleAdd(product.id)}
                disabled={product.stock <= 0}
                className="neu-button mt-3 inline-flex items-center justify-center gap-2 text-[13px] font-medium py-2.5"
              >
                <Plus size={14} />
                {product.stock > 0 ? "Agregar" : "Agotado"}
              </button>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
