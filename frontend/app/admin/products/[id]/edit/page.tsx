"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import type { Category, Product } from "@/types/product";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const addToast = useToastStore((s) => s.addToast);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [image, setImage] = useState<File | null>(null);

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
        if (product.imageUrl) setPreview(product.imageUrl);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      addToast("Completa los campos obligatorios", "error");
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
      if (image) formData.append("image", image);

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
          {/* Nombre */}
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

          {/* Descripcion */}
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

          {/* Precio + Stock */}
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

          {/* Categoria */}
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

          {/* Imagen */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Imagen
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-4 text-sm text-muted hover:border-accent transition-colors">
              <Upload size={18} />
              <span>{image ? image.name : "Cambiar imagen (opcional)"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-lg border border-border">
                <Image src={preview} alt="Preview" fill className="object-cover" sizes="160px" />
              </div>
            )}
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
