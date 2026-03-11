export default function Marquee() {
  const text = "ENVIO GRATIS EN PEDIDOS +100EUR  \u2022  NUEVOS LANZAMIENTOS CADA SEMANA  \u2022  GARANTIA OFICIAL  \u2022  DEVOLUCIONES EN 30 DIAS  \u2022  ";

  return (
    <div className="overflow-hidden bg-dark py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
