"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/product";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Estado transitorio (no persistido): nombre a mostrar en la pantalla de
  // bienvenida tras iniciar sesión. Da tiempo a que el home cargue por completo.
  welcomeName: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearWelcome: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      welcomeName: null,

      // [FIX] Token unificado: solo se guarda via Zustand persist en "auth-storage"
      // ya no se duplica en localStorage("token") — evita sesiones fantasma
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true, welcomeName: user.name });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, welcomeName: null });
      },

      clearWelcome: () => {
        set({ welcomeName: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
