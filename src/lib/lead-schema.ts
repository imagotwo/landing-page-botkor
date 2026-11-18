import { z } from "zod";

/**
 * Esquema compartido cliente/servidor del formulario de cotización.
 * El cliente lo usa para validación en tiempo real; el servidor lo vuelve a aplicar
 * (nunca se confía en la validación del navegador).
 */

export const WEB_TYPES = [
  { value: "corporativa", label: "Corporativa" },
  { value: "ecommerce", label: "Tienda Online" },
  { value: "landing", label: "Landing Page" },
  { value: "a-medida", label: "A medida" },
] as const;

export const SECTORS = [
  { value: "salud", label: "Salud y Bienestar" },
  { value: "comercio", label: "Comercio y Retail" },
  { value: "industria", label: "Industria, Logística e Inmobiliaria" },
  { value: "educacion-tech", label: "Educación, Tecnología y Startups" },
  { value: "servicios", label: "Servicios profesionales" },
  { value: "otro", label: "Otro sector" },
] as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];
const webTypeValues = WEB_TYPES.map((t) => t.value) as [Values<typeof WEB_TYPES>, ...Values<typeof WEB_TYPES>[]];
const sectorValues = SECTORS.map((s) => s.value) as [Values<typeof SECTORS>, ...Values<typeof SECTORS>[]];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/;

/**
 * Caracteres invisibles o de control que se eliminan: C0/C1, espacios de ancho cero
 * y marcas de dirección bidi (usadas en ataques de suplantación de texto).
 * Se filtra por código numérico en lugar de regex: algunos bundlers convierten
 * U+2028 en un salto de línea literal dentro del regex y rompen el build.
 */
function isUnsafeCodePoint(cp: number): boolean {
  return (
    cp <= 0x1f ||
    (cp >= 0x7f && cp <= 0x9f) ||
    (cp >= 0x200b && cp <= 0x200f) ||
    (cp >= 0x2028 && cp <= 0x202e) ||
    (cp >= 0x2066 && cp <= 0x2069) ||
    cp === 0xfeff
  );
}

/** Elimina caracteres de control, quita < > y colapsa espacios. Se aplica antes de validar. */
export function sanitizeText(value: string): string {
  let out = "";
  for (const ch of value.normalize("NFC")) {
    const cp = ch.codePointAt(0) ?? 0;
    out += isUnsafeCodePoint(cp) ? " " : ch;
  }
  return out.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

const text = (min: number, max: number, minMsg: string) =>
  z
    .string({ required_error: minMsg })
    .transform(sanitizeText)
    .pipe(z.string().min(min, minMsg).max(max, `Máximo ${max} caracteres.`));

export const leadFieldSchemas = {
  fullName: text(3, 80, "Escribe tu nombre y apellido.").refine((v) => /^[\p{L}\s'.-]+$/u.test(v), {
    message: "Usa solo letras y espacios.",
  }),
  company: text(2, 100, "Indica el nombre de tu empresa o proyecto."),
  sector: z.enum(sectorValues, { errorMap: () => ({ message: "Selecciona el sector de tu empresa." }) }),
  contact: text(6, 120, "Déjanos tu WhatsApp o correo electrónico.").refine(
    (v) => EMAIL_RE.test(v) || (PHONE_RE.test(v) && v.replace(/\D/g, "").length >= 8),
    { message: "Ingresa un correo válido o un WhatsApp con código de país (ej. +57 300 000 0000)." },
  ),
  webType: z.enum(webTypeValues, { errorMap: () => ({ message: "Elige el tipo de web que necesitas." }) }),
} as const;

export type LeadField = keyof typeof leadFieldSchemas;

const utmSchema = z
  .object({
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(100).optional(),
    utm_term: z.string().max(100).optional(),
    utm_content: z.string().max(100).optional(),
    gclid: z.string().max(200).optional(),
    fbclid: z.string().max(300).optional(),
  })
  .strict();

export const leadRequestSchema = z
  .object({
    ...leadFieldSchemas,
    /** Honeypot: campo invisible para humanos. Si llega con valor, es un bot. */
    website: z.string().max(0).optional().default(""),
    /** Marca de tiempo (ms) de cuando se mostró el formulario: detecta envíos automatizados instantáneos. */
    startedAt: z.number().int().positive(),
    /** ID único del evento para deduplicar Meta Pixel + Conversions API y GA4. */
    eventId: z.string().uuid(),
    utm: utmSchema.optional(),
  })
  .strict();

export type LeadRequest = z.infer<typeof leadRequestSchema>;
export type LeadFormValues = Pick<LeadRequest, LeadField>;

export function contactKind(contact: string): "email" | "whatsapp" {
  return EMAIL_RE.test(contact) ? "email" : "whatsapp";
}
