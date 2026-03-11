import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

interface HeroProps {
  products: Product[];
}

export default function Hero({ products }: HeroProps) {
  const heroImages = products.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — Text */}
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-cream px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Ofertas de temporada
          </span>

          <h1 className="font-heading text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Potencia tu<br />
            setup <em className="text-accent">al maximo</em>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted">
            Descubre laptops, PC gaming, perifericos y accesorios de las
            mejores marcas. Rendimiento y calidad garantizados.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-accent/90 transition-colors"
            >
              Ver productos
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-border px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ink hover:bg-cream transition-colors"
            >
              Ofertas destacadas
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-6 border-t border-border">
            <div>
              <p className="font-heading text-3xl font-semibold">500+</p>
              <p className="text-xs text-muted uppercase tracking-wide">Productos</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold">80+</p>
              <p className="text-xs text-muted uppercase tracking-wide">Marcas</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold">25k+</p>
              <p className="text-xs text-muted uppercase tracking-wide">Clientes</p>
            </div>
          </div>
        </div>

        {/* Right — Image grid 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {heroImages.map((product, i) => (
            <div
              key={product.id}
              className="relative overflow-hidden rounded-2xl bg-cream aspect-square"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  priority={i < 2}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-surface font-heading text-lg">
                  TechZone
                </div>
              )}
            </div>
          ))}
          {/* Fill remaining if less than 4 products */}
          {Array.from({ length: Math.max(0, 4 - heroImages.length) }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="relative aspect-square overflow-hidden rounded-2xl bg-cream flex items-center justify-center"
            >
              <span className="text-surface font-heading text-lg">TechZone</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
