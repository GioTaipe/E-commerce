"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Esperar a que Zustand persist hidrate el estado
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // Si ya esta hidratado
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
