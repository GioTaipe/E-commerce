"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { productService } from "@/services/product.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch {
      addToast("Error cargando productos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      addToast("Producto eliminado");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error eliminando", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalogo"
        title="Productos"
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-lg bg-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-ink transition-colors"
          >
            <Plus size={16} />
            Nuevo producto
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-sm text-muted py-12">No hay productos registrados</p>
      ) : (
        <div className="rounded-xl border border-border bg-bg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Categoria
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Precio
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface/30">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {product.category?.name ?? "Sin categoria"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}€
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{product.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded p-1.5 text-muted hover:text-accent hover:bg-cream transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="rounded p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar producto"
        message={`¿Eliminar "${deleteTarget?.name}"? Esta accion no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
