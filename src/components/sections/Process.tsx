import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ParticleField } from "@/components/motion/ParticleField";
import { SplitWords } from "@/components/motion/SplitWords";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { processSection } from "@/content/landing";

/**
 * 9. Proceso — patrón "module-cta" de la referencia: superficie negra con un gran
 * cúmulo de brasas a la izquierda y el titular alineado a la derecha; debajo, la
 * línea de tiempo de 4 pasos en filas con filete superior.
 */
export function Process() {
  const id = processSection.id;
  return (
    <Section
      id={id}
      surface="dark"
      background={
        <div aria-hidden="true" className="absolute -top-10 left-[-25%] h-[760px] w-[110%] opacity-60 md:left-[-10%] md:w-[75%] md:opacity-100" data-parallax="0.35">
          <ParticleField variant="embers" />
        </div>
      }
    >
      <Container className="relative">
        <header className="ml-auto max-w-xl pt-[clamp(8rem,22vw,20rem)] md:pt-[clamp(6rem,14vw,14rem)] lg:mr-[2%]">
          <p className="t-eyebrow mb-6" data-reveal="fade">{processSection.eyebrow}</p>
          <h2 id={`${id}-titulo`} className="t-display-2 text-fg" data-reveal="words">
            <SplitWords text={processSection.h2} />
          </h2>
          <p className="t-lead mt-7 text-muted" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            {processSection.intro}
          </p>
          <div className="mt-9" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "process" }} variant="brand">
              Empezar mi diagnóstico
            </TrackedLink>
          </div>
        </header>

        <ol className="mt-[var(--space-stack)] grid gap-x-8 md:grid-cols-2 lg:grid-cols-4" role="list">
          {processSection.steps.map((step, i) => (
            <li key={step.title} data-reveal="row" style={{ "--i": i } as React.CSSProperties} className="border-t-2 border-paper py-8">
              <div className="flex items-baseline justify-between">
                <span className="t-metric text-accent" aria-hidden="true">0{i + 1}</span>
                <span className="text-xs font-semibold text-muted">{step.time}</span>
              </div>
              <p className="t-title mt-6 text-fg">
                <span className="sr-only">Paso {i + 1}: </span>
                {step.title}
              </p>
              <p className="t-body mt-3 text-[15px] text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
