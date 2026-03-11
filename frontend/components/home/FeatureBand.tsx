import { Truck, RotateCcw, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envio gratuito",
    description: "En pedidos superiores a $100",
  },
  {
    icon: RotateCcw,
    title: "Devoluciones faciles",
    description: "30 dias para cambios",
  },
  {
    icon: Shield,
    title: "Pago seguro",
    description: "Tus datos protegidos",
  },
  {
    icon: Zap,
    title: "Garantia oficial",
    description: "En todos nuestros productos",
  },
];

export default function FeatureBand() {
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {features.map((feat) => (
            <div key={feat.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface">
                <feat.icon size={18} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">{feat.title}</h4>
                <p className="text-xs text-muted mt-0.5">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
