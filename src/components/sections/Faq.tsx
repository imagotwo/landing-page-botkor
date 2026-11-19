import { ChevronDown } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SplitWords } from "@/components/motion/SplitWords";
import { faq } from "@/content/landing";
import { whatsappHref } from "@/lib/site";

/**
 * 11. FAQ — panel gris (patrón "module-faq" de la referencia): titular + CTA a la izquierda,
 * acordeón con filetes a la derecha. <details>/<summary> nativo: todas las respuestas
 * están en el HTML inicial (indexables) y la apertura se anima con CSS (mejora progresiva).
 */
export function Faq() {
  const headingId = `${faq.id}-titulo`;
  return (
    <section id={faq.id} aria-labelledby={headingId} className="surface-dark py-[var(--section-y-sm)]">
      <div className="container-wide">
        <div data-reveal="clip" className="surface-panel-2 grid gap-12 rounded-[var(--radius-panel)] px-6 py-14 sm:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-[6%] lg:py-24">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="t-eyebrow mb-6">{faq.eyebrow}</p>
            <h2 id={headingId} className="t-display-3 text-fg" data-reveal="words">
              <SplitWords text={faq.h2} />
            </h2>
            <div className="mt-9" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <TrackedLink
                href={whatsappHref("Hola botkor, tengo una pregunta sobre el desarrollo de mi página web.")}
                target="_blank"
                rel="noopener noreferrer"
                event="contact"
                eventParams={{ method: "whatsapp", location: "faq" }}
                variant="brand"
              >
                ¿Otra pregunta? Escríbenos
              </TrackedLink>
            </div>
          </header>

          <div>
            {faq.items.map((item, i) => (
              <details key={item.question} className="accordion group border-t-2 border-paper last:border-b-2" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[clamp(1.05rem,1rem+0.3vw,1.25rem)] leading-snug font-semibold text-fg">{item.question}</h3>
                  <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-7 text-[15px] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
