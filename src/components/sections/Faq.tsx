import { Section } from "@/components/ui/Section";
import { faq } from "@/content/landing";

/**
 * 11. FAQ — acordeón nativo <details>/<summary>: accesible por teclado, sin JavaScript
 * y con TODAS las respuestas presentes en el HTML inicial (indexables por crawlers de IA).
 * El H3 vive dentro del <summary> para conservar la jerarquía H2 → H3.
 */
export function Faq() {
  return (
    <Section id={faq.id} eyebrow={faq.eyebrow} title={faq.h2} className="border-y border-line bg-surface/30">
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-[var(--radius-card)] border border-line bg-bg/60">
        {faq.items.map((item, i) => (
          <details key={item.question} className="group px-6 sm:px-8" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-semibold text-fg sm:text-lg">{item.question}</h3>
              <span
                aria-hidden="true"
                className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong transition-transform duration-300 group-open:rotate-45"
              >
                <span className="absolute h-px w-3 bg-fg" />
                <span className="absolute h-3 w-px bg-fg" />
              </span>
            </summary>
            <p className="-mt-1 pb-6 text-[15px] leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
