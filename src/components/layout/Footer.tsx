import { Container } from "@/components/ui/Container";
import { siteConfig, whatsappHref } from "@/lib/site";
import { Logo } from "./Header";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Agencia de diseño y desarrollo web profesional: sitios corporativos, e-commerce, landing pages y automatización de
            procesos para empresas de cualquier sector.
          </p>
        </div>
        <nav aria-label="Servicios">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Servicios</p>
          <ul className="mt-4 space-y-2.5 text-sm" role="list">
            <li><a className="text-muted hover:text-fg" href="#soluciones">Páginas web corporativas</a></li>
            <li><a className="text-muted hover:text-fg" href="#soluciones">Tiendas online</a></li>
            <li><a className="text-muted hover:text-fg" href="#soluciones">Landing pages</a></li>
            <li><a className="text-muted hover:text-fg" href="#automatizacion">Automatización e integraciones</a></li>
            <li><a className="text-muted hover:text-fg" href="#seguridad">Auditoría y seguridad web</a></li>
          </ul>
        </nav>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Contacto</p>
          <ul className="mt-4 space-y-2.5 text-sm" role="list">
            <li><a className="text-muted hover:text-fg" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
            <li><a className="text-muted hover:text-fg" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp Business</a></li>
            <li><a className="text-muted hover:text-fg" href="#cotizar">Solicitar cotización</a></li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-subtle sm:flex-row sm:justify-between">
        <p>© {year} {siteConfig.legalName}. Todos los derechos reservados.</p>
        <p>Desarrollado con Next.js · Rendimiento, accesibilidad y seguridad por diseño.</p>
      </Container>
    </footer>
  );
}
