"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

// Duración total que la bienvenida permanece visible (ms) antes de empezar a
// desvanecerse. Cubre la navegación a "/" y da margen a que cargue el hero.
const HOLD_MS = 2000;
const FADE_MS = 600;

export default function WelcomeOverlay() {
  const welcomeName = useAuthStore((s) => s.welcomeName);
  const clearWelcome = useAuthStore((s) => s.clearWelcome);

  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!welcomeName) return;

    setVisible(true);
    setFading(false);
    setEntered(false);

    // Evita scroll mientras se muestra la bienvenida
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Dispara la animación de entrada en el siguiente frame
    const enterRaf = requestAnimationFrame(() => setEntered(true));

    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = prevOverflow;
      clearWelcome();
    }, HOLD_MS + FADE_MS);

    return () => {
      cancelAnimationFrame(enterRaf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [welcomeName, clearWelcome]);

  if (!visible || !welcomeName) return null;

  const firstName = welcomeName.split(" ")[0];

  return (
    <div
      aria-live="polite"
      role="status"
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black transition-opacity ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center text-center px-6 transition-all duration-700 ease-out ${
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <p className="font-heading text-[14px] font-semibold uppercase tracking-[0.18em] text-ink mb-6 flex items-center gap-2.5">
          <span className="inline-block w-[18px] h-[18px] rounded-[4px] bg-ink text-black font-heading text-[12px] font-bold leading-[18px] text-center">
            T
          </span>
          TECHZONE PRO
        </p>

        <h1 className="font-heading font-semibold text-[40px] sm:text-[56px] leading-[1.05] tracking-[-0.015em] text-white m-0">
          Bienvenido,
        </h1>
        <h1 className="font-heading font-semibold text-[40px] sm:text-[56px] leading-[1.05] tracking-[-0.015em] text-accent m-0">
          {firstName}.
        </h1>

        <div className="mt-10 flex items-center gap-3 text-muted">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
          <span className="text-[14px]">Preparando tu experiencia…</span>
        </div>
      </div>
    </div>
  );
}
