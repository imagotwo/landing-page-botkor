import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { cases } from "@/content/landing";

const isDev = process.env.NODE_ENV !== "production";

/**
 * 10. Casos de éxito — paneles oscuros editoriales con métricas grandes (H2 + H3 por caso).
 * Los casos con `sample: true` (datos de ejemplo) solo se renderizan en desarrollo y con una
 * etiqueta visible: en producción no se publican métricas sin confirmar.
 */
export function Cases() {
  const items = cases.items.filter((c) => isDev || !c.sample);

  return (
    <Section id={cases.id} surface="light">
      <SectionHeader id={cases.id} eyebrow={cases.eyebrow} title={cases.h2} intro={cases.intro} />
      <Container className="mt-[var(--space-stack)]">
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((c, i) => (
            <div key={c.title} data-reveal style={{ "--i": i } as React.CSSProperties} className={cn(c.featured && "lg:col-span-2")}>
              <article className="surface-panel group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5">
                {c.sample && (
                  <p className="absolute top-3 right-3 z-10 rounded-full bg-[#facc15] px-3 py-1 text-xs font-semibold text-ink">
                    Datos de ejemplo · solo visible en desarrollo
                  </p>
                )}
                <div className={cn("grid border-b border-line", c.metrics.length === 3 ? "sm:grid-cols-3" : "grid-cols-2")}>
                  {c.metrics.map((m) => (
                    <div key={m.label} className="border-line p-7 not-last:border-b sm:p-9 sm:not-last:border-r sm:not-last:border-b-0">
                      <p className="text-[clamp(2.75rem,2rem+3vw,4.75rem)] leading-none font-medium tracking-[-0.04em] text-accent tabular-nums">{m.value}</p>
                      <p className="mt-3 text-sm text-muted">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <h3 className="t-title text-fg">{c.title}</h3>
                  <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-accent uppercase">Reto</dt>
                      <dd className="mt-2 text-[15px] leading-relaxed text-muted">{c.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-accent uppercase">Solución botkor</dt>
                      <dd className="mt-2 text-[15px] leading-relaxed text-muted">{c.solution}</dd>
                    </div>
                  </dl>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener"
                      className="link-underline mt-7 self-start text-sm font-semibold text-fg"
                    >
                      Ver el sitio publicado
                      <span className="sr-only"> (se abre en una nueva pestaña)</span> ↗
                    </a>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
