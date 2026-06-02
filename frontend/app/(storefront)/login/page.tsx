"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import Loader from "@/components/ui/Loader";
import { useAuthReady } from "@/hooks/useHydration";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const ready = useAuthReady();

  const loginForm = useForm<LoginFormValues>();
  const registerForm = useForm<RegisterFormValues>();

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace("/");
    }
  }, [ready, isAuthenticated, router]);

  const handleLogin = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      login(response.user, response.token);
      router.push("/");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      });
      login(loginResponse.user, loginResponse.token);
      router.push("/");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setErrorMessage(null);
    loginForm.reset();
    registerForm.reset();
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  if (!ready) return <Loader text="Cargando..." />;
  if (isAuthenticated) return null;

  const inputClass =
    "w-full rounded-full bg-[#1d1d1f] border border-white/[0.08] px-5 py-3 text-[14px] text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
            {mode === "login" ? "Bienvenido" : "Únete"}
          </span>
          <h1 className="mt-2 font-heading font-semibold text-[40px] tracking-[-0.015em] text-ink leading-[1.05]">
            {mode === "login" ? "Inicia sesión." : "Crear cuenta."}
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {mode === "login"
              ? "Accede a tu carrito, pedidos y favoritos."
              : "Regístrate para empezar a comprar."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="tu@correo.com"
                {...loginForm.register("email", {
                  required: "El correo es obligatorio",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" },
                })}
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                placeholder="Tu contraseña"
                {...loginForm.register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-button mt-2 w-full py-3.5 text-[14px] font-medium"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#4d4d4d]/30 border-t-[#4d4d4d]" />
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate className="flex flex-col gap-4">
            <div>
              <label htmlFor="register-name" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Nombre completo
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                className={inputClass}
                placeholder="Tu nombre"
                {...registerForm.register("name", { required: "El nombre es obligatorio" })}
              />
              {registerForm.formState.errors.name && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Correo electrónico
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="tu@correo.com"
                {...registerForm.register("email", {
                  required: "El correo es obligatorio",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" },
                })}
              />
              {registerForm.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Contraseña
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Mínimo 6 caracteres"
                {...registerForm.register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {registerForm.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-confirm" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Confirmar contraseña
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Repite tu contraseña"
                {...registerForm.register("confirmPassword", { required: "Confirma tu contraseña" })}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-button mt-2 w-full py-3.5 text-[14px] font-medium"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#4d4d4d]/30 border-t-[#4d4d4d]" />
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
        )}

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[11px] text-muted uppercase tracking-[0.14em]">o</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <GoogleLoginButton
          onError={() => setErrorMessage("Error al iniciar sesión con Google")}
        />

        <div className="mt-8 text-center">
          <p className="text-[14px] text-muted">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button type="button" onClick={toggleMode} className="font-medium text-accent hover:underline">
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
