import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/types/product";

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
}

type Tile = {
  eyebrow: string;
  heading: string;
  sub: string;
  href: string;
  variant: "dark" | "cream";
  imageUrl: string | null;
  artClass: string;
};

export default function CategoriesSection({ categories, products }: CategoriesSectionProps) {
  const findImage = (predicate: (p: Product) => boolean) =>
    products.find((p) => predicate(p) && p.imageUrl)?.imageUrl ?? null;

  const matchCategory = (keywords: string[]) =>
    categories.find((c) =>
      keywords.some((k) => c.name.toLowerCase().includes(k))
    );

  const laptopCat = matchCategory(["laptop", "portátil", "portatil"]);
  const gamingCat = matchCategory(["gaming", "juego"]);
  const audioCat = matchCategory(["audio", "auricular", "sonido"]);
  const phoneCat = matchCategory(["smartphone", "móvil", "movil", "teléfono", "telefono", "celular"]);

  const tiles: Tile[] = [
    {
      eyebrow: "NUEVO",
      heading: laptopCat?.name ?? "MacBook Pro M5",
      sub: "Más rendimiento, más autonomía, mismo diseño que enamora.",
      href: "/products",
      variant: "dark",
      imageUrl: laptopCat ? findImage((p) => p.categoryId === laptopCat.id) : null,
      artClass: "laptop",
    },
    {
      eyebrow: "GAMING",
      heading: gamingCat?.name ?? "Setup completo",
      sub: "Monitor, teclado, ratón y silla. Todo el ecosistema en oferta.",
      href: "/products",
      variant: "cream",
      imageUrl: gamingCat ? findImage((p) => p.categoryId === gamingCat.id) : null,
      artClass: "keyboard",
    },
    {
      eyebrow: "AUDIO",
      heading: audioCat?.name ?? "AirPods Max 2",
      sub: "Sonido cinematográfico. Cancelación adaptativa. Ahora con USB-C.",
      href: "/products",
      variant: "dark",
      imageUrl: audioCat ? findImage((p) => p.categoryId === audioCat.id) : null,
      artClass: "headphones",
    },
    {
      eyebrow: "SMARTPHONES",
      heading: phoneCat?.name ?? "iPhone 17 Pro",
      sub: "La cámara más avanzada en titanio aeroespacial.",
      href: "/products",
      variant: "dark",
      imageUrl: phoneCat ? findImage((p) => p.categoryId === phoneCat.id) : null,
      artClass: "phone",
    },
  ];

  return (
    <section
      className="relative px-[22px] pt-[88px]"
      data-comment-anchor="dd28a25005-section"
    >
      {/* Soft blurred transition that fades the hero video into this section */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -top-[120px] h-[180px] z-[3] backdrop-blur-[14px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 55%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 60%, #000 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 60%, #000 100%)",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[1440px] mx-auto">
        {tiles.map((tile, i) => (
          <Link
            key={i}
            href={tile.href}
            className={`group relative rounded-[24px] overflow-hidden aspect-[4/3] isolate block ${
              tile.variant === "cream"
                ? "bg-[#f5f5f7] text-[#1d1d1f]"
                : "bg-[#0a0a0a] text-ink"
            }`}
          >
            <div className="relative z-[2] px-8 pt-8 sm:px-14 sm:pt-14">
              <p
                className={`font-heading font-semibold text-[14px] tracking-[0.16em] uppercase mb-[14px] ${
                  tile.variant === "cream" ? "text-[#6e6e73]" : "text-muted"
                }`}
              >
                {tile.eyebrow}
              </p>
              <h3 className="font-heading font-semibold text-[28px] sm:text-[40px] tracking-[-0.015em] leading-[1.08] mb-3">
                {tile.heading}
              </h3>
              <p
                className={`text-[17px] sm:text-[19px] leading-[1.4] max-w-[28ch] m-0 ${
                  tile.variant === "cream"
                    ? "text-[#1d1d1f]/[0.78]"
                    : "text-ink/[0.85]"
                }`}
              >
                {tile.sub}
              </p>
              <div className="mt-5 flex gap-7">
                <span className="text-accent text-[17px] inline-flex items-center gap-1.5">
                  Más información ›
                </span>
                <span className="text-accent text-[17px] inline-flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-accent text-white text-[13px] leading-none">
                    +
                  </span>
                  Comprar
                </span>
              </div>
            </div>

            <div className="absolute inset-0 z-[1] flex items-end justify-center">
              {tile.imageUrl ? (
                <Image
                  src={tile.imageUrl}
                  alt={tile.heading}
                  width={640}
                  height={480}
                  className="w-[78%] h-[65%] object-contain mb-[-2%] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <PlaceholderArt variant={tile.artClass} cream={tile.variant === "cream"} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PlaceholderArt({ variant, cream }: { variant: string; cream: boolean }) {
  const base: Record<string, React.CSSProperties> = {
    laptop: {
      width: "78%",
      height: "65%",
      marginBottom: "-2%",
      borderRadius: 18,
      background:
        "radial-gradient(140% 90% at 50% 0%, rgba(41,151,255,0.25), transparent 60%), linear-gradient(160deg, #1a1a1d 0%, #050505 70%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
    phone: {
      width: "22%",
      height: "80%",
      marginBottom: "-2%",
      borderRadius: 36,
      background:
        "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(160deg, #3a3a3d 0%, #0a0a0a 80%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
    headphones: {
      width: "60%",
      height: "70%",
      marginBottom: "-2%",
      borderRadius: "50%",
      background:
        "radial-gradient(120% 80% at 50% 20%, rgba(255,255,255,0.22), transparent 60%), linear-gradient(160deg, #4a4a4d 0%, #1a1a1d 80%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    },
    keyboard: {
      width: "80%",
      height: "30%",
      marginBottom: "8%",
      borderRadius: 12,
      background: "linear-gradient(180deg, #2a2a2d 0%, #0a0a0a 100%)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
    },
  };

  const style = base[variant] ?? base.laptop;
  if (cream) {
    return (
      <div
        style={{
          ...style,
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.6), transparent 60%), linear-gradient(160deg, #d2d2d7 0%, #a1a1a6 80%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
        }}
      />
    );
  }
  return <div style={style} />;
}
