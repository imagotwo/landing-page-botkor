import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import { automation, management, solutions, techPillars, whyBotkor } from "@/content/landing";

/** 2. Soluciones transaccionales — H2 + 3 × H3 */
export function Solutions() {
  return (
    <Section id={solutions.id} eyebrow={solutions.eyebrow} title={solutions.h2} intro={solutions.intro}>
      <div className="grid gap-5 md:grid-cols-3">
        {solutions.items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}

/** 3. Arquitectura para automatización — H2 + 3 × H3 + diagrama de flujo de datos */
export function Automation() {
  return (
    <Section
      id={automation.id}
      eyebrow={automation.eyebrow}
      title={automation.h2}
      intro={automation.intro}
      className="border-y border-line bg-surface/30"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {automation.items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>

      <figure className="reveal mt-10 rounded-[var(--radius-card)] border border-line bg-bg/60 p-6 sm:p-8">
        <figcaption className="font-mono text-xs tracking-[0.18em] text-subtle uppercase">
          Flujo de un lead en tiempo real
        </figcaption>
        <ol className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center" role="list">
          {automation.flow.map((step, i) => (
            <li key={step} className="flex items-center gap-3 sm:flex-1">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-xs text-accent">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-fg">{step}</span>
              {i < automation.flow.length - 1 ? (
                <span aria-hidden="true" className="animate-flow hidden h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)] sm:block" />
              ) : null}
            </li>
          ))}
        </ol>
        <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6" role="list" aria-label="Integraciones compatibles">
          {automation.tools.map((tool) => (
            <li key={tool} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {tool}
            </li>
          ))}
        </ul>
      </figure>
    </Section>
  );
}

/** 4. Pilares técnicos y seguridad — H2 + 3 × H3 */
export function TechPillars() {
  return (
    <Section id={techPillars.id} eyebrow={techPillars.eyebrow} title={techPillars.h2} intro={techPillars.intro}>
      <div className="grid gap-5 md:grid-cols-3">
        {techPillars.items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}

/** 5. Gestión y evolución digital — H2 + 3 × H3 */
export function Management() {
  return (
    <Section
      id={management.id}
      eyebrow={management.eyebrow}
      title={management.h2}
      intro={management.intro}
      className="border-y border-line bg-surface/30"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {management.items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}

/** 7. Diferenciadores — H2 + 4 × H3 */
export function WhyBotkor() {
  return (
    <Section id={whyBotkor.id} eyebrow={whyBotkor.eyebrow} title={whyBotkor.h2} intro={whyBotkor.intro}>
      <div className="grid gap-5 sm:grid-cols-2">
        {whyBotkor.items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}
