"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  Info,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useToastStore } from "@/store/toast.store";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthReady } from "@/hooks/useHydration";

type PaymentMethod = "card" | "paypal";

// --- Validaciones de tarjeta ---

function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

type Brand = "visa" | "mastercard" | "amex" | "discover" | null;

function detectBrand(num: string): Brand {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(011|5)/.test(n)) return "discover";
  return null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  const isAmex = /^3[47]/.test(digits);
  if (isAmex) {
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 10);
    const c = digits.slice(10, 15);
    return [a, b, c].filter(Boolean).join(" ");
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

function expiryValid(value: string): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = parseInt(m[1]!, 10);
  const yy = parseInt(m[2]!, 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const lastDayOfExpiry = new Date(2000 + yy, mm, 0);
  return lastDayOfExpiry >= new Date(now.getFullYear(), now.getMonth(), 1);
}

// ---

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const ready = useAuthReady();
  const { items, isLoading, fetchCart, clear } = useCartStore();
  const { addToast } = useToastStore();

  // Shipping address
  const [shipName, setShipName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [shipAddress, setShipAddress] = useState("");
  const [shipAddress2, setShipAddress2] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipPostal, setShipPostal] = useState("");
  const [shipProvince, setShipProvince] = useState("");
  const [shipCountry, setShipCountry] = useState("España");

  // Payment
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchCart();
  }, [ready, isAuthenticated, router, fetchCart]);

  useEffect(() => {
    if (!ready || isLoading || submitting) return;
    if (isAuthenticated && items.length === 0) {
      router.replace("/cart");
    }
  }, [ready, isLoading, submitting, isAuthenticated, items.length, router]);

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const brand = detectBrand(cardNumber);
  const cvvLen = brand === "amex" ? 4 : 3;

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    // Dirección de envío
    if (!shipName.trim()) e.shipName = "Indica el nombre del destinatario";
    if (!shipPhone.trim()) e.shipPhone = "Teléfono requerido";
    else if (!/^[+\d][\d\s\-()]{6,}$/.test(shipPhone.trim()))
      e.shipPhone = "Teléfono inválido";
    if (!shipAddress.trim()) e.shipAddress = "Dirección requerida";
    if (!shipCity.trim()) e.shipCity = "Ciudad requerida";
    if (!shipPostal.trim()) e.shipPostal = "Código postal requerido";
    else if (!/^\d{4,6}$/.test(shipPostal.trim()))
      e.shipPostal = "Código postal inválido";
    if (!shipProvince.trim()) e.shipProvince = "Provincia requerida";
    if (!shipCountry.trim()) e.shipCountry = "País requerido";

    if (method === "card") {
      if (!cardName.trim()) e.cardName = "Indica el nombre del titular";
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 13) e.cardNumber = "Número de tarjeta incompleto";
      else if (!luhnValid(digits))
        e.cardNumber = "Número de tarjeta no válido";
      if (!expiry.match(/^\d{2}\/\d{2}$/))
        e.expiry = "Formato MM/AA";
      else if (!expiryValid(expiry)) e.expiry = "Tarjeta caducada";
      const cvvDigits = cvv.replace(/\D/g, "");
      if (cvvDigits.length !== cvvLen)
        e.cvv = `CVV debe tener ${cvvLen} dígitos`;
    } else {
      if (!paypalEmail.match(/\S+@\S+\.\S+/))
        e.paypalEmail = "Email inválido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) {
      addToast("Revisa los datos del pago", "error");
      return;
    }
    setSubmitting(true);
    addToast(
      "Modo demo · No se procesa ningún cobro real. Creando pedido de prueba…",
      "info"
    );
    await new Promise((r) => setTimeout(r, 1800));
    try {
      await api.post("/orders", {});
      await clear();
      addToast("Pedido creado exitosamente", "success");
      router.push("/orders");
    } catch {
      addToast("Error al crear el pedido. Intenta de nuevo.", "error");
      setSubmitting(false);
    }
  };

  if (!ready || !isAuthenticated) return null;

  const inputClass =
    "w-full rounded-full bg-[#1d1d1f] border border-white/[0.08] px-5 py-3 text-[14px] text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/cart"
          className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.16em] text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al carrito
        </Link>
      </div>

      <div className="mb-10">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          Pasarela de pago
        </span>
        <h1 className="mt-2 font-heading font-semibold text-[40px] sm:text-[56px] tracking-[-0.015em] leading-[1.05] text-ink">
          Finalizar compra.
        </h1>
        <p className="mt-3 text-[15px] text-muted flex items-center gap-2">
          <Lock size={14} /> Transacción cifrada extremo a extremo.
        </p>
      </div>

      {/* Demo notice */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4">
        <Info size={18} className="text-amber-300 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-amber-200 m-0">
            Esta pasarela es solo una demo
          </p>
          <p className="text-[12px] text-amber-100/70 m-0 mt-1">
            Puedes validar formularios y completar el flujo, pero no se realiza
            ningún cobro real con tu tarjeta o cuenta PayPal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping address */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted mb-3 flex items-center gap-2">
              <MapPin size={14} />
              Dirección de envío
            </p>
            <div className="rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Nombre del destinatario
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Nombre y apellidos"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                />
                {errors.shipName && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.shipName}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Teléfono
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputClass}
                  placeholder="+34 600 000 000"
                  value={shipPhone}
                  onChange={(e) => setShipPhone(e.target.value)}
                />
                {errors.shipPhone && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.shipPhone}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Dirección
                </label>
                <input
                  type="text"
                  autoComplete="address-line1"
                  className={inputClass}
                  placeholder="Calle, número"
                  value={shipAddress}
                  onChange={(e) => setShipAddress(e.target.value)}
                />
                {errors.shipAddress && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.shipAddress}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Piso, puerta, escalera <span className="text-[10px] normal-case tracking-normal text-muted/70">(opcional)</span>
                </label>
                <input
                  type="text"
                  autoComplete="address-line2"
                  className={inputClass}
                  placeholder="3º B, Esc. 2…"
                  value={shipAddress2}
                  onChange={(e) => setShipAddress2(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    className={inputClass}
                    placeholder="Madrid"
                    value={shipCity}
                    onChange={(e) => setShipCity(e.target.value)}
                  />
                  {errors.shipCity && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.shipCity}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Código postal
                  </label>
                  <input
                    type="text"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={6}
                    className={inputClass}
                    placeholder="28001"
                    value={shipPostal}
                    onChange={(e) =>
                      setShipPostal(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                  />
                  {errors.shipPostal && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.shipPostal}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Provincia / Estado
                  </label>
                  <input
                    type="text"
                    autoComplete="address-level1"
                    className={inputClass}
                    placeholder="Madrid"
                    value={shipProvince}
                    onChange={(e) => setShipProvince(e.target.value)}
                  />
                  {errors.shipProvince && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.shipProvince}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    País
                  </label>
                  <input
                    type="text"
                    autoComplete="country-name"
                    className={inputClass}
                    placeholder="España"
                    value={shipCountry}
                    onChange={(e) => setShipCountry(e.target.value)}
                  />
                  {errors.shipCountry && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.shipCountry}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Method selector */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted mb-3">
              Método de pago
            </p>
            <div className="inline-flex flex-wrap gap-2 p-1.5 bg-[rgba(20,20,22,0.6)] border border-white/[0.08] rounded-full backdrop-blur-[20px]">
              {(
                [
                  { id: "card", label: "Tarjeta", icon: CreditCard },
                  { id: "paypal", label: "PayPal", icon: null },
                ] as const
              ).map((opt) => {
                const active = method === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setMethod(opt.id);
                      setErrors({});
                    }}
                    className={`appearance-none border-0 font-body text-[14px] font-medium px-5 py-2.5 rounded-full cursor-pointer transition-all inline-flex items-center gap-2 ${
                      active
                        ? "bg-[#f5f5f7] text-[#1d1d1f]"
                        : "bg-transparent text-ink opacity-[0.78] hover:opacity-100"
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card form */}
          {method === "card" && (
            <div className="rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6 space-y-4 animate-fade-in">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Titular de la tarjeta
                </label>
                <input
                  type="text"
                  autoComplete="cc-name"
                  className={inputClass}
                  placeholder="NOMBRE Y APELLIDOS"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
                {errors.cardName && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.cardName}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Número de tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className={`${inputClass} pr-24`}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                  />
                  {brand && (
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                      {brand}
                    </span>
                  )}
                </div>
                {errors.cardNumber && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Caducidad
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    className={inputClass}
                    placeholder="MM/AA"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                  {errors.expiry && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    CVV
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={cvvLen}
                    className={inputClass}
                    placeholder={brand === "amex" ? "1234" : "123"}
                    value={cvv}
                    onChange={(e) =>
                      setCvv(
                        e.target.value.replace(/\D/g, "").slice(0, cvvLen)
                      )
                    }
                  />
                  {errors.cvv && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <p className="text-[12px] text-muted flex items-center gap-2 pt-2">
                <ShieldCheck size={14} className="text-accent" />
                Validamos tu tarjeta con el algoritmo Luhn antes de enviar.
              </p>
            </div>
          )}

          {/* PayPal */}
          {method === "paypal" && (
            <div className="rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6 space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#003087]/15 border border-[#003087]/30">
                <span className="font-heading text-[20px] font-bold tracking-tight">
                  <span className="text-[#003087]">Pay</span>
                  <span className="text-[#009cde]">Pal</span>
                </span>
                <span className="text-[12px] text-muted">
                  Te redirigiremos para confirmar el pago en PayPal.
                </span>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Email de PayPal
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  placeholder="tu@correo.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
                {errors.paypalEmail && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.paypalEmail}
                  </p>
                )}
              </div>

              <p className="text-[12px] text-muted flex items-center gap-2 pt-2">
                <ShieldCheck size={14} className="text-accent" />
                Tus credenciales de PayPal nunca pasan por TechZone.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-[22px] bg-[#0a0a0a] border border-white/[0.04] p-6">
            <h3 className="font-heading text-[19px] font-semibold mb-5 text-ink">
              Resumen del pedido
            </h3>

            {items.length > 0 && (
              <div className="space-y-3 max-h-[220px] overflow-y-auto mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#161617]">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-ink truncate font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-[12px] text-muted">×{item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-medium text-ink">
                      {formatCurrency(
                        Number(item.product.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 border-t border-white/[0.08] pt-4 mb-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink font-medium">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Envío</span>
                <span className="text-accent font-medium">Gratis</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Impuestos</span>
                <span className="text-ink font-medium">Incluidos</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                Total
              </span>
              <span className="text-[28px] font-semibold font-heading text-ink tracking-[-0.015em]">
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handlePay}
              disabled={submitting || items.length === 0}
              className="neu-button w-full py-3.5 text-[14px] font-medium"
            >
              {submitting
                ? "Procesando…"
                : `Pagar ${formatCurrency(total)}`}
            </button>

            <p className="mt-4 text-[11px] text-muted text-center leading-[1.5]">
              Al pulsar Pagar aceptas los Términos y Condiciones de TechZone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
