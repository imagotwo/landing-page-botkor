import { LeadForm } from "@/components/forms/LeadForm";
import { Check } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { contact } from "@/content/landing";

/** 12. Cierre transaccional — H2 + formulario (isla cliente). */
export function ContactSection() {
  const headingId = `${contact.id}-titulo`;
  return (
    <section id={contact.id} aria-labelledby={headingId} className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[480px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_245_200/0.12),transparent)] blur-2xl"
      />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-accent uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-accent/60" />
            {contact.eyebrow}
          </p>
          <h2 id={headingId} className="text-3xl leading-tight font-semibold text-fg sm:text-4xl lg:text-[2.75rem]">
            {contact.h2}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{contact.intro}</p>
          <ul className="mt-8 space-y-3.5" role="list">
            {contact.assurances.map((a) => (
              <li key={a} className="flex items-center gap-3 text-[15px] text-fg">
                <span className="flex size-6 items-center justify-center rounded-full bg-accent/15">
                  <Check aria-hidden="true" className="size-3.5 text-accent" strokeWidth={3} />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-[1.5rem] border border-line-strong bg-surface/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <LeadForm />
        </div>
      </Container>
    </section>
  );
}
