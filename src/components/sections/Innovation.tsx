import { DeviceShowcase } from "@/components/motion/DeviceShowcase";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { innovation } from "@/content/landing";

/**
 * 6. Innovación / Tecnología — encabezado centrado + vitrina animada de dispositivos
 * (laptop → celulares con la web de Enfermeras Ángeles de Vida). Solo H2 en esta sección.
 * Las tarjetas de tecnologías (innovation.items) se retiraron de la vista a petición del cliente;
 * los textos siguen en content/landing.ts por si se quieren recuperar.
 */
export function Innovation() {
  return (
    <Section id={innovation.id} surface="light">
      <SectionHeader id={innovation.id} eyebrow={innovation.eyebrow} title={innovation.h2} intro={innovation.intro} align="center" />

      <Container className="mt-[var(--space-stack)]">
        <DeviceShowcase />
      </Container>
    </Section>
  );
}
