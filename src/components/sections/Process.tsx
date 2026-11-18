import { Section } from "@/components/ui/Section";
import { processSection } from "@/content/landing";

/** 9. Proceso — timeline de 4 pasos como lista ordenada (semántica correcta para pasos secuenciales). */
export function Process() {
  return (
    <Section
      id={processSection.id}
      eyebrow={processSection.eyebrow}
      title={processSection.h2}
      intro={processSection.intro}
      className="border-y border-line bg-surface/30"
    >
      <ol className="relative grid gap-6 lg:grid-cols-4" role="list">
        <span
          aria-hidden="true"
          className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 lg:block"
        />
        {processSection.steps.map((step, i) => (
          <li key={step.title} className="reveal relative flex gap-5 lg:flex-col lg:gap-0">
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-bg font-mono text-sm font-semibold text-accent shadow-[0_0_30px_-6px_rgb(139_245_200/0.5)] lg:mx-auto">
              0{i + 1}
            </span>
            <div className="lg:mt-6 lg:text-center">
              <p className="font-mono text-xs text-subtle">{step.time}</p>
              <p className="mt-1.5 text-base font-semibold text-fg">
                <span className="sr-only">Paso {i + 1}: </span>
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
