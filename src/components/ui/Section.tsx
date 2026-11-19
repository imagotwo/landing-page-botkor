import type { ReactNode } from "react";
import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type Surface = "light" | "dark" | "brand" | "panel";

interface SectionProps {
  id: string;
  surface?: Surface;
  children: ReactNode;
  className?: string;
  /** Contenido absoluto detrás (partículas, decoración). */
  background?: ReactNode;
}

/** <section> semántica con superficie de color y espaciado vertical del sistema. */
export function Section({ id, surface = "light", children, className, background }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={cn(`surface-${surface}`, "relative isolate overflow-hidden section-y", className)}>
      {background}
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  size?: "display-2" | "display-3";
  className?: string;
  children?: ReactNode;
}

/**
 * Encabezado editorial: H2 grande con revelado por palabras + párrafo Answer-First (GEO).
 * El H2 lleva id `${id}-titulo` para aria-labelledby de la sección.
 */
export function SectionHeader({ id, eyebrow, title, intro, align = "left", size = "display-2", className, children }: SectionHeaderProps) {
  return (
    <Container>
      <header className={cn(align === "center" ? "mx-auto max-w-5xl text-center" : "max-w-4xl", className)}>
        {eyebrow ? (
          <p className="t-eyebrow mb-6" data-reveal="fade">
            {eyebrow}
          </p>
        ) : null}
        <h2 id={`${id}-titulo`} className={cn(`t-${size}`, "text-fg")} data-reveal="words">
          <SplitWords text={title} />
        </h2>
        {intro ? (
          <p className={cn("t-lead mt-7 text-muted", align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl")} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            {intro}
          </p>
        ) : null}
        {children}
      </header>
    </Container>
  );
}
