"use client";

import dynamic from "next/dynamic";

/**
 * Carga diferida del formulario (y de Zod) fuera de la ruta crítica de render:
 * el formulario está al final de la página, así que su JS no debe competir con el LCP.
 * No altera el formulario: mismo componente, mismos campos, misma validación y envío.
 * El placeholder reserva la altura para evitar saltos de diseño.
 */
const LeadForm = dynamic(() => import("./LeadForm").then((m) => m.LeadForm), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Cargando formulario de cotización" className="min-h-[38rem] animate-pulse rounded-[var(--radius-button)] bg-black/[0.03]" />
  ),
});

export function LeadFormLoader() {
  return <LeadForm />;
}
