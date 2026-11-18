import { Section } from "@/components/ui/Section";
import { cases } from "@/content/landing";

/** 10. Casos de éxito — H2 + 2 × H3 (también destino del CTA "Ver portafolio"). */
export function Cases() {
  return (
    <Section id={cases.id} eyebrow={cases.eyebrow} title={cases.h2} intro={cases.intro}>
      <div className="grid gap-6 lg:grid-cols-2">
        {cases.items.map((c) => (
          <article
            key={c.title}
            className="card-glow reveal flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface/80"
          >
            <div className="grid grid-cols-2 border-b border-line bg-gradient-to-br from-accent/[0.07] to-electric/[0.05]">
              {c.metrics.map((m) => (
                <div key={m.label} className="p-6 first:border-r first:border-line sm:p-8">
                  <p className="font-mono text-3xl font-semibold text-accent sm:text-4xl">{m.value}</p>
                  <p className="mt-2 text-sm leading-snug text-muted">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-fg">{c.title}</h3>
              <dl className="mt-5 space-y-4 text-[15px] leading-relaxed">
                <div>
                  <dt className="font-mono text-xs tracking-[0.14em] text-subtle uppercase">Reto</dt>
                  <dd className="mt-1 text-muted">{c.challenge}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs tracking-[0.14em] text-subtle uppercase">Solución botkor</dt>
                  <dd className="mt-1 text-muted">{c.solution}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
