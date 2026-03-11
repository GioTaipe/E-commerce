"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Newsletter
        </span>
        <h2 className="mt-2 font-heading text-3xl sm:text-4xl">
          Mantente al dia
        </h2>
        <p className="mt-3 text-sm text-muted max-w-md mx-auto">
          Suscribete y recibe las ultimas novedades en tecnologia, ofertas
          exclusivas y lanzamientos directamente en tu bandeja de entrada.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-accent animate-fade-in">
            Gracias por suscribirte
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-full border border-border bg-bg px-5 py-3 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              <Send size={14} />
              Suscribir
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
