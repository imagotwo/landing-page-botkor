import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const NAV = [
  { href: "#soluciones", label: "Soluciones" },
  { href: "#automatizacion", label: "Automatización" },
  { href: "#proceso", label: "Proceso" },
  { href: "#casos", label: "Casos" },
  { href: "#preguntas-frecuentes", label: "FAQ" },
];

/** Logotipo como enlace (nunca encabezado): regla de un único H1 por página. */
export function Logo() {
  return (
    <a href={siteConfig.landingPath} aria-label="botkor, ir al inicio" className="group inline-flex items-center gap-2.5">
      <span aria-hidden="true" className="relative inline-flex size-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
        <span className="font-mono text-sm font-bold">b/</span>
      </span>
      <span className="text-lg font-semibold tracking-tight text-fg">botkor</span>
    </a>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/55">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1" role="list">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <TrackedLink href="#cotizar" event="cta_click" eventParams={{ location: "header" }} variant="primary" className="h-10 px-4">
          Cotizar
        </TrackedLink>
      </Container>
    </header>
  );
}
