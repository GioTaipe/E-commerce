"use client";

import { useEffect, useRef } from "react";

const FEATURES = [
  {
    eyebrow: "01",
    title: "Calidad sin compromiso.",
    description:
      "Productos certificados y garantía oficial del fabricante en cada compra.",
  },
  {
    eyebrow: "02",
    title: "Envío rápido a tu puerta.",
    description:
      "Stock real en almacén y logística propia: la mayoría de pedidos en 24 h.",
  },
  {
    eyebrow: "03",
    title: "Financiación a tu medida.",
    description:
      "Hasta 24 meses sin intereses y pago en cuotas en marcas seleccionadas.",
  },
  {
    eyebrow: "04",
    title: "Soporte experto, de verdad.",
    description:
      "Equipo técnico real, en español, sin bots ni colas eternas.",
  },
];

// Desplazamiento vertical de cada feature al entrar/salir (px).
const SLIDE_PX = 80;
// Velocidad de desvanecimiento según la distancia al feature activo.
const FADE_SPEED = 1.2;
// Suavidad del lerp para el feature progress (solo afecta al texto, no al vídeo).
const FEATURE_LERP = 0.18;
// Framerate del vídeo — debe coincidir con el del archivo encodeado all-intra.
const VIDEO_FPS = 24;
// Umbral mínimo para evitar seeks redundantes (en segundos). Medio frame.
const SEEK_EPSILON = 1 / VIDEO_FPS / 2;

export default function ScrollVideoFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetProgressRef = useRef(0);
  const currentFeatureRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalScroll = rect.height - viewportH;
      const scrolled = -rect.top;
      const raw = totalScroll > 0 ? scrolled / totalScroll : 0;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    const seekVideo = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (video.readyState < 1) return;
      // Snap a frame exacto: cuantiza progreso → índice de frame → tiempo.
      const totalFrames = Math.max(1, Math.round(duration * VIDEO_FPS));
      const targetFrame = Math.round(
        targetProgressRef.current * (totalFrames - 1)
      );
      const targetTime = targetFrame / VIDEO_FPS;
      if (Math.abs(video.currentTime - targetTime) > SEEK_EPSILON) {
        try {
          video.currentTime = targetTime;
        } catch {
          /* Safari puede tirar si aún no es seekable */
        }
      }
    };

    const tick = () => {
      // Vídeo sigue al scroll directamente (frame-perfect).
      seekVideo();

      // Features con lerp para fade suave.
      const target = targetProgressRef.current * (FEATURES.length - 1);
      const current = currentFeatureRef.current;
      const next = current + (target - current) * FEATURE_LERP;
      currentFeatureRef.current = next;

      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = i - next;
        const absDist = Math.abs(dist);
        const opacity = Math.max(0, 1 - absDist * FADE_SPEED);
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, ${dist * SLIDE_PX}px, 0)`;
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const onScroll = () => computeTarget();
    // Cuando el navegador empieza autoplay, lo pausamos inmediatamente.
    // El "play" momentáneo basta para que el primer frame se renderice.
    const onPlay = () => {
      video.pause();
      seekVideo();
    };
    const onReady = () => seekVideo();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    video.addEventListener("play", onPlay);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    computeTarget();
    seekVideo();
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${100 * FEATURES.length}vh` }}
      aria-label="Animación de características"
    >
      <div className="sticky top-0 h-screen flex items-center px-[22px]">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Vídeo — wrapper transparente con tamaño garantizado, sin card */}
          <div className="relative w-full max-w-[640px] aspect-video mx-auto">
            <video
              ref={videoRef}
              src="/watchFrame.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>


          {/* Slot único de features con fade vertical */}
          <div
            className="relative h-[300px] sm:h-[340px]"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                ref={(el) => {
                  featureRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="font-heading text-[12px] font-semibold tracking-[0.18em] uppercase text-muted m-0 mb-2.5">
                  {f.eyebrow}
                </p>
                <h3 className="font-heading text-[28px] sm:text-[40px] font-semibold tracking-[-0.015em] leading-[1.08] text-ink m-0 mb-3">
                  {f.title}
                </h3>
                <p className="text-[15px] sm:text-[18px] leading-[1.5] text-[#c7c7cc] m-0 max-w-[42ch]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
