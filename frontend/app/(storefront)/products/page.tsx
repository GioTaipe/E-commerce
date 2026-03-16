import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { Product, Category } from "@/types/product";
import ProductsPageClient from "./ProductsPageClient";

export const revalidate = 60; // 👈 ISR: revalida cada 60s
export const dynamic = 'force-dynamic'; // 👈 alternativa: siempre SSR
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // 👈 aquí
export default async function ProductsPage() {
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Catalogo
        </span>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl">Nuestra tienda</h1>
        <p className="mt-3 text-sm text-muted max-w-lg">
          Explora nuestro catalogo completo de productos tecnologicos.
        </p>
      </div>

      <ProductsPageClient products={products} categories={categories} />
    </div>
  );
}