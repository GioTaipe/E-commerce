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
      setErrorMessage(err instanceof Error ? err.message : "Error al iniciar sesion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Las contrasenas no coinciden");
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

  const handleGoogleLogin = async (credential: string) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await authService.googleLogin(credential);
      login(response.user, response.token);
      router.push("/");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error al iniciar sesion con Google");
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
    "w-full rounded-full border border-border bg-bg px-5 py-3 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl">
            {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Ingresa tus credenciales para continuar"
              : "Completa el formulario para registrarte"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Correo electronico
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="tu@correo.com"
                {...loginForm.register("email", {
                  required: "El correo es obligatorio",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Correo invalido" },
                })}
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Contrasena
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                placeholder="Tu contrasena"
                {...loginForm.register("password", {
                  required: "La contrasena es obligatoria",
                  minLength: { value: 6, message: "Minimo 6 caracteres" },
                })}
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-dark py-3.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? <Loader size="sm" /> : "Iniciar sesion"}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="register-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
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
                <p className="mt-1.5 text-xs text-red-600">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Correo electronico
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="tu@correo.com"
                {...registerForm.register("email", {
                  required: "El correo es obligatorio",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Correo invalido" },
                })}
              />
              {registerForm.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Contrasena
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Minimo 6 caracteres"
                {...registerForm.register("password", {
                  required: "La contrasena es obligatoria",
                  minLength: { value: 6, message: "Minimo 6 caracteres" },
                })}
              />
              {registerForm.formState.errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-confirm" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Confirmar contrasena
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                placeholder="Repite tu contrasena"
                {...registerForm.register("confirmPassword", { required: "Confirma tu contrasena" })}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-dark py-3.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? <Loader size="sm" /> : "Crear cuenta"}
            </button>
          </form>
        )}

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted uppercase tracking-widest">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton
          onSuccess={handleGoogleLogin}
          onError={() => setErrorMessage("Error al iniciar sesion con Google")}
        />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            {mode === "login" ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
            <button type="button" onClick={toggleMode} className="font-semibold text-accent hover:underline">
              {mode === "login" ? "Registrate aqui" : "Inicia sesion"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
