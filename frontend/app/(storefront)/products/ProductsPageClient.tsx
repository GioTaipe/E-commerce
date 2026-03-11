"use client";

import { useState, useMemo } from "react";
import type { Product, Category } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilterBar from "@/components/products/ProductFilterBar";

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory !== null) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <ProductFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-full border border-border bg-bg px-4 py-2 text-xs font-medium text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="default">Ordenar por</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="text-center py-20">
          <p className="text-muted text-sm">No se encontraron productos en esta categoria.</p>
        </div>
      )}
    </div>
  );
}
