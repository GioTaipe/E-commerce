import { api } from "@/services/api";
import type { Product } from "@/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(API_URL, {
      next: { revalidate: 5 },
    });

    if (!res.ok) throw new Error("Error obteniendo productos");
    return res.json();
  },

  async getById(id: string | number): Promise<Product> {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) throw new Error("Producto no encontrado");
    return res.json();
  },

  async create(formData: FormData): Promise<Product> {
    return api.post<Product>("/products", formData);
  },

  async update(id: number, formData: FormData): Promise<Product> {
    return api.put<Product>(`/products/${id}`, formData);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/products/${id}`);
  },
};
