import type { Metadata } from "next";
import { WhatsAppFloat } from "@/components/analytics/WhatsAppFloat";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Cases } from "@/components/sections/Cases";
import { ContactSection } from "@/components/sections/ContactSection";
import { Faq } from "@/components/sections/Faq";
import { Automation, Management, Solutions, TechPillars, WhyBotkor } from "@/components/sections/FeatureSections";
import { Hero } from "@/components/sections/Hero";
import { Innovation } from "@/components/sections/Innovation";
import { Process } from "@/components/sections/Process";
import { Sectors } from "@/components/sections/Sectors";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { pageDates } from "@/content/landing";
import { landingUrl, siteConfig } from "@/lib/site";

const title = "Creación de Páginas Web Profesionales a Medida";
const description =
  "Diseño y desarrollo de páginas web profesionales, tiendas online y landing pages que cargan en menos de 2 s, con SEO + GEO y automatizaciones. Entrega en 1 a 3 semanas.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteConfig.landingPath },
  keywords: [
    "creación de páginas web profesionales",
    "diseño de páginas web para empresas",
    "desarrollo web a medida",
    "agencia de desarrollo web",
    "tiendas online e-commerce",
    "landing pages de alta conversión",
    "SEO y GEO",
  ],
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: landingUrl,
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

// SSG: HTML completo generado en build y servido desde CDN (TTFB mínimo). Revalida cada 24 h.
export const dynamic = "force-static";
export const revalidate = 86400;

export default function LandingPage() {
  return (
    <>
      {/* Fechas de publicación/actualización (frescura para buscadores e IA). React 19 las sube al <head>;
          se declaran aquí porque metadata.other genera name= y Open Graph exige property= */}
      <meta property="article:published_time" content={pageDates.published} />
      <meta property="article:modified_time" content={pageDates.modified} />
      <Header />
      <main id="contenido">
        <Hero />
        <Solutions />
        <Automation />
        <TechPillars />
        <Management />
        <Innovation />
        <WhyBotkor />
        <Sectors />
        <Process />
        <Cases />
        <Faq />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      {/* JSON-LD al final: mismo contenido, pero así el texto del hero (respuesta directa) es lo
          primero que leen los analizadores que recorren el HTML en orden */}
      <JsonLdSchema />
    </>
  );
}
