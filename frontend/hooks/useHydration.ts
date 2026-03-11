"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function useAuthReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setReady(true);
    });
    return unsub;
  }, []);

  return ready;
}
