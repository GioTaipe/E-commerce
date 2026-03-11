const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://e-commerce-b2dr.onrender.com";

// [FIX] Lee el token desde el mismo store persistido por Zustand ("auth-storage")
// en vez de una clave separada — fuente de verdad única para el token
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

// [FIX] Body acepta cualquier objeto serializable — evita casteos inseguros en los services
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: object | FormData;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error ?? "Error en la solicitud");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: object | FormData) =>
    request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: object | FormData) =>
    request<T>(endpoint, { method: "PUT", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
