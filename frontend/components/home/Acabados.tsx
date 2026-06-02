"use client";

import Image from "next/image";
import { useState } from "react";

type Color = "blue" | "orange";

// Cache-buster: súbelo cada vez que reemplaces los PNG en /public con el mismo nombre.
const ASSET_VERSION = 3;

const COLORS: { value: Color; name: string; swatch: string; src: string; alt: string }[] = [
  {
    value: "blue",
    name: "Titanio Negro",
    swatch:
      "radial-gradient(circle at 35% 30%, #5aa9ff 0%, #1e6fd9 55%, #0b3d82 100%)",
    src: `/watch-blue.png?v=${ASSET_VERSION}`,
    alt: "Apple Watch Titanio Negro con correa azul",
  },
  {
    value: "orange",
    name: "Titanio Natural",
    swatch:
      "radial-gradient(circle at 35% 30%, #ffa66e 0%, #d65a1d 55%, #7a2f0a 100%)",
    src: `/watch-orange.png?v=${ASSET_VERSION}`,
    alt: "Apple Watch Titanio Natural con correa naranja",
  },
];

export default function Acabados() {
  const [active, setActive] = useState<Color>("blue");

  return (
    <section id="estilos" className="px-[22px] py-[88px] scroll-mt-[110px]">
      <div className="max-w-[1200px] mx-auto">
        <h2
          data-comment-anchor="09d0921326-h2"
          className="font-heading font-semibold text-[36px] sm:text-[56px] tracking-[-0.015em] leading-none m-0 mb-10 text-ink"
        >
          Acabados
        </h2>
        <div
          data-comment-anchor="9d9c66b9ad-div"
          className="relative bg-[#0a0a0a] rounded-[28px] p-8 sm:p-14 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 sm:gap-14 items-stretch min-h-[520px] overflow-hidden"
        >
          {/* Color selector */}
          <div
            data-comment-anchor="11f3becf7b-ul"
            role="radiogroup"
            aria-label="Selecciona un acabado"
            className="flex flex-col gap-3.5 self-center w-full"
          >
            <p className="font-heading text-[12px] font-semibold tracking-[0.14em] uppercase text-muted m-0 mb-1.5">
              Acabado
            </p>
            {COLORS.map((c) => {
              const isActive = active === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setActive(c.value)}
                  className={`flex items-center gap-4 pl-3 pr-[18px] py-3 rounded-full cursor-pointer text-left font-heading text-[16px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#2a2a2d] border border-[#f5f5f7] text-ink"
                      : "bg-[#1d1d1f] border border-transparent text-ink hover:bg-[#2a2a2d]"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shrink-0 inline-block"
                    style={{ background: c.swatch }}
                  />
                  <span className="leading-none">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Stage with cross-fading images */}
          <div className="relative self-stretch -mt-8 sm:-mt-14 -mb-8 sm:-mb-14 -mr-8 sm:-mr-14 overflow-hidden flex">
            <div className="relative w-full flex-1 min-h-[280px] sm:min-h-0">
              {COLORS.map((c) => {
                const isActive = active === c.value;
                return (
                  <Image
                    key={c.value}
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 880px"
                    quality={100}
                    className="object-cover pointer-events-none"
                    style={{
                      objectPosition: "100% 50%",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1)" : "scale(1.02)",
                      transition:
                        "opacity 0.6s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    priority={c.value === "blue"}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
