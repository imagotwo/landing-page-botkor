import { LeadFormLoader } from "@/components/forms/LeadFormLoader";
import { SplitWords } from "@/components/motion/SplitWords";
import { Check } from "@/components/ui/Icon";
import { contact } from "@/content/landing";

/** 12. Cierre — superficie de marca (cierra el ciclo visual abierto por el hero) + formulario en tarjeta blanca. */
export function ContactSection() {
  const headingId = `${contact.id}-titulo`;
  return (
    <section id={contact.id} aria-labelledby={headingId} className="surface-brand relative isolate overflow-hidden py-[var(--section-y)]">
      <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="t-eyebrow mb-6" data-reveal="fade">{contact.eyebrow}</p>
          <h2 id={headingId} className="t-display-2 text-fg" data-reveal="words">
            <SplitWords text={contact.h2} />
          </h2>
          <p className="t-lead mt-7 font-medium text-muted" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            {contact.intro}
          </p>
          <ul className="mt-9 space-y-4" role="list">
            {contact.assurances.map((a, i) => (
              <li key={a} className="flex items-center gap-3 text-base font-semibold" data-reveal style={{ "--i": 3 + i } as React.CSSProperties}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-icon)] bg-paper">
                  <Check aria-hidden="true" className="size-4 text-brand-ink" strokeWidth={3} />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <div className="surface-light rounded-[var(--radius-panel)] p-6 shadow-[var(--shadow-panel)] sm:p-9">
            <LeadFormLoader />
          </div>
        </div>
      </div>
    </section>
  );
}
