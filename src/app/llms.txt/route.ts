import { faq, hero, pageDates, processSection, solutions } from "@/content/landing";
import { landingUrl, siteConfig } from "@/lib/site";

/**
 * /llms.txt: resumen en Markdown para asistentes de IA (ChatGPT, Claude, Perplexity…).
 * Se genera desde content/landing.ts, así siempre coincide con lo que dice la página.
 */
export const dynamic = "force-static";

export function GET() {
  const phone = siteConfig.whatsappNumber.replace(/\D/g, "");
  const body = [
    `# ${siteConfig.legalName}`,
    "",
    `> ${hero.lead}`,
    "",
    `Página principal: [${hero.h1}](${landingUrl})`,
    `Última actualización: ${pageDates.modified}`,
    "",
    `## ${solutions.h2}`,
    "",
    ...solutions.items.map((s) => `- **${s.title}** (${s.tag}): ${s.description}`),
    "",
    `## ${processSection.h2}`,
    "",
    ...processSection.steps.map((s, i) => `${i + 1}. **${s.title}** (${s.time}): ${s.description}`),
    "",
    "## Preguntas frecuentes",
    "",
    ...faq.items.flatMap((q) => [`### ${q.question}`, "", q.answer, ""]),
    "## Contacto",
    "",
    `- Cotización: [formulario](${landingUrl}#cotizar)`,
    `- WhatsApp: +${phone} (https://wa.me/${phone})`,
    `- Correo: ${siteConfig.email}`,
    `- Ubicación: ${siteConfig.address.label}`,
    `- Zona de servicio: Bogotá y toda ${siteConfig.areaServed}`,
    `- Instagram: ${siteConfig.social.instagram}`,
    `- Facebook: ${siteConfig.social.facebook}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
