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
      className="group fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-whatsapp p-3 text-[#062b14] shadow-[0_12px_32px_-10px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-1 sm:right-6 sm:bottom-6 sm:pr-4"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
