"use client";

import { useEffect, useRef } from "react";

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL_FRONTEND ?? (typeof window !== "undefined" ? window.location.origin : "");

const STORAGE_KEY = "google-auth-credential";

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const callbackRef = useRef(onSuccess);
  const errorRef = useRef(onError);
  callbackRef.current = onSuccess;
  errorRef.current = onError;

  useEffect(() => {
    // Escuchar cambios en localStorage desde el popup
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        callbackRef.current(event.newValue);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleClick = () => {
    // Limpiar cualquier credential anterior
    localStorage.removeItem(STORAGE_KEY);

    const scope = "openid email profile";
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI + "/auth/google/callback")}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&nonce=${crypto.randomUUID()}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top},popup=true`
    );

    if (!popup) {
      errorRef.current?.();
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
        <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.482 0 2.438 2.017.957 4.96L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </button>
  );
}
