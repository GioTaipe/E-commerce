"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useToastStore } from "@/store/toast.store";
import PageHeader from "@/components/admin/PageHeader";

export default function NewUserPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "admin",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      addToast("Completa todos los campos", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      addToast("Las contrasenas no coinciden", "error");
      return;
    }

    if (form.password.length < 6) {
      addToast("La contrasena debe tener al menos 6 caracteres", "error");
      return;
    }

    setSubmitting(true);
    try {
      await authService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      addToast(`Usuario ${form.role === "admin" ? "administrador" : ""} creado exitosamente`);
      setForm({ name: "", email: "", password: "", confirmPassword: "", role: "customer" });
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Error creando usuario", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Usuarios" title="Crear usuario" />

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6">
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

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Contrasena *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Confirmar *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Rol
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            >
              <option value="customer">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-dark py-3 text-sm font-medium text-white hover:bg-ink transition-colors disabled:opacity-50"
        >
          {submitting ? "Creando..." : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}
