"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !window.google || !buttonRef.current) return;
    initGoogle();
  }, []);

  function initGoogle() {
    if (initializedRef.current || !window.google || !buttonRef.current) return;
    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError?.();
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 400,
    });
  }

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initGoogle}
        strategy="afterInteractive"
      />
      <div ref={buttonRef} className="flex justify-center" />
    </>
  );
}
