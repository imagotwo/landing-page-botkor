import { Section } from "@/components/ui/Section";
import { Check, IconBadge } from "@/components/ui/Icon";
import { sectors } from "@/content/landing";

/** 8. Sectores — H2 + grid interactivo (hover/focus) sin H3 adicionales. */
export function Sectors() {
  return (
    <Section id={sectors.id} eyebrow={sectors.eyebrow} title={sectors.h2} intro={sectors.intro}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {sectors.items.map((s) => (
          <li
            key={s.title}
            className="card-glow reveal group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-2"
          >
            <IconBadge name={s.icon} className="transition-colors group-hover:bg-accent/15" />
            <p className="mt-5 text-base font-semibold text-fg">{s.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            <ul className="mt-5 space-y-2 border-t border-line pt-4" role="list">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-fg/85">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.25} />
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
