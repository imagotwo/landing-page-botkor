import { DeviceShowcase } from "@/components/motion/DeviceShowcase";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { innovation } from "@/content/landing";

/**
 * 6. Innovación / Tecnología — encabezado centrado + vitrina animada de dispositivos
 * (laptop → celulares con la web de Enfermeras Ángeles de Vida). Solo H2 en esta sección.
 * Las tarjetas de tecnologías (innovation.items) se retiraron de la vista a petición del cliente;
 * los textos siguen en content/landing.ts por si se quieren recuperar.
 * Bajo la vitrina va un pie de foto con texto real, porque la animación no la leen buscadores ni IA.
 */
export function Innovation() {
  return (
    <Section id={innovation.id} surface="light">
      <SectionHeader id={innovation.id} eyebrow={innovation.eyebrow} title={innovation.h2} intro={innovation.intro} align="center" />

      <Container className="mt-[var(--space-stack)]">
        <DeviceShowcase />
        {/* Texto visible que describe la animación (decorativa y aria-hidden): lo leen buscadores, IA y lectores de pantalla */}
        <p data-reveal className="mx-auto mt-8 max-w-[62ch] text-center text-[15px] leading-relaxed text-muted">
          {innovation.showcaseCaption}{" "}
          <a href={innovation.showcaseUrl} target="_blank" rel="noopener" className="link-underline font-semibold text-fg">
            Visitar el sitio<span className="sr-only"> de Enfermeras Ángeles de Vida (se abre en una nueva pestaña)</span> ↗
          </a>
        </p>
      </Container>
    </Section>
  );
}
