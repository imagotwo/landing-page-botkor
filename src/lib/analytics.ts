/**
 * Capa de eventos unificada (cliente). Envía a GA4 (gtag / dataLayer) y Meta Pixel
 * solo si están cargados. Nunca lanza errores: la analítica jamás debe romper la conversión.
 */
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Mapeo de eventos GA4 recomendados → eventos estándar de Meta. */
const META_EVENT: Record<string, string | undefined> = {
  generate_lead: "Lead",
  contact: "Contact",
};

export function trackEvent(name: string, params: EventParams = {}, eventId?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    } else {
      (window.dataLayer ??= []).push({ event: name, ...params });
    }

    const metaEvent = META_EVENT[name];
    if (typeof window.fbq === "function") {
      if (metaEvent) {
        window.fbq("track", metaEvent, params, eventId ? { eventID: eventId } : undefined);
      } else {
        window.fbq("trackCustom", name, params);
      }
    }
  } catch {
    /* silencioso a propósito */
  }
}
