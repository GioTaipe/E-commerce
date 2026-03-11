import Link from "next/link";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { Product, Category } from "@/types/product";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeatureBand from "@/components/home/FeatureBand";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import ProductGrid from "@/components/products/ProductGrid";

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    [products, categories] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ]);
  } catch {
    products = [];
    categories = [];
  }

  const featured = products.slice(0, 8);

  return (
    <>
      <Hero products={products} />
      <Marquee />

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Lo mas destacado
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl">
                Productos destacados
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink transition-colors"
            >
              Ver todos &rarr;
            </Link>
          </div>
          <ProductGrid products={featured} />
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink transition-colors"
            >
              Ver todos los productos &rarr;
            </Link>
          </div>
        </section>
      )}

      <CategoriesSection categories={categories} products={products} />
      <FeatureBand />
      <PromoBanner products={products.slice(4, 6)} />
      <Newsletter />
    </>
  );
}
