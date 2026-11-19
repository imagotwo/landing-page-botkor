import { WhatsAppIcon } from "@/components/analytics/WhatsAppIcon";
import { hero, pageDates } from "@/content/landing";
import { siteConfig, whatsappHref } from "@/lib/site";

const SERVICE_LINKS = [
  { href: "#soluciones", label: "Páginas web corporativas" },
  { href: "#soluciones", label: "Tiendas online (E-commerce)" },
  { href: "#soluciones", label: "Landing pages de alta conversión" },
  { href: "#automatizacion", label: "Automatización e integraciones" },
  { href: "#seguridad", label: "Auditoría y seguridad web" },
];

/** "2026-11-18" → "18 de noviembre de 2026" (sin depender de la zona horaria del servidor) */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/** Footer de la referencia: wordmark gigante, lema a la derecha, filas con divisores. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="surface-dark pt-[var(--section-y-sm)]">
      <div className="container-wide">
        <div className="flex flex-col gap-6 pb-14 md:flex-row md:items-end md:justify-between">
          <a href={siteConfig.landingPath} aria-label="botkor, volver al inicio" className="block w-[clamp(15rem,8rem+28vw,34rem)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG vectorial */}
            <img src="/brand/botkor-logotipo-blanco.svg" alt="" width={228} height={57} className="h-auto w-full" loading="lazy" />
          </a>
          <p className="max-w-xs text-base font-semibold md:text-right">
            {hero.eyebrow}
          </p>
        </div>

        <div className="grid gap-10 border-t border-line py-12 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-3">
            <a href="#cotizar" className="rounded-[var(--radius-button)] border-2 border-paper px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink">
              Solicitar cotización
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Business (se abre en una nueva pestaña)"
              className="inline-flex size-[46px] items-center justify-center rounded-[var(--radius-button)] border-2 border-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={`mailto:${siteConfig.email}`} className="link-underline ml-2 text-paper">
              {siteConfig.email}
            </a>
          </div>
          <nav aria-label="Servicios" className="md:justify-self-end">
            <ul className="space-y-2 md:text-right" role="list">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[15px] font-semibold text-paper/90 transition-colors hover:text-brand-cyan">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-7 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. Todos los derechos reservados. · Última actualización:{" "}
            <time dateTime={pageDates.modified}>{formatDate(pageDates.modified)}</time>
          </p>
          <p>Rendimiento, accesibilidad y seguridad por diseño.</p>
        </div>
      </div>
    </footer>
  );
}
