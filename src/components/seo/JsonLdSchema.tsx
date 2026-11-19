import { faq, hero, pageDates, pricing, solutions } from "@/content/landing";
import { landingUrl, siteConfig } from "@/lib/site";

/**
 * JSON-LD con @graph: Organization + WebPage + Service + FAQPage.
 * Todo el texto se lee de `content/landing.ts`, así el marcado coincide EXACTAMENTE
 * con el contenido visible (requisito de Google para rich results y señal de confianza para IA).
 */
export function buildJsonLd() {
  const orgId = `${siteConfig.url}/#organization`;
  const priceNumber = (v: string) => v.replace(/[^\d]/g, "");
  // "COP $970.000" → COP; "USD 900" → USD
  const priceCurrency = (v: string) => /^[A-Z]{3}/.exec(v)?.[0] ?? "USD";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.svg` },
        email: siteConfig.email,
        ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.email,
          availableLanguage: ["es"],
          ...(siteConfig.whatsappNumber ? { telephone: `+${siteConfig.whatsappNumber.replace(/\D/g, "")}` } : {}),
        },
      },
      {
        "@type": "WebPage",
        "@id": `${landingUrl}#webpage`,
        url: landingUrl,
        name: hero.h1,
        description: hero.lead,
        datePublished: pageDates.published,
        dateModified: pageDates.modified,
        inLanguage: "es",
        isPartOf: { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name },
        about: { "@id": `${landingUrl}#service` },
        publisher: { "@id": orgId },
      },
      {
        "@type": "Service",
        "@id": `${landingUrl}#service`,
        name: "Creación de páginas web profesionales a medida",
        serviceType: "Diseño y desarrollo web",
        description: hero.lead,
        provider: { "@id": orgId },
        areaServed: siteConfig.areaServed,
        url: landingUrl,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: solutions.h2,
          itemListElement: solutions.items.map((item, i) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.title, description: item.description },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: priceCurrency([pricing.corporate, pricing.ecommerce, pricing.landing][i] ?? "USD"),
              minPrice: priceNumber([pricing.corporate, pricing.ecommerce, pricing.landing][i] ?? "0"),
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${landingUrl}#faq`,
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function JsonLdSchema() {
  // Escapa "<" para impedir que un contenido malicioso cierre el <script> (prevención XSS).
  const json = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
