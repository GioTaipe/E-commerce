"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const credential = params.get("id_token");
    const errorParam = params.get("error");
    const errorDescription = params.get("error_description");

    if (errorParam) {
      setError(`Error de Google: ${errorParam} — ${errorDescription ?? "sin descripcion"}`);
      return;
    }

    if (!credential) {
      setError("No se recibio id_token de Google.");
      return;
    }

    // Llamar al backend, guardar sesión y redirigir
    authService
      .googleLogin(credential)
      .then((response) => {
        login(response.user, response.token);
        router.replace("/");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error al iniciar sesion con Google");
      });
  }, [login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {error ? (
        <div className="max-w-md text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-accent underline"
          >
            Volver al login
          </button>
        </div>
      ) : (
        <p className="text-muted">Procesando autenticacion con Google...</p>
      )}
    </div>
  );
}
