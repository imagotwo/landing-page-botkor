import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}

/**
 * Sección semántica estándar: <section> + H2 enlazado vía aria-labelledby
 * + párrafo Answer-First (GEO) inmediatamente debajo del encabezado.
 */
export function Section({ id, eyebrow, title, intro, children, className, align = "left" }: SectionProps) {
  const headingId = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("relative py-20 sm:py-28", className)}>
      <Container>
        <header className={cn("reveal max-w-3xl", align === "center" && "mx-auto text-center")}>
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-accent/60" />
            {eyebrow}
          </p>
          <h2 id={headingId} className="text-3xl font-semibold leading-tight text-fg sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          {intro ? <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{intro}</p> : null}
        </header>
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}
