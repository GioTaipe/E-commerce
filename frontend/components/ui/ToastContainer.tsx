"use client";

import { X } from "lucide-react";
import { useToastStore } from "@/store/toast.store";

const typeStyles = {
  success: "bg-accent text-white",
  error: "bg-red-700 text-white",
  info: "bg-accent text-white",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-5 py-3 text-sm font-medium shadow-lg animate-toast ${typeStyles[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
