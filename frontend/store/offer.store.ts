"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Offer {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  active: boolean;
}

interface OfferState {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, "id" | "active">) => void;
  updateOffer: (id: string, data: Partial<Omit<Offer, "id">>) => void;
  deleteOffer: (id: string) => void;
  toggleActive: (id: string) => void;
}

const DEFAULT_OFFER: Offer = {
  id: "default",
  eyebrow: "Oferta especial",
  title: "Hasta 30% de descuento",
  description:
    "Aprovecha nuestras ofertas exclusivas en productos seleccionados de temporada.",
  buttonText: "Ver ofertas",
  active: true,
};

export const useOfferStore = create<OfferState>()(
  persist(
    (set) => ({
      offers: [DEFAULT_OFFER],

      addOffer: (data) => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        set((state) => ({
          offers: [...state.offers, { ...data, id, active: false }],
        }));
      },

      updateOffer: (id, data) =>
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, ...data } : o)),
        })),

      deleteOffer: (id) =>
        set((state) => ({
          offers: state.offers.filter((o) => o.id !== id),
        })),

      toggleActive: (id) =>
        set((state) => ({
          offers: state.offers.map((o) =>
            o.id === id
              ? { ...o, active: !o.active }
              : o.active
              ? { ...o, active: false }
              : o
          ),
        })),
    }),
    {
      name: "offer-storage",
    }
  )
);
