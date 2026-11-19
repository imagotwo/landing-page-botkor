"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/analytics/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { siteConfig, whatsappHref } from "@/lib/site";

const BAR_LINKS = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#proceso", label: "Proceso" },
  { href: "#tecnologia", label: "Proyectos" },
];

const MENU_LINKS = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#automatizacion", label: "Automatización" },
  { href: "#seguridad", label: "Ingeniería y seguridad" },
  { href: "#tecnologia", label: "Tecnología" },
  { href: "#proceso", label: "Proceso" },
  { href: "#preguntas-frecuentes", label: "Preguntas frecuentes" },
];

/** Logotipo: enlace con wordmark, nunca un encabezado (regla de H1 único). */
/**
 * Logotipo oficial (public/brand). Las dos versiones se superponen y se funden al cambiar
 * el header de transparente (sobre el hero azul noche → blanco) a sólido (→ azul corporativo).
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const img = "absolute inset-0 h-full w-full transition-opacity duration-[var(--dur-nav)]";
  return (
    <a href={siteConfig.landingPath} aria-label="botkor, ir al inicio" className="relative block aspect-[228/57.41] h-9 shrink-0 sm:h-11">
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG vectorial: next/image no lo optimiza */}
      <img src="/brand/botkor-logotipo.svg" alt="" width={228} height={57} className={cn(img, tone === "dark" ? "opacity-100" : "opacity-0")} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/botkor-logotipo-blanco.svg" alt="" width={228} height={57} className={cn(img, tone === "light" ? "opacity-100" : "opacity-0")} />
    </a>
  );
}

/**
 * Header de la referencia: transparente sobre el hero, se oculta al bajar
 * y reaparece con fondo blanco al subir (0.5 s, cubic-bezier(.34,.7,.27,1)).
 */
export function Header() {
  const menuId = useId();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Dirección de scroll (rAF + passive, sin trabajo si no cambia el estado)
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setAtTop(y < 24);
      if (!openRef.current && Math.abs(y - lastY) > 6) setHidden(y > lastY && y > 200);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Menú abierto: bloquea scroll, Escape cierra, foco al primer enlace, foco atrapado en el panel
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? idx - 1 : idx + 1;
        if (next < 0 || next >= focusables.length) {
          e.preventDefault();
          focusables[e.shiftKey ? focusables.length - 1 : 0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [open, close]);

  const solid = !atTop;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-[var(--dur-nav)] ease-[var(--ease-nav)]",
          solid ? "bg-paper" : "bg-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="container-wide flex h-[var(--nav-height)] items-center justify-between gap-6">
          {/* Sobre el hero (azul noche) el logo va en blanco; con el header sólido, en negro */}
          <Logo tone={solid ? "dark" : "light"} />

          {/* Barra negra (desktop) que contiene navegación, CTA y el único botón de menú */}
          <div className="flex items-center rounded-[var(--radius-button)] text-paper lg:h-[45px] lg:bg-ink lg:py-[5px] lg:pr-[5px] lg:pl-5">
            <nav aria-label="Principal" className="hidden h-full items-center gap-1 lg:flex">
              <ul className="flex items-center gap-1" role="list">
                {BAR_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="relative block px-3 py-2 text-[15px] font-semibold after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand-cyan after:transition-transform after:duration-300 hover:after:scale-x-100">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#cotizar"
                onClick={() => trackEvent("cta_click", { location: "header" })}
                className="ml-3 flex h-full items-center rounded-[var(--radius-icon)] bg-paper px-3 text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-brand hover:text-paper"
              >
                Cotizar mi web
              </a>
            </nav>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="ml-1 inline-flex size-[45px] items-center justify-center rounded-[var(--radius-button)] bg-ink text-paper transition-colors lg:size-[35px] lg:rounded-[var(--radius-icon)] lg:bg-transparent lg:hover:bg-white/10"
            >
              {open ? <X className="size-7" strokeWidth={1.75} /> : <Menu className="size-7" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      {/* Velo */}
      <div
        aria-hidden="true"
        onClick={() => close(false)}
        className={cn(
          "fixed inset-0 z-40 bg-[var(--overlay)] transition-opacity duration-[var(--dur-medium)]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Panel: tarjeta blanca bajo la barra (desktop) · pantalla completa (móvil) */}
      <div
        id={menuId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        hidden={!open}
        className={cn(
          "fixed z-50 bg-paper text-ink",
          "inset-x-0 top-[var(--nav-height)] bottom-0 overflow-y-auto px-[var(--gutter)] pb-10",
          "lg:inset-auto lg:top-[calc(var(--nav-height)+5px)] lg:right-[max(var(--gutter),calc((100vw-var(--container-wide))/2))] lg:bottom-auto lg:w-[300px] lg:rounded-[var(--radius-panel)] lg:px-6 lg:py-6 lg:shadow-[var(--shadow-panel)]",
          open && "menu-enter",
        )}
        data-lenis-prevent
      >
        <ul role="list" className="lg:text-center">
          {MENU_LINKS.map((l, i) => (
            <li key={l.href} className="menu-item border-t border-black/12 first:border-t-0 lg:border-0" style={{ "--i": i } as React.CSSProperties}>
              <a href={l.href} onClick={() => close(false)} className="group flex items-center justify-between py-4 text-xl font-medium lg:justify-center lg:py-2 lg:text-lg">
                {l.label}
                <ArrowRight aria-hidden="true" className="size-5 text-black/30 transition-transform duration-300 group-hover:translate-x-1 lg:hidden" />
              </a>
            </li>
          ))}
        </ul>
        <div className="menu-item mt-6 grid gap-3 lg:mt-5" style={{ "--i": MENU_LINKS.length } as React.CSSProperties}>
          <a href="#cotizar" onClick={() => { trackEvent("cta_click", { location: "menu" }); close(false); }} className="btn btn--dark btn--block">
            <span className="btn__label">Cotizar mi página web</span>
            <span className="btn__icon" aria-hidden="true"><ArrowRight strokeWidth={2.25} /></span>
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("contact", { method: "whatsapp", location: "menu" })}
            className="flex items-center justify-center gap-2 py-2 text-sm font-semibold"
          >
            <WhatsAppIcon className="size-5 text-whatsapp" />
            WhatsApp Business
          </a>
        </div>
      </div>
    </>
  );
}

