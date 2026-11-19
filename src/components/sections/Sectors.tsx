import { Container } from "@/components/ui/Container";
import { Check, IconBadge } from "@/components/ui/Icon";
import { Section, SectionHeader } from "@/components/ui/Section";
import { sectors } from "@/content/landing";

/** 8. Sectores — tarjetas blancas flotantes con entrada escalonada (sin H3 adicionales). */
export function Sectors() {
  return (
    <Section id={sectors.id} surface="light">
      <SectionHeader id={sectors.id} eyebrow={sectors.eyebrow} title={sectors.h2} intro={sectors.intro} />
      <Container className="mt-[var(--space-stack)]">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {sectors.items.map((s, i) => (
            <li key={s.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <article className="card-float group flex h-full flex-col p-7">
                <IconBadge name={s.icon} className="-ml-1 group-hover:-translate-y-1" />
                <p className="t-title mt-6">{s.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-muted)]">{s.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-black/10 pt-5" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm font-medium">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-ink" strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
