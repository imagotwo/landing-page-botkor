"use client";

import { trackEvent } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Botón flotante de WhatsApp Business con mensaje predefinido y evento `contact` (GA4) / `Contact` (Meta). */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp (se abre en una nueva pestaña)"
      onClick={() => trackEvent("contact", { method: "whatsapp", location: "floating_button" })}
      className="wa-float"
    >
      <WhatsAppIcon className="size-8 sm:size-9" />
    </a>
  );
}
