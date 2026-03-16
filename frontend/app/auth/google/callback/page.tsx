"use client";

import { useEffect, useState } from "react";

export default function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const credential = params.get("id_token");
    const errorParam = params.get("error");
    const errorDescription = params.get("error_description");

    if (errorParam) {
      const msg = `Google OAuth error: ${errorParam} — ${errorDescription ?? "sin descripcion"}`;
      console.error(msg, Object.fromEntries(params.entries()));
      setError(msg);
      return;
    }

    if (!credential) {
      const msg = "No se recibio id_token de Google. Hash: " + window.location.hash;
      console.error(msg);
      setError(msg);
      return;
    }

    if (!window.opener) {
      console.error("window.opener es null — el popup perdio referencia a la ventana principal");
      setError("Se perdio la conexion con la ventana principal. Intenta de nuevo.");
      return;
    }

    window.opener.postMessage(
      { type: "google-auth-callback", credential },
      window.location.origin
    );
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
