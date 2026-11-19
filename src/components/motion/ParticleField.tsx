"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { createNebula, type NebulaScene } from "./nebula";

type Variant = "nebula" | "embers";

interface ParticleFieldProps {
  variant?: Variant;
  className?: string;
}

/**
 * Partículas en <canvas> 2D (código propio, ~8 KB en vez de varios MB de MP4).
 *  - "nebula": coreografía de 12,28 s del hero (entrada desde cámara → dos esferas →
 *    fusión con núcleo cálido → explosión). Ver nebula.ts.
 *  - "embers": cúmulo de brasas con deriva lenta (secciones oscuras).
 * Rendimiento: arranca tras `load` en un momento ocioso, solo dibuja cuando es visible y
 * la pestaña está activa, DPR limitado a 1.5, ~30 fps y menos partículas en móvil.
 * Con reduced-motion dibuja un único fotograma estático.
 * Colores: tokens CSS --particle-color y --particle-glow de la superficie ("r g b").
 */
export function ParticleField({ variant = "nebula", className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(canvas);
    const rgb = css.getPropertyValue("--particle-color").trim() || "255 255 255";
    const glow = css.getPropertyValue("--particle-glow").trim() || "255 196 0";
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0, h = 0, raf = 0, running = false, visible = false, t = 0, last = 0;
    const scene: NebulaScene = variant === "nebula" ? createNebula(rgb, glow) : createEmbers(rgb);
    // Fotograma estático para reduced-motion: las dos esferas en reposo
    const STILL = variant === "nebula" ? 5500 : 0;

    const draw = () => scene.draw(ctx, w, h, (reduced ? STILL : t) / 1000);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.build(w, h);
      if (!running) draw();
    };

    // En móvil se limita a ~30 fps: ahorra CPU y batería.
    const frameBudget = window.innerWidth < 768 ? 33 : 0;
    let acc = 0;
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(48, now - (last || now));
      last = now;
      t += dt;
      acc += dt;
      if (acc >= frameBudget) {
        acc = 0;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const setRunning = () => {
      const shouldRun = visible && !document.hidden && !reduced;
      if (shouldRun && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
      if (!shouldRun && running) { running = false; cancelAnimationFrame(raf); }
    };

    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; setRunning(); });
    const ro = new ResizeObserver(() => resize());
    const onVis = () => setRunning();

    // Arranque diferido: tras el evento load y en un momento ocioso → no compite con el LCP ni con la hidratación
    let handle: number | undefined;
    let timer: number | undefined;
    const boot = () => {
      resize();
      canvas.dataset.ready = "true";
      ro.observe(canvas);
      io.observe(canvas);
      document.addEventListener("visibilitychange", onVis);
    };
    const schedule = () => {
      timer = window.setTimeout(() => {
        handle = window.requestIdleCallback ? window.requestIdleCallback(boot, { timeout: 2000 }) : window.setTimeout(boot, 0);
      }, 600);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer);
      if (handle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1500ms] data-[ready=true]:opacity-100",
        className,
      )}
    />
  );
}

/** Brasas: un cúmulo esférico que rota muy despacio, con deriva vertical y parpadeo. */
function createEmbers(rgb: string): NebulaScene {
  const color = `rgb(${rgb})`;
  const cluster = { cx: 0.32, cy: 0.58, r: 0.3 };
  let particles: Array<{ x: number; y: number; z: number; s: number; a: number; tw: number }> = [];
  let stars: Array<{ x: number; y: number; s: number; a: number; v: number }> = [];

  const gauss = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  return {
    build(w) {
      const mobile = w < 768;
      particles = Array.from({ length: mobile ? 320 : 1100 }, () => {
        let x = gauss() * 0.42, y = gauss() * 0.42, z = gauss() * 0.42;
        const d = Math.hypot(x, y, z);
        if (d > 1) { x /= d; y /= d; z /= d; }
        const big = Math.random() < 0.08;
        return {
          x, y, z,
          s: big ? 3 + Math.random() * 5 : 0.8 + Math.random() * 2.4,
          a: big ? 0.95 : 0.4 + Math.random() * 0.6,
          tw: Math.random() * Math.PI * 2,
        };
      });
      stars = Array.from({ length: mobile ? 50 : 140 }, () => ({
        x: Math.random(), y: Math.random(),
        s: Math.random() < 0.025 ? 2.5 + Math.random() * 3 : 0.7 + Math.random() * 1.4,
        a: 0.25 + Math.random() * 0.6,
        v: 0.002 + Math.random() * 0.006,
      }));
    },

    draw(ctx, w, h, tSec) {
      const t = tSec * 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const mobile = w < 768;
      const rot = t * 0.00005;
      const cos = Math.cos(rot), sin = Math.sin(rot);
      const base = mobile ? Math.max(w, h * 0.6) : Math.min(w, h * 1.6);

      for (const s of stars) {
        const y = (((s.y - t * s.v * 0.001) % 1) + 1) % 1;
        ctx.globalAlpha = s.a;
        if (s.s > 2) { ctx.beginPath(); ctx.arc(s.x * w, y * h, s.s, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(s.x * w, y * h, s.s, s.s);
      }

      const cx = (mobile ? cluster.cx * 0.9 + 0.1 : cluster.cx) * w;
      const cy = (mobile ? cluster.cy * 0.55 + 0.05 : cluster.cy) * h;
      const rad = cluster.r * base;
      for (const p of particles) {
        const x = p.x * cos - p.z * sin;
        const z = p.x * sin + p.z * cos;
        const persp = 1 / (1.9 - z * 0.6);
        const lift = Math.sin(p.tw + t * 0.0005) * (2 + p.s * 1.5);
        const px = cx + x * rad * persp * 1.5;
        const py = cy + p.y * rad * persp * 1.5 + lift;
        const twinkle = 0.75 + 0.25 * Math.sin(p.tw + t * 0.002);
        ctx.globalAlpha = Math.min(1, p.a * twinkle * (0.55 + (z + 1) * 0.3));
        const size = p.s * persp * 1.4;
        if (size > 2.2) { ctx.beginPath(); ctx.arc(px, py, size / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(px, py, size, size);
      }
      ctx.globalAlpha = 1;
    },
  };
}
