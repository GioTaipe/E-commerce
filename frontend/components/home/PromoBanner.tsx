"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { useOfferStore } from "@/store/offer.store";

const DEFAULT_EYEBROW = "Oferta especial";
const DEFAULT_TITLE = "Hasta 30% de descuento";
const DEFAULT_DESCRIPTION =
  "Aprovecha nuestras ofertas exclusivas en productos seleccionados de temporada.";
const DEFAULT_BUTTON_TEXT = "Ver ofertas";

interface PromoBannerProps {
  products: Product[];
}

export default function PromoBanner({ products }: PromoBannerProps) {
  const promoProducts = products.slice(0, 2);
  const activeOffer = useOfferStore((s) => s.offers.find((o) => o.active));

  const eyebrow = activeOffer?.eyebrow || DEFAULT_EYEBROW;
  const title = activeOffer?.title || DEFAULT_TITLE;
  const description = activeOffer?.description || DEFAULT_DESCRIPTION;
  const buttonText = activeOffer?.buttonText || DEFAULT_BUTTON_TEXT;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — Dark promo card */}
        <div className="relative overflow-hidden rounded-2xl bg-dark px-8 py-12 lg:px-12 lg:py-16 flex flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
            {eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            {description}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex w-fit items-center rounded-full bg-secondary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-dark hover:bg-secondary/90 transition-colors"
          >
            {buttonText}
          </Link>
        </div>

        {/* Right — 2 product cards */}
        <div className="grid grid-cols-2 gap-4">
          {promoProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative overflow-hidden rounded-2xl bg-cream"
            >
              <div className="relative aspect-square">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-surface font-heading">
                    TechZone
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-ink truncate">{product.name}</p>
                <p className="text-xs font-semibold text-accent">
                  {formatCurrency(Number(product.price))}
                </p>
              </div>
            </Link>
          ))}
          {promoProducts.length === 0 && (
            <>
              <div className="rounded-2xl bg-cream aspect-square flex items-center justify-center text-surface font-heading">TechZone</div>
              <div className="rounded-2xl bg-cream aspect-square flex items-center justify-center text-surface font-heading">TechZone</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
