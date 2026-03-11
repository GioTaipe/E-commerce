"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  pending: "bg-secondary/20 text-secondary",
  shipped: "bg-accent/20 text-accent",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Tu cuenta
        </span>
        <h1 className="mt-2 font-heading text-4xl">Mis pedidos</h1>
      </div>

      {isLoading && <Loader text="Cargando pedidos..." />}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-cream py-20">
          <ClipboardList size={48} className="text-surface" />
          <p className="text-sm text-muted">No tienes pedidos todavia</p>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const statusLabel = STATUS_LABELS[order.status] ?? order.status;
            const statusColor = STATUS_COLORS[order.status] ?? "bg-surface text-muted";
            const date = new Date(order.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-bg p-6 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      Pedido #{order.id}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{date}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-ink">
                          {item.product?.name ?? `Producto #${item.productId}`}
                          <span className="ml-1 text-muted">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-ink">
                          {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Total
                  </span>
                  <span className="text-lg font-semibold font-heading text-accent">
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
