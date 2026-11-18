/**
 * Configuración central del sitio. Única fuente de verdad para URLs, marca y contacto.
 * Lo usan los metadatos, el JSON-LD, el header, el footer y los CTAs.
 */
export const siteConfig = {
  name: "botkor",
  legalName: "BOTKOR",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://botkor.com").replace(/\/$/, ""),
  landingPath: "/creacion-paginas-web-profesionales",
  email: "hola@botkor.com", // TODO(botkor): confirmar correo comercial
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage:
    "Hola botkor, quiero cotizar una página web profesional para mi empresa. ¿Me pueden asesorar?",
  sameAs: [
    // TODO(botkor): agregar perfiles oficiales (LinkedIn, Instagram, etc.) para reforzar la entidad en Google y en IA
  ] as string[],
  areaServed: "Latinoamérica",
} as const;

export const landingUrl = `${siteConfig.url}${siteConfig.landingPath}`;

export function whatsappHref(message: string = siteConfig.whatsappMessage): string {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}
