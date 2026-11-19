import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cases } from "@/content/landing";

/** 10. Casos de éxito — paneles oscuros editoriales con métricas grandes (H2 + 2 × H3). */
export function Cases() {
  return (
    <Section id={cases.id} surface="light">
      <SectionHeader id={cases.id} eyebrow={cases.eyebrow} title={cases.h2} intro={cases.intro} />
      <Container className="mt-[var(--space-stack)]">
        <div className="grid gap-6 lg:grid-cols-2">
          {cases.items.map((c, i) => (
            <div key={c.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <article className="surface-panel group flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5">
                <div className="grid grid-cols-2 border-b border-line">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="p-7 first:border-r first:border-line sm:p-9">
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
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
