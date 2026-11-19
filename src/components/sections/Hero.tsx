import { TrackedLink } from "@/components/analytics/TrackedLink";
import { WhatsAppIcon } from "@/components/analytics/WhatsAppIcon";
import { ParticleField } from "@/components/motion/ParticleField";
import { SplitWords } from "@/components/motion/SplitWords";
import { hero, whyBotkor } from "@/content/landing";
import { whatsappHref } from "@/lib/site";
import { HeroVisual } from "./HeroVisual";

/**
 * Hero (patrón "home-head" de la referencia):
 *  - Fondo azul noche con halos (.hero-backdrop) y, encima, la nube de partículas.
 *  - H1 gigante revelado por palabras (solo CSS: no depende de JS ni retrasa el LCP).
 *  - Lema inferior derecho con filete vertical.
 *  - Panel oscuro superpuesto que "cabalga" el borde inferior del hero.
 */
export function Hero() {
  const [before, after] = hero.lead.split(/botkor(.*)/s);
  const [tagA, tagB] = hero.eyebrow.split(" · ");
  const statement = whyBotkor.intro.split(". ").at(-1) ?? "";

  return (
    <section aria-labelledby="hero-titulo" className="surface-night relative isolate overflow-hidden">
      <div className="relative flex min-h-[100svh] flex-col justify-center pt-[calc(var(--nav-height)+2.5rem)] pb-[clamp(9rem,22vh,15rem)]">
        {/* Se prolonga bajo el panel superpuesto para que los halos no se corten en el borde */}
        <div aria-hidden="true" className="hero-backdrop absolute inset-x-0 top-0 h-[calc(100%+30rem)]" />
        <ParticleField variant="nebula" />
        <div className="container-content relative">
          <h1 id="hero-titulo" className="hero-title t-display-1 max-w-[17ch] text-fg">
            <SplitWords text={hero.h1} />
          </h1>

          <p className="hero-enter t-lead mt-8 max-w-2xl font-medium text-muted" style={{ "--i": 0 } as React.CSSProperties}>
            {before}
            <strong className="font-semibold text-fg">botkor</strong>
            {after}
          </p>

          <div className="hero-enter mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8" style={{ "--i": 1 } as React.CSSProperties}>
            <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "hero_primary" }} variant="brand">
              {hero.primaryCta}
            </TrackedLink>
            <TrackedLink href="#casos" event="cta_click" eventParams={{ location: "hero_portfolio" }} unstyled className="link-underline text-base text-fg">
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
            className="hero-enter mt-7 inline-flex items-center gap-2 text-sm font-semibold text-fg/80 transition-colors hover:text-fg"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <WhatsAppIcon className="size-[18px]" />
            ¿Prefieres hablar ya? Escríbenos por WhatsApp Business
          </TrackedLink>
        </div>

        <p
          className="hero-enter absolute right-[var(--gutter)] bottom-[clamp(8.5rem,19vh,12rem)] hidden border-l-2 border-current py-2 pl-5 text-lg leading-snug font-medium md:block lg:right-[8%]"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {tagA}.
          <br />
          {tagB}.
        </p>
      </div>

      {/* Panel superpuesto: mitad sobre la marca, mitad sobre la siguiente sección (blanca) */}
      <div className="relative bg-[linear-gradient(to_bottom,transparent_0,transparent_42%,var(--paper)_42%)]">
        <div className="container-wide">
          <div data-reveal="clip" className="surface-panel grid overflow-hidden rounded-[var(--radius-panel)] lg:grid-cols-[1.05fr_1fr]">
            <div className="p-3 sm:p-4">
              <HeroVisual />
            </div>
            <div className="flex flex-col justify-center gap-8 px-6 pt-4 pb-10 sm:px-10 lg:py-14 lg:pr-16 lg:pl-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {hero.proof.map((p, i) => (
                  <div key={p.label} data-reveal style={{ "--i": i } as React.CSSProperties}>
                    <dt className="sr-only">{p.label}</dt>
                    <dd>
                      <span className="t-metric block text-accent">{p.value}</span>
                      <span className="mt-2 block text-sm text-muted">{p.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <figure data-reveal style={{ "--i": 4 } as React.CSSProperties}>
                <blockquote className="t-quote text-fg">«{statement}»</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="block font-semibold">Equipo botkor</span>
                  <span className="text-muted">Ingeniería web, SEO + GEO y automatización</span>
                </figcaption>
              </figure>
              <div data-reveal style={{ "--i": 5 } as React.CSSProperties}>
                <TrackedLink href="#proceso" event="cta_click" eventParams={{ location: "hero_panel" }} variant="outline">
                  Ver cómo trabajamos
                </TrackedLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
