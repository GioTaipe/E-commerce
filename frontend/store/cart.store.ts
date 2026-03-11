"use client";

import { create } from "zustand";
import { cartService } from "@/services/cart.service";
import type { CartItem } from "@/types/product";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart();
      set({ items: cart.items ?? [], isLoading: false });
    } catch {
      set({ error: "Error al cargar el carrito", isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.addToCart(productId, quantity);
      const cart = await cartService.getCart();
      set({ items: cart.items ?? [], isLoading: false });
    } catch {
      set({ error: "Error al agregar el producto", isLoading: false });
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.updateItem(itemId, quantity);
      const cart = await cartService.getCart();
      set({ items: cart.items ?? [], isLoading: false });
    } catch {
      set({ error: "Error al actualizar la cantidad", isLoading: false });
    }
  },

  removeItem: async (itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.removeItem(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        isLoading: false,
      }));
    } catch {
      set({ error: "Error al eliminar el producto", isLoading: false });
    }
  },

  clear: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ items: [], isLoading: false });
    } catch {
      set({ error: "Error al vaciar el carrito", isLoading: false });
    }
  },

  reset: () => set({ items: [], isLoading: false, error: null }),
}));
