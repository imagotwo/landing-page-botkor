/**
 * Visual del panel superpuesto, 100 % HTML/CSS (sin imágenes): reemplaza a la
 * fotografía de la referencia con una "evidencia de ingeniería" propia de botkor.
 * Decorativo → aria-hidden. Colores desde tokens de superficie.
 */
const SCORES = [
  { label: "Rendimiento", value: 100 },
  { label: "Accesibilidad", value: 100 },
  { label: "Buenas prácticas", value: 100 },
  { label: "SEO", value: 100 },
];
const VITALS = [
  ["LCP", "1.2 s"],
  ["INP", "68 ms"],
  ["CLS", "0.00"],
];
const FLOW = ["Formulario", "n8n", "CRM", "WhatsApp"];

export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden rounded-[calc(var(--radius-panel)-4px)] bg-black">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-3 flex-1 truncate rounded bg-white/[0.06] px-3 py-1 text-[11px] text-white/50">https://tuempresa.com</span>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-wide text-white/50">Auditoría objetivo de entrega</p>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {SCORES.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                <div
                  className="flex size-14 items-center justify-center rounded-full sm:size-16"
                  style={{ background: `conic-gradient(var(--cyan) ${s.value * 3.6}deg, rgb(255 255 255 / 0.08) 0)` }}
                >
                  <span className="flex size-[calc(100%-8px)] items-center justify-center rounded-full bg-black text-sm font-semibold text-brand-cyan">
                    {s.value}
                  </span>
                </div>
                <span className="text-[10px] leading-tight text-white/55 sm:text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {VITALS.map(([k, v]) => (
            <div key={k} className="rounded-md border border-white/10 px-3 py-3">
              <p className="text-[10px] font-semibold text-white/50">{k}</p>
              <p className="mt-1 text-lg font-medium text-white tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-white/50">lead.created</p>
            <span className="rounded bg-brand-cyan px-2 py-0.5 text-[10px] font-semibold text-ink">200 OK</span>
          </div>
          <div className="mt-4 flex items-center gap-1">
            {FLOW.map((step, i) => (
              <div key={step} className="flex flex-1 items-center gap-1 last:flex-none">
                <span className="rounded bg-white/[0.07] px-2 py-1 text-[10px] text-white sm:text-[11px]">{step}</span>
                {i < FLOW.length - 1 ? <span className="h-px flex-1 bg-brand-cyan/60" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
