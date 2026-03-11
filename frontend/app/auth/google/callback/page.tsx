"use client";

import { useEffect } from "react";

export default function GoogleCallbackPage() {
  useEffect(() => {
    // Google devuelve el id_token en el hash fragment: #id_token=...&...
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const credential = params.get("id_token");

    if (credential && window.opener) {
      window.opener.postMessage(
        { type: "google-auth-callback", credential },
        window.location.origin
      );
      window.close();
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted">Procesando autenticacion con Google...</p>
    </div>
  );
}
