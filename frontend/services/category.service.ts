import { api } from "@/services/api";
import type { Category } from "@/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const categoryService = {
  async getAll(): Promise<Category[]> {
    // [FIX] Eliminado console.log de debug que imprimía [object Response]
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Error obteniendo categorias");
    return res.json();
  },

  async create(data: { name: string }): Promise<Category> {
    return api.post<Category>("/categories", data);
  },

  async update(id: number, data: { name: string }): Promise<Category> {
    return api.put<Category>(`/categories/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/categories/${id}`);
  },
};
