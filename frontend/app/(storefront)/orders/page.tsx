"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/services/api";
import type { Order } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import Loader from "@/components/ui/Loader";
import { useAuthReady } from "@/hooks/useHydration";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  shipped: "bg-accent/20 text-accent",
  delivered: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const ready = useAuthReady();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.get<Order[]>("/orders");
        setOrders(data);
      } catch {
        setError("Error al cargar los pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          Tu cuenta
        </span>
        <h1 className="mt-2 font-heading font-semibold text-[40px] sm:text-[56px] tracking-[-0.015em] leading-[1.05] text-ink">
          Mis pedidos.
        </h1>
      </div>

      {isLoading && <Loader text="Cargando pedidos..." />}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] bg-[#0a0a0a] border border-white/[0.04] py-24">
          <ClipboardList size={48} className="text-muted" />
          <p className="text-[17px] text-muted">Aún no tienes pedidos</p>
          <Link
            href="/#productos"
            className="neu-button px-6 py-2.5 text-[14px] font-medium"
          >
            Explorar tienda
          </Link>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const statusLabel = STATUS_LABELS[order.status] ?? order.status;
            const statusColor = STATUS_COLORS[order.status] ?? "bg-[#1d1d1f] text-muted";
            const date = new Date(order.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Pedido #{order.id}
                    </p>
                    <p className="mt-1 text-[13px] text-muted">{date}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <ul className="mt-5 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-[14px]">
                        <span className="text-ink">
                          {item.product?.name ?? `Producto #${item.productId}`}
                          <span className="ml-1 text-muted">×{item.quantity}</span>
                        </span>
                        <span className="font-medium text-ink">
                          {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Total
                  </span>
                  <span className="text-[22px] font-semibold font-heading text-ink tracking-[-0.015em]">
                    {formatCurrency(Number(order.total))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
