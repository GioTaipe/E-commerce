import { api } from "@/services/api";
import type { AuthResponse, User } from "@/types/product";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserWithRolePayload {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
}

// [FIX] Eliminado console.log que exponía credenciales en la consola del navegador
// [FIX] Eliminados casteos inseguros `as unknown as Record<string, unknown>`
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", payload);
  },

  async register(payload: RegisterPayload): Promise<{ message: string; user: AuthResponse["user"] }> {
    return api.post("/auth/register", payload);
  },

  async createUser(payload: CreateUserWithRolePayload): Promise<{ message: string; user: User }> {
    return api.post("/auth/create-user", payload);
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/google", { credential });
  },
};
