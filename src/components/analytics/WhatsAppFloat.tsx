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
      className="group fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-[#062b14] shadow-[0_10px_40px_-8px_rgb(37_211_102/0.7)] transition-transform duration-300 hover:scale-105 sm:right-6 sm:bottom-6 sm:pr-5"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
