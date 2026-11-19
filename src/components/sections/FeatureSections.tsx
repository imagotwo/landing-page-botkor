import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ParticleField } from "@/components/motion/ParticleField";
import { SplitWords } from "@/components/motion/SplitWords";
import { Container } from "@/components/ui/Container";
import { Check, IconBadge } from "@/components/ui/Icon";
import { RowList } from "@/components/ui/RowList";
import { Section, SectionHeader } from "@/components/ui/Section";
import { automation, management, solutions, techPillars, whyBotkor } from "@/content/landing";
import { cn } from "@/lib/cn";

/** 2. Soluciones — superficie clara, encabezado centrado + tarjetas flotantes escalonadas con parallax. */
export function Solutions() {
  const offsets = ["lg:mt-0", "lg:mt-24", "lg:mt-10"];
  const speeds = ["0.35", "-0.25", "0.15"];
  return (
    <Section id={solutions.id} surface="light" className="pt-[calc(var(--section-y)*0.9)]">
      <SectionHeader id={solutions.id} eyebrow={solutions.eyebrow} title={solutions.h2} intro={solutions.intro} align="center">
        <div className="mt-10" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "solutions" }} variant="brand">
            Cotizar mi proyecto
          </TrackedLink>
        </div>
      </SectionHeader>

      <Container className="mt-[var(--space-stack)]">
        <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
          {solutions.items.map((item, i) => (
            <div key={item.title} data-reveal data-parallax={speeds[i]} data-parallax-from="1024" className={offsets[i]} style={{ "--i": i } as React.CSSProperties}>
              <article className="card-float flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <IconBadge name={item.icon} className="-ml-1" />
                  <span className="rounded-[var(--radius-icon)] bg-ink px-2.5 py-1 text-xs font-semibold text-brand-cyan">{item.tag}</span>
                </div>
                <h3 className="t-title mt-8">{item.title}</h3>
                <p className="t-body mt-4 text-[15px] text-[var(--ink-muted)]">{item.description}</p>
                <ul className="mt-7 space-y-2.5 border-t border-black/10 pt-6" role="list">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm font-medium">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-ink" strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** 3. Automatización — superficie negra, titular gigante + cúmulo de partículas, filas, flujo y marquee. */
export function Automation() {
  return (
    <Section
      id={automation.id}
      surface="dark"
      background={
        <div aria-hidden="true" className="absolute top-0 right-[-15%] h-[720px] w-[85%] opacity-50 md:right-[-8%] md:w-[60%] md:opacity-100" data-parallax="-0.4">
          <ParticleField variant="embers" />
        </div>
      }
    >
      <SectionHeader id={automation.id} eyebrow={automation.eyebrow} title={automation.h2} intro={automation.intro} className="relative" />

      <Container className="relative mt-[var(--space-stack)]">
        <RowList items={automation.items} aside="index" />

        <figure className="mt-16" data-reveal>
          <figcaption className="text-sm font-semibold text-muted">Flujo de un lead en tiempo real</figcaption>
          <ol className="mt-6 grid gap-3 sm:grid-cols-5" role="list">
            {automation.flow.map((step, i) => (
              <li key={step} className="flex items-center gap-3 rounded-[var(--radius-button)] bg-graphite px-4 py-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-icon)] bg-brand text-xs font-bold text-paper">{i + 1}</span>
                <span className="text-sm font-semibold">{step}</span>
              </li>
            ))}
          </ol>
        </figure>
      </Container>

      {/* Marquee de integraciones (patrón "marquee" de la referencia). Se pausa fuera de pantalla. */}
      <div data-live className="relative mt-16 overflow-hidden border-y border-line py-6" aria-label="Integraciones compatibles" role="region">
        <div className="marquee-track gap-12 pr-12">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center gap-12" role="list" aria-hidden={dup === 1 ? true : undefined}>
              {automation.tools.map((tool) => (
                <li key={tool} className="t-display-3 whitespace-nowrap text-fg/85">
                  {tool}
                  <span aria-hidden="true" className="ml-12 text-accent">✳</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** 4. Ingeniería y seguridad — superficie clara, filas con bullets en la tercera columna. */
export function TechPillars() {
  return (
    <Section id={techPillars.id} surface="light">
      <SectionHeader id={techPillars.id} eyebrow={techPillars.eyebrow} title={techPillars.h2} intro={techPillars.intro} />
      <Container className="mt-[var(--space-stack)]">
        <RowList items={techPillars.items} aside="bullets" />
      </Container>
    </Section>
  );
}

/** 5. Gestión — panel gris redondeado (patrón "Para mentes curiosas"): titular a la izquierda, lista a la derecha. */
export function Management() {
  return (
    <section id={management.id} aria-labelledby={`${management.id}-titulo`} className="surface-dark py-[var(--section-y-sm)]">
      <div className="container-wide">
        <div data-reveal="clip" className="surface-panel-2 grid gap-12 rounded-[var(--radius-panel)] px-6 py-14 sm:px-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20 lg:px-[6%] lg:py-24">
          <header>
            <p className="t-eyebrow mb-6">{management.eyebrow}</p>
            <h2 id={`${management.id}-titulo`} className="t-display-3 text-fg" data-reveal="words">
              <SplitWords text={management.h2} />
            </h2>
            <p className="t-body mt-6 text-muted" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              {management.intro}
            </p>
            <div className="mt-9" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "management" }} variant="brand">
                Quiero un plan de soporte
              </TrackedLink>
            </div>
          </header>
          <ul className="row-list self-center" role="list">
            {management.items.map((item, i) => (
              <li key={item.title} data-reveal="row" style={{ "--i": i } as React.CSSProperties} className="py-7">
                <h3 className="t-title flex items-start gap-3 text-fg">
                  <IconBadge name={item.icon} className="-mt-2 size-10 shrink-0 [&_svg]:size-7" />
                  {item.title}
                </h3>
                <p className="t-body mt-3 text-muted sm:pl-[3.25rem]">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** 7. Diferenciadores — superficie negra, filas con métrica/etiqueta a la derecha. */
export function WhyBotkor() {
  return (
    <Section id={whyBotkor.id} surface="dark">
      <SectionHeader id={whyBotkor.id} eyebrow={whyBotkor.eyebrow} title={whyBotkor.h2} intro={whyBotkor.intro} />
      <Container className={cn("mt-[var(--space-stack)]")}>
        <RowList items={whyBotkor.items} aside="tag" />
      </Container>
    </Section>
  );
}
