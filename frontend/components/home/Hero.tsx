import Link from "next/link";
import type { Product } from "@/types/product";

interface HeroProps {
  products: Product[];
}

export default function Hero({ products: _products }: HeroProps) {
  return (
    <section id="inicio" className="relative h-[calc(100vh-64px-50px)] min-h-[640px] overflow-hidden bg-black isolate scroll-mt-[110px]">
      <video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Subtle bottom gradient for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      <div className="absolute z-[2] left-0 right-0 bottom-16 flex flex-col items-center text-center px-[22px]">
        <p className="font-heading text-[21px] font-semibold uppercase tracking-[0.18em] text-ink mb-[14px] flex items-center gap-2.5 m-0">
          <span className="inline-block w-[18px] h-[18px] rounded-[4px] bg-ink text-black font-heading text-[12px] font-bold leading-[18px] text-center">
            T
          </span>
          TECHZONE PRO
        </p>

        <h1 className="font-heading font-semibold text-[48px] sm:text-[64px] lg:text-[80px] leading-[1.05] tracking-[-0.015em] m-0 mb-7 text-white max-w-[14ch]">
          Potencia sin
          <br />
          límites.
        </h1>

        <div className="inline-flex items-center gap-2.5 bg-[rgba(40,40,45,0.72)] border border-white/[0.08] backdrop-blur-[20px] pl-[22px] pr-1.5 py-1.5 rounded-full text-[15px] text-ink">
          <strong className="font-medium">Desde 1.299 €</strong>
          <Link
            href="/#productos"
            className="neu-button px-[18px] py-2 text-[14px] font-medium"
          >
            Comprar
          </Link>
        </div>
      </div>
    </section>
  );
}
