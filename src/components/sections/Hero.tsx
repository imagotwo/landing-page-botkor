import { TrackedLink } from "@/components/analytics/TrackedLink";
import { WhatsAppIcon } from "@/components/analytics/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icon";
import { hero } from "@/content/landing";
import { whatsappHref } from "@/lib/site";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  // Resalta la marca dentro del párrafo Answer-First sin duplicar el texto.
  const [before, after] = hero.lead.split(/botkor(.*)/s);

  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_245_200/0.16),transparent)] blur-2xl"
      />
      <Container className="relative grid items-center gap-14 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] py-1.5 pr-4 pl-2 text-xs text-muted">
            <span className="animate-pulse-dot size-2 rounded-full bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-titulo" className="mt-6 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{hero.h1}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {before}
            <strong className="font-semibold text-fg">botkor</strong>
            {after}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "hero_primary" }} variant="primary" size="lg">
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </TrackedLink>
            <TrackedLink href="#casos" event="cta_click" eventParams={{ location: "hero_portfolio" }} variant="secondary" size="lg">
              {hero.secondaryCta}
            </TrackedLink>
          </div>
          <TrackedLink
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            event="contact"
            eventParams={{ method: "whatsapp", location: "hero" }}
            unstyled
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            ¿Prefieres hablar ya? Escríbenos por WhatsApp Business
          </TrackedLink>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
            {hero.proof.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd>
                  <span className="block font-mono text-2xl font-semibold text-fg">{p.value}</span>
                  <span className="mt-1 block text-xs leading-snug text-subtle">{p.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
