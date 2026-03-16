"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "google-auth-credential";

export default function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null);

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

    // Guardar en localStorage — la ventana principal escucha el evento "storage"
    localStorage.setItem(STORAGE_KEY, credential);
    window.close();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {error ? (
        <div className="max-w-md text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="text-sm text-muted underline"
          >
            Cerrar ventana
          </button>
        </div>
      ) : (
        <p className="text-muted">Procesando autenticacion con Google...</p>
      )}
    </div>
  );
}
