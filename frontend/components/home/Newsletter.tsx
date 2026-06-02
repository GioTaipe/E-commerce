"use client";

import { useState } from "react";

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
    <section className="bg-[#0a0a0a] px-[22px] py-[88px] text-center">
      <h2 className="font-heading text-[32px] sm:text-[48px] font-semibold tracking-[-0.015em] m-0 mb-3.5 text-ink">
        Mantente al día.
      </h2>
      <p className="text-muted text-[19px] max-w-[44ch] mx-auto mb-7">
        Recibe lanzamientos, ofertas exclusivas y guías de los expertos de TechZone.
      </p>

      <form
        onSubmit={handleSubmit}
        className="inline-flex items-center bg-[#1d1d1f] rounded-full pl-[22px] pr-1.5 py-1.5 gap-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="bg-transparent border-0 outline-none text-ink text-[15px] w-[200px] sm:w-[280px] font-inherit placeholder:text-muted"
        />
        <button
          type="submit"
          className="neu-button px-5 sm:px-[22px] py-2.5 text-[14px] font-medium"
        >
          {submitted ? "✓ Suscrito" : "Suscribir"}
        </button>
      </form>
    </section>
  );
}
