"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import type { Category } from "@/types/product";

type ImageSlot = "image" | "image2" | "image3";

export default function NewProductPage() {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [images, setImages] = useState<Record<ImageSlot, File | null>>({
    image: null,
    image2: null,
    image3: null,
  });
  const [previews, setPreviews] = useState<Record<ImageSlot, string | null>>({
    image: null,
    image2: null,
    image3: null,
  });

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (slot: ImageSlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImages((prev) => ({ ...prev, [slot]: file }));
    setPreviews((prev) => ({
      ...prev,
      [slot]: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleRemove = (slot: ImageSlot) => () => {
    setImages((prev) => ({ ...prev, [slot]: null }));
    setPreviews((prev) => ({ ...prev, [slot]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      addToast("Completa los campos obligatorios", "error");
      return;
    }
    if (!images.image) {
      addToast("La imagen principal es obligatoria", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (form.categoryId) formData.append("categoryId", form.categoryId);
      formData.append("image", images.image);
      if (images.image2) formData.append("image2", images.image2);
      if (images.image3) formData.append("image3", images.image3);

      await productService.create(formData);
      addToast("Producto creado");
      router.push("/admin/products");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error creando producto", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const slots: { key: ImageSlot; label: string; required: boolean }[] = [
    { key: "image", label: "Imagen principal *", required: true },
    { key: "image2", label: "Imagen secundaria", required: false },
    { key: "image3", label: "Imagen terciaria", required: false },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Productos"
        title="Nuevo producto"
        action={
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-bg p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Descripcion
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Categoria
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">Sin categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3 image slots */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Imágenes (hasta 3)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slots.map(({ key, label }) => (
                <div key={key}>
                  <div className="relative">
                    <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs text-muted hover:border-accent transition-colors overflow-hidden">
                      {previews[key] ? (
                        <Image src={previews[key] as string} alt={label} fill className="object-cover" sizes="200px" />
                      ) : (
                        <>
                          <Upload size={18} />
                          <span className="text-center px-2">{label}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange(key)}
                        className="hidden"
                      />
                    </label>
                    {previews[key] && (
                      <button
                        type="button"
                        onClick={handleRemove(key)}
                        aria-label={`Eliminar ${label}`}
                        title="Eliminar imagen"
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {images[key] && (
                    <p className="mt-1 text-[11px] text-muted truncate">{images[key]?.name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-dark py-3 text-sm font-medium text-white hover:bg-ink transition-colors disabled:opacity-50"
        >
          {submitting ? "Creando..." : "Crear producto"}
        </button>
      </form>
    </div>
  );
}
