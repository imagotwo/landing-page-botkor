"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __motion?: boolean;
    __lenis?: { stop: () => void; start: () => void; destroy: () => void; scrollTo: (t: string | number | HTMLElement, o?: object) => void };
  }
}

/**
 * Motor de movimiento único de la página (≈2 KB + Lenis bajo demanda):
 *  1. [data-reveal]   → añade .is-inview al entrar en viewport (una sola vez).
 *  2. [data-live]     → alterna .is-live dentro/fuera de viewport (pausa marquee/canvas).
 *  3. [data-parallax] → desplazamiento con el scroll (solo desktop, solo elementos visibles).
 *  4. Lenis           → scroll inercial (solo puntero fino y sin reduced-motion).
 * Todo se limpia al desmontar. Sin listeners de scroll si no hay parallax visible.
 */
export function MotionRuntime() {
  useEffect(() => {
    window.__motion = true;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // 1. Reveal
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("motion")) {
      revealEls.forEach((el) => el.classList.add("is-inview"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-inview");
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
      );
      revealEls.forEach((el) => io.observe(el));
      // Al llegar al final del documento, el margen inferior del observer ya no es alcanzable:
      // se revelan los elementos restantes que estén en pantalla.
      const onEnd = () => {
        if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-inview)").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("is-inview");
            io.unobserve(el);
          }
        });
      };
      window.addEventListener("scroll", onEnd, { passive: true });
      cleanups.push(() => {
        io.disconnect();
        window.removeEventListener("scroll", onEnd);
      });
    }

    // 2. Live (en pantalla)
    const liveIo = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-live", e.isIntersecting);
    });
    document.querySelectorAll("[data-live]").forEach((el) => liveIo.observe(el));
    cleanups.push(() => liveIo.disconnect());

    // 3. Parallax
    const intensity = parseFloat(getComputedStyle(root).getPropertyValue("--parallax-intensity")) || 0;
    const parallaxEls = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    if (!reduced && intensity > 0 && parallaxEls.length) {
      const visible = new Set<HTMLElement>();
      let frame = 0;
      const update = () => {
        frame = 0;
        const vh = window.innerHeight;
        for (const el of visible) {
          // data-parallax-from: ancho mínimo de viewport para activar (p. ej. solo en la constelación desktop)
          if (window.innerWidth < Number(el.dataset.parallaxFrom ?? 0)) {
            el.style.translate = "";
            continue;
          }
          const r = el.getBoundingClientRect();
          const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 aprox.
          const sy = parseFloat(el.dataset.parallax ?? "0") * intensity;
          const sx = parseFloat(el.dataset.parallaxX ?? "0") * intensity;
          el.style.translate = `${(progress * sx * 100).toFixed(1)}px ${(progress * sy * 100).toFixed(1)}px`;
        }
      };
      const onScroll = () => {
        if (!frame && visible.size) frame = requestAnimationFrame(update);
      };
      const pio = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.add(e.target as HTMLElement);
            else visible.delete(e.target as HTMLElement);
          }
          onScroll();
        },
        { rootMargin: "20% 0px 20% 0px" },
      );
      parallaxEls.forEach((el) => pio.observe(el));
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        pio.disconnect();
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
        parallaxEls.forEach((el) => (el.style.translate = ""));
      });
    }

    // 4. Lenis (carga diferida; no bloquea la interacción inicial)
    let cancelled = false;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduced && finePointer) {
      const start = () =>
        import("lenis").then(({ default: Lenis }) => {
          if (cancelled) return;
          const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -24 }, stopInertiaOnNavigate: true });
          window.__lenis = lenis;
          cleanups.push(() => {
            lenis.destroy();
            window.__lenis = undefined;
          });
        });
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle(() => void start());
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
