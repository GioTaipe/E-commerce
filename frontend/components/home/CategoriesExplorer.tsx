"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category, Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";

interface CategoriesExplorerProps {
  categories: Category[];
  products: Product[];
}

// Copy editorial por categoría — se usa el slug del nombre para casarlo.
const COPY: Record<string, { eyebrow: string; heading: string; sub: string }> = {
  smartphones: {
    eyebrow: "SMARTPHONES Y TABLETS",
    heading: "iPhone & iPad.\nLa cámara que cabe en tu bolsillo.",
    sub: "Chip A19 Pro, telefoto 5x y titanio aeroespacial. Toda la potencia con el lenguaje que ya conoces.",
  },
  audio: {
    eyebrow: "AUDIO",
    heading: "AirPods.\nSonido que te envuelve.",
    sub: "Cancelación adaptativa, audio espacial y carga rápida. La libertad inalámbrica, sin compromisos.",
  },
  gaming: {
    eyebrow: "GAMING",
    heading: "Gaming.\nTu setup, sin compromisos.",
    sub: "Monitores 240 Hz, mecánicos de baja latencia y periféricos diseñados para ganar.",
  },
  camaras: {
    eyebrow: "CÁMARAS",
    heading: "Cámaras.\nCaptura cada momento.",
    sub: "Lentes intercambiables, sensores full frame y vídeo 8K. Lleva tu creatividad al siguiente nivel.",
  },
  ordenadores: {
    eyebrow: "ORDENADORES",
    heading: "MacBook.\nMás rendimiento, misma autonomía.",
    sub: "Chip M5, pantalla Liquid Retina XDR y hasta 22 h de batería. El portátil que te sigue el ritmo.",
  },
  relojs: {
    eyebrow: "WEARABLE",
    heading: "Watch.\nTu salud, en tu muñeca.",
    sub: "Sensores avanzados, GPS de precisión y hasta 72 h de autonomía. Tres tamaños, dos acabados de titanio.",
  },
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function copyFor(name: string) {
  const key = slugify(name);
  // Match exacto o por prefijo (e.g. "smartphones-y-tablets" → "smartphones")
  if (COPY[key]) return COPY[key];
  const match = Object.keys(COPY).find((k) => key.startsWith(k));
  return match ? COPY[match] : {
    eyebrow: name.toUpperCase(),
    heading: `${name}.`,
    sub: `Descubre todos los productos de ${name.toLowerCase()}.`,
  };
}

export default function CategoriesExplorer({ categories, products }: CategoriesExplorerProps) {
  const visibleCategories = useMemo(() => categories, [categories]);
  const [activeId, setActiveId] = useState<number>(visibleCategories[0]?.id ?? 0);
  const [expanded, setExpanded] = useState(false);

  const activeCategory = visibleCategories.find((c) => c.id === activeId);
  const activeProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeId),
    [products, activeId]
  );

  if (visibleCategories.length === 0) return null;

  const copy = activeCategory ? copyFor(activeCategory.name) : null;

  return (
    <section id="categorias" className="px-[22px] pt-[88px] pb-8 scroll-mt-[110px]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-heading font-semibold text-[36px] sm:text-[56px] tracking-[-0.015em] leading-[1.05] text-ink m-0 mb-7">
          Categorías
        </h2>

        {/* Tabs pill */}
        <nav
          role="tablist"
          aria-label="Categorías"
          className="inline-flex flex-wrap gap-2 p-1.5 mb-10 bg-[rgba(20,20,22,0.6)] border border-white/[0.08] rounded-full backdrop-blur-[20px]"
        >
          {visibleCategories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveId(cat.id);
                  setExpanded(false);
                }}
                className={`appearance-none border-0 font-body text-[14px] font-medium tracking-[-0.005em] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${
                  active
                    ? "bg-[#f5f5f7] text-[#1d1d1f] opacity-100"
                    : "bg-transparent text-ink opacity-[0.78] hover:opacity-100"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>

        {/* Active panel */}
        {activeCategory && copy && (
          <article
            key={activeCategory.id}
            className="bg-[#0a0a0a] rounded-[28px] overflow-hidden animate-fade-in"
          >
            {/* Hero (always visible) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 items-center p-8 sm:p-14 min-h-[420px]">
              <div className="relative min-h-[260px] md:min-h-[360px] -m-8 sm:-m-14 md:-ml-14 md:-mt-14 md:-mb-14 md:mr-0 overflow-hidden flex items-center justify-center">
                <CategoryArt product={activeProducts[0]} />
              </div>
              <div>
                <p className="font-heading text-[13px] font-semibold tracking-[0.16em] uppercase text-muted m-0 mb-3.5">
                  {copy.eyebrow}
                </p>
                <h3 className="font-heading text-[32px] sm:text-[44px] font-semibold tracking-[-0.015em] leading-[1.05] text-ink m-0 mb-4 whitespace-pre-line">
                  {copy.heading}
                </h3>
                <p className="text-[17px] leading-[1.45] text-[#c7c7cc] m-0 mb-6 max-w-[36ch]">
                  {copy.sub}
                </p>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="neu-button px-5 py-2.5 text-[14px] font-medium inline-flex items-center gap-1.5"
                >
                  {expanded ? "Ocultar productos ›" : `Ver ${activeCategory.name} ›`}
                </button>
              </div>
            </div>

            {/* Expanded carousel of products */}
            {expanded && (
              <div className="border-t border-white/[0.06] px-6 sm:px-14 py-8 animate-fade-in">
                {activeProducts.length === 0 ? (
                  <p className="text-muted text-center py-12">
                    Próximamente — aún no tenemos productos en esta categoría.
                  </p>
                ) : (
                  <CategoryProductsCarousel products={activeProducts} />
                )}
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

function CategoryArt({ product }: { product: Product | undefined }) {
  if (product?.imageUrl) {
    return (
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 540px"
        className="object-contain p-10"
      />
    );
  }
  return (
    <div
      className="w-[60%] h-[60%]"
      style={{
        borderRadius: 24,
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.12), transparent 60%), linear-gradient(160deg, #2a2a2d, #0a0a0a)",
      }}
    />
  );
}

function CategoryProductsCarousel({ products }: { products: Product[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const scroll = (dir: -1 | 1) => {
    if (!rowRef.current) return;
    const step = Math.min(rowRef.current.clientWidth * 0.85, 380);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading text-[12px] font-semibold tracking-[0.14em] uppercase text-muted m-0">
          {products.length} {products.length === 1 ? "producto disponible" : "productos disponibles"}
        </p>
        {products.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Anterior"
              className="w-9 h-9 rounded-full bg-[#1d1d1f] text-ink flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Siguiente"
              className="w-9 h-9 rounded-full bg-[#1d1d1f] text-ink flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={rowRef}
        className="no-scrollbar grid grid-flow-col auto-cols-[280px] sm:auto-cols-[340px] gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {products.map((product) => (
          <CategoryProductCard
            key={product.id}
            product={product}
            onAdd={() => handleAdd(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(
    (url): url is string => !!url
  );
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const currentImage = images[index] ?? null;

  const handleImageClick = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article className="snap-start flex flex-col bg-[#131315] rounded-[18px] overflow-hidden">
      <div
        onClick={handleImageClick}
        role={hasMultiple ? "button" : undefined}
        aria-label={hasMultiple ? `Imagen ${index + 1} de ${images.length}` : undefined}
        className={`relative aspect-square flex items-center justify-center bg-[#0a0a0a] ${
          hasMultiple ? "cursor-pointer" : ""
        }`}
      >
        {currentImage ? (
          <Image
            key={currentImage}
            src={currentImage}
            alt={product.name}
            fill
            sizes="340px"
            className="object-contain p-7 animate-fade-in"
          />
        ) : (
          <div className="text-muted">Sin imagen</div>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-1.5 pt-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-ink" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h4 className="font-heading text-[17px] font-semibold tracking-[-0.01em] leading-tight text-ink m-0">
          {product.name}
        </h4>
        <p className="text-[13px] text-muted leading-[1.4] m-0 line-clamp-3">
          {product.description ?? "Producto disponible en TechZone."}
        </p>
        <p className="text-[15px] font-semibold text-ink m-0">
          {formatCurrency(Number(product.price))}
        </p>
        <button
          onClick={onAdd}
          disabled={product.stock <= 0}
          className="neu-button mt-2 inline-flex items-center justify-center gap-2 text-[13px] font-medium py-2.5"
        >
          <Plus size={14} />
          {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
        </button>
      </div>
    </article>
  );
}
