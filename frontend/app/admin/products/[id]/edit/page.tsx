"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import type { Category } from "@/types/product";

type ImageSlot = "image" | "image2" | "image3";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const addToast = useToastStore((s) => s.addToast);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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
  // Marcado true cuando el usuario pulsa X sobre una imagen existente.
  // Se envía como `removeImage{N}=true` al backend para que la borre.
  const [removed, setRemoved] = useState<Record<ImageSlot, boolean>>({
    image: false,
    image2: false,
    image3: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [product, cats] = await Promise.all([
          productService.getById(id),
          categoryService.getAll(),
        ]);
        setCategories(cats);
        setForm({
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          stock: String(product.stock),
          categoryId: product.categoryId ? String(product.categoryId) : "",
        });
        setPreviews({
          image: product.imageUrl ?? null,
          image2: product.imageUrl2 ?? null,
          image3: product.imageUrl3 ?? null,
        });
      } catch {
        addToast("Error cargando producto", "error");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (slot: ImageSlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImages((prev) => ({ ...prev, [slot]: file }));
    if (file) {
      setPreviews((prev) => ({ ...prev, [slot]: URL.createObjectURL(file) }));
      setRemoved((prev) => ({ ...prev, [slot]: false }));
    }
  };

  const handleRemove = (slot: ImageSlot) => () => {
    setImages((prev) => ({ ...prev, [slot]: null }));
    setPreviews((prev) => ({ ...prev, [slot]: null }));
    setRemoved((prev) => ({ ...prev, [slot]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      addToast("Completa los campos obligatorios", "error");
      return;
    }

    // Validación: al menos una imagen tras los cambios.
    const slotsRemainingCount = (["image", "image2", "image3"] as ImageSlot[])
      .filter((s) => images[s] || previews[s])
      .length;
    if (slotsRemainingCount === 0) {
      addToast("El producto debe conservar al menos una imagen", "error");
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

      (["image", "image2", "image3"] as ImageSlot[]).forEach((slot) => {
        const flagKey = slot === "image" ? "removeImage" : slot === "image2" ? "removeImage2" : "removeImage3";
        if (images[slot]) {
          formData.append(slot, images[slot] as File);
        } else if (removed[slot]) {
          formData.append(flagKey, "true");
        }
      });

      await productService.update(id, formData);
      addToast("Producto actualizado");
      router.push("/admin/products");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error actualizando producto", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
      </div>
    );
  }

  const slots: { key: ImageSlot; label: string }[] = [
    { key: "image", label: "Imagen principal" },
    { key: "image2", label: "Imagen secundaria" },
    { key: "image3", label: "Imagen terciaria" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Productos"
        title="Editar producto"
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
              Imágenes (hasta 3) — sube una nueva para reemplazarla o pulsa la X para eliminarla
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
                  <p className="mt-1 text-[11px] text-muted truncate">
                    {images[key]?.name ?? (previews[key] ? "Imagen actual" : removed[key] ? "Se eliminará al guardar" : "Vacío")}
                  </p>
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
          {submitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
