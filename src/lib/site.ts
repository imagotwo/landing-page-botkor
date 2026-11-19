/**
 * Configuración central del sitio. Única fuente de verdad para URLs, marca y contacto.
 * Lo usan los metadatos, el JSON-LD, el header, el footer y los CTAs.
 */

// Perfiles oficiales: refuerzan la entidad en Google y en IA (JSON-LD sameAs) y se enlazan en el footer.
const social = {
  instagram: "https://www.instagram.com/botkorx/",
  facebook: "https://www.facebook.com/botkorx/",
} as const;

export const siteConfig = {
  name: "botkor",
  legalName: "BOTKOR",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://botkor.com").replace(/\/$/, ""),
  landingPath: "/creacion-paginas-web-profesionales",
  email: "info@botkor.com",
  // Número comercial de WhatsApp Business. La variable de entorno puede sobrescribirlo.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573219610898",
  whatsappMessage:
    "Hola botkor, quiero cotizar una página web profesional para mi empresa. ¿Me pueden asesorar?",
  social,
  sameAs: Object.values(social) as string[],
  // Ubicación (JSON-LD PostalAddress y footer). Sin dirección exacta: solo ciudad.
  address: { locality: "Bogotá", region: "Bogotá D.C.", country: "CO", label: "Bogotá, Colombia" },
  areaServed: "Colombia",
} as const;

export const landingUrl = `${siteConfig.url}${siteConfig.landingPath}`;

export function whatsappHref(message: string = siteConfig.whatsappMessage): string {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}
