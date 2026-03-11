import { api } from "@/services/api";
import type { Cart, CartItem } from "@/types/product";

export const cartService = {
  async getCart(): Promise<Cart> {
    return api.get<Cart>("/cart");
  },

  async addToCart(productId: number, quantity: number): Promise<CartItem> {
    return api.post<CartItem>("/cart/add", { productId, quantity });
  },

  async updateItem(itemId: number, quantity: number): Promise<CartItem> {
    return api.put<CartItem>(`/cart/item/${itemId}`, { quantity });
  },

  async removeItem(itemId: number): Promise<void> {
    return api.delete<void>(`/cart/item/${itemId}`);
  },

  async clearCart(): Promise<void> {
    return api.delete<void>("/cart/clear");
  },
};
