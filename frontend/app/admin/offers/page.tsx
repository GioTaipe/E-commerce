"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { useOfferStore, type Offer } from "@/store/offer.store";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface OfferFormData {
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
}

const EMPTY_FORM: OfferFormData = {
  eyebrow: "",
  title: "",
  description: "",
  buttonText: "",
};

export default function AdminOffersPage() {
  const { offers, addOffer, updateOffer, deleteOffer, toggleActive } = useOfferStore();
  const addToast = useToastStore((s) => s.addToast);

  const [newForm, setNewForm] = useState<OfferFormData>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OfferFormData>(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title.trim()) return;

    setCreating(true);
    try {
      addOffer({
        eyebrow: newForm.eyebrow.trim(),
        title: newForm.title.trim(),
        description: newForm.description.trim(),
        buttonText: newForm.buttonText.trim(),
      });
      setNewForm(EMPTY_FORM);
      addToast("Oferta creada");
    } catch {
      addToast("Error creando oferta", "error");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setEditForm({
      eyebrow: offer.eyebrow,
      title: offer.title,
      description: offer.description,
      buttonText: offer.buttonText,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  };

  const handleUpdate = (id: string) => {
    if (!editForm.title.trim()) return;

    try {
      updateOffer(id, {
        eyebrow: editForm.eyebrow.trim(),
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        buttonText: editForm.buttonText.trim(),
      });
      cancelEdit();
      addToast("Oferta actualizada");
    } catch {
      addToast("Error actualizando oferta", "error");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    try {
      deleteOffer(deleteTarget.id);
      addToast("Oferta eliminada");
    } catch {
      addToast("Error eliminando oferta", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggle = (id: string) => {
    try {
      toggleActive(id);
      const offer = offers.find((o) => o.id === id);
      const wasActive = offer?.active;
      addToast(wasActive ? "Oferta desactivada" : "Oferta activada");
    } catch {
      addToast("Error actualizando estado", "error");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Marketing" title="Ofertas" />

      {/* Formulario crear */}
      <form onSubmit={handleCreate} className="mb-8 rounded-xl border border-border bg-bg p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Nueva oferta
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Eyebrow (texto pequeño)
            </label>
            <input
              type="text"
              value={newForm.eyebrow}
              onChange={(e) => setNewForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
              placeholder="Ej: Oferta especial"
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Titulo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newForm.title}
              onChange={(e) => setNewForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Hasta 30% de descuento"
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">
              Descripcion
            </label>
            <textarea
              value={newForm.description}
              onChange={(e) => setNewForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descripcion de la oferta..."
              rows={2}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Texto del boton
            </label>
            <input
              type="text"
              value={newForm.buttonText}
              onChange={(e) => setNewForm((prev) => ({ ...prev, buttonText: e.target.value }))}
              placeholder="Ej: Ver ofertas"
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating || !newForm.title.trim()}
              className="flex items-center gap-2 rounded-lg bg-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-ink transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              Crear oferta
            </button>
          </div>
        </div>
      </form>

      {/* Lista */}
      {offers.length === 0 ? (
        <p className="text-center text-sm text-muted py-12">No hay ofertas registradas</p>
      ) : (
        <div className="rounded-xl border border-border bg-bg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Titulo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted hidden sm:table-cell">
                  Descripcion
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors"
                >
                  {/* Estado */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(offer.id)}
                      className="flex items-center gap-2 group"
                      title={offer.active ? "Desactivar" : "Activar"}
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                          offer.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {offer.active ? "Activa" : "Inactiva"}
                      </span>
                    </button>
                  </td>

                  {/* Titulo */}
                  <td className="px-4 py-3 text-sm">
                    {editingId === offer.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.eyebrow}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, eyebrow: e.target.value }))
                          }
                          placeholder="Eyebrow"
                          className="w-full rounded border border-border bg-bg px-2 py-1 text-xs focus:outline-none focus:border-accent"
                        />
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, title: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          placeholder="Titulo *"
                          className="w-full rounded border border-accent bg-bg px-2 py-1 text-sm focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editForm.buttonText}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, buttonText: e.target.value }))
                          }
                          placeholder="Texto boton"
                          className="w-full rounded border border-border bg-bg px-2 py-1 text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    ) : (
                      <div>
                        {offer.eyebrow && (
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
                            {offer.eyebrow}
                          </p>
                        )}
                        <p className="font-medium">{offer.title}</p>
                        {offer.buttonText && (
                          <p className="text-[10px] text-muted mt-0.5">[{offer.buttonText}]</p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Descripcion */}
                  <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell max-w-xs">
                    {editingId === offer.id ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={2}
                        className="w-full rounded border border-border bg-bg px-2 py-1 text-xs focus:outline-none focus:border-accent resize-none"
                      />
                    ) : (
                      <span className="line-clamp-2">{offer.description}</span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-right">
                    {editingId === offer.id ? (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleUpdate(offer.id)}
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
                          onClick={() => startEdit(offer)}
                          className="rounded p-1.5 text-muted hover:text-accent hover:bg-cream transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(offer)}
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
        title="Eliminar oferta"
        message={`¿Eliminar la oferta "${deleteTarget?.title}"? Esta accion no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={false}
      />
    </div>
  );
}
