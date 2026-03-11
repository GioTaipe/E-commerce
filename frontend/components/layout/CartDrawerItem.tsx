"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CartItem } from "@/types/product";

interface CartDrawerItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>;
  onRemove: (itemId: number) => Promise<void>;
  isLoading: boolean;
}

export default function CartDrawerItem({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading,
}: CartDrawerItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Image */}
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Sin img
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink truncate">
            {item.product.name}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="text-muted hover:text-red-600 transition-colors flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-border rounded-full">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="p-1.5 text-muted hover:text-ink disabled:opacity-30 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-medium w-5 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="p-1.5 text-muted hover:text-ink disabled:opacity-30 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-sm font-semibold text-ink">
            {formatCurrency(Number(item.product.price) * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
