"use client";

import type { Category } from "@/types/product";

interface ProductFilterBarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function ProductFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProductFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
          selectedCategory === null
            ? "bg-accent text-white"
            : "bg-cream text-muted hover:bg-surface hover:text-ink"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
            selectedCategory === cat.id
              ? "bg-accent text-white"
              : "bg-cream text-muted hover:bg-surface hover:text-ink"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
