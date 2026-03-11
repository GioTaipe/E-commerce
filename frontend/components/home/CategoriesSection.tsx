import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/types/product";

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
}

export default function CategoriesSection({ categories, products }: CategoriesSectionProps) {
  const displayCategories = categories.slice(0, 3);

  if (displayCategories.length === 0) return null;

  // Buscar la primera imagen de producto para cada categoria
  const categoryImage = (categoryId: number) => {
    const product = products.find(
      (p) => p.categoryId === categoryId && p.imageUrl
    );
    return product?.imageUrl ?? null;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Categorias
        </span>
        <h2 className="mt-2 font-heading text-3xl sm:text-4xl">
          Encuentra lo que necesitas
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[300px]">
        {displayCategories.map((cat, i) => {
          const imgUrl = categoryImage(cat.id);

          return (
            <Link
              key={cat.id}
              href="/products"
              className={`group relative overflow-hidden rounded-2xl bg-cream ${
                i === 0 ? "sm:col-span-2 sm:row-span-1" : ""
              }`}
            >
              {/* Product image as background */}
              {imgUrl && (
                <Image
                  src={imgUrl}
                  alt={cat.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  sizes={i === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                />
              )}

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent z-10" />

              {/* Content overlay */}
              <div className="relative z-20 flex h-full min-h-[200px] flex-col justify-end p-6">
                <h3 className="font-heading text-2xl text-white">{cat.name}</h3>
                <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  Ver productos &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
