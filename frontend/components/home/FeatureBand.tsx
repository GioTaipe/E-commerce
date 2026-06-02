"use client";

import { useRef } from "react";

type Card = {
  art: "laptop" | "phone" | "headphones" | "text";
  text: string;
  textBig?: string;
  title: string;
  description: string;
};

const cards: Card[] = [
  {
    art: "laptop",
    text: "",
    title: "Configuración a medida.",
    description:
      "Personaliza tu equipo con los componentes que necesitas y recíbelo montado y probado en 48h.",
  },
  {
    art: "text",
    text: "",
    textBig: "5G",
    title: "Conectividad total.",
    description:
      "Routers, switches y dispositivos 5G listos para tu hogar inteligente.",
  },
  {
    art: "headphones",
    text: "",
    title: "Audio que se siente.",
    description:
      "Auriculares, altavoces y micros para creadores, gamers y melómanos.",
  },
  {
    art: "phone",
    text: "",
    title: "Movilidad sin compromiso.",
    description:
      "Los últimos smartphones y tablets con financiación a 0% en 12 meses.",
  },
  {
    art: "text",
    text: "",
    textBig: "24h",
    title: "Soporte de verdad.",
    description:
      "Equipo técnico real, en español, 24 horas al día. Sin bots ni colas eternas.",
  },
];

export default function FeatureBand() {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    rowRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section id="porque" className="pt-[88px] scroll-mt-[110px]">
      <div className="max-w-[1024px] mx-auto mb-8 px-[22px]">
        <h2 className="font-heading font-semibold text-[40px] tracking-[-0.015em] m-0 text-ink">
          Por qué TechZone.
        </h2>
      </div>

      <div
        ref={rowRef}
        className="no-scrollbar grid grid-flow-col auto-cols-[360px] gap-3.5 overflow-x-auto px-[22px] pb-8 snap-x snap-mandatory"
      >
        {cards.map((card, i) => (
          <article
            key={i}
            className="bg-[#0a0a0a] rounded-[22px] overflow-hidden snap-start flex flex-col"
          >
            <div className="aspect-square flex items-center justify-center relative bg-[#0a0a0a]">
              <FeatureArt card={card} />
            </div>
            <div className="px-7 pt-7 pb-8">
              <p className="text-[19px] leading-[1.35] text-ink m-0">
                <strong className="font-semibold">{card.title}</strong>{" "}
                <span className="text-muted">{card.description}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end gap-2 max-w-[1440px] mx-auto px-[22px] pb-16">
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          className="w-9 h-9 rounded-full bg-[#1d1d1f] text-ink flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Siguiente"
          className="w-9 h-9 rounded-full bg-[#1d1d1f] text-ink flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function FeatureArt({ card }: { card: Card }) {
  if (card.art === "text") {
    return (
      <span
        className="font-heading font-bold leading-none text-transparent bg-clip-text"
        style={{
          fontSize: 200,
          letterSpacing: "-0.04em",
          backgroundImage: "linear-gradient(180deg, #4a4a4d 0%, #1d1d1f 100%)",
          WebkitBackgroundClip: "text",
        }}
      >
        {card.textBig}
      </span>
    );
  }

  const styles: Record<string, React.CSSProperties> = {
    laptop: {
      width: "70%",
      height: "70%",
      borderRadius: 14,
      background:
        "radial-gradient(140% 90% at 50% 0%, rgba(41,151,255,0.25), transparent 60%), linear-gradient(160deg, #1a1a1d 0%, #050505 70%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
    phone: {
      width: "30%",
      height: "75%",
      borderRadius: 36,
      background:
        "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(160deg, #3a3a3d 0%, #0a0a0a 80%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
    headphones: {
      width: "60%",
      height: "60%",
      borderRadius: "50%",
      background:
        "radial-gradient(120% 80% at 50% 20%, rgba(255,255,255,0.22), transparent 60%), linear-gradient(160deg, #4a4a4d 0%, #1a1a1d 80%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
  };

  return <div style={styles[card.art]} />;
}
