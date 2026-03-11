"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { categoryService } from "@/services/category.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      addToast("Error cargando categorias", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const created = await categoryService.create({ name: newName.trim() });
      setCategories((prev) => [...prev, created]);
      setNewName("");
      addToast("Categoria creada");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error creando categoria", "error");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const updated = await categoryService.update(id, { name: editName.trim() });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      cancelEdit();
      addToast("Categoria actualizada");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error actualizando", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      addToast("Categoria eliminada");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error eliminando", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Catalogo" title="Categorias" />

      {/* Formulario crear */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de la categoria"
          className="flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="flex items-center gap-2 rounded-lg bg-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-ink transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          Crear
        </button>
      </form>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-sm text-muted py-12">No hay categorias registradas</p>
      ) : (
        <div className="rounded-xl border border-border bg-bg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Nombre
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted">{cat.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        className="w-full rounded border border-accent bg-bg px-2 py-1 text-sm focus:outline-none"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === cat.id ? (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="rounded p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                          title="Guardar"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded p-1.5 text-muted hover:bg-cream transition-colors"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => startEdit(cat)}
                          className="rounded p-1.5 text-muted hover:text-accent hover:bg-cream transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="rounded p-1.5 text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar categoria"
        message={`¿Eliminar la categoria "${deleteTarget?.name}"? Los productos asociados quedaran sin categoria.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
