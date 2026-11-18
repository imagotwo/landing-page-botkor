/**
 * Visual del hero 100% HTML/CSS (sin imágenes): cero peso extra, nítido en cualquier pantalla
 * y no compite con el H1 por el LCP. Es decorativo, por eso aria-hidden.
 */
const SCORES = [
  { label: "Rendimiento", value: 100 },
  { label: "Accesibilidad", value: 100 },
  { label: "Buenas prácticas", value: 100 },
  { label: "SEO", value: 100 },
];

const FLOW = ["Formulario", "n8n", "CRM", "WhatsApp"];

export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(139_151_255/0.18),transparent)] blur-xl" />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-line-strong bg-surface/90 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-subtle">
            https://tuempresa.com
          </span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-subtle uppercase">Auditoría objetivo de entrega</p>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {SCORES.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                  <div
                    className="relative flex size-14 items-center justify-center rounded-full"
                    style={{ background: `conic-gradient(var(--color-accent) ${s.value * 3.6}deg, rgb(255 255 255 / 0.06) 0)` }}
                  >
                    <span className="flex size-[46px] items-center justify-center rounded-full bg-surface font-mono text-sm font-semibold text-accent">
                      {s.value}
                    </span>
                  </div>
                  <span className="text-[10px] leading-tight text-subtle">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["LCP", "1.2 s"],
              ["INP", "68 ms"],
              ["CLS", "0.00"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-bg/60 px-3 py-3">
                <p className="font-mono text-[10px] text-subtle">{k}</p>
                <p className="mt-1 font-mono text-base font-semibold text-fg">{v}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-line bg-bg/60 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] text-subtle">lead.created</p>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent">200 OK</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-1">
              {FLOW.map((step, i) => (
                <div key={step} className="flex flex-1 items-center gap-1 last:flex-none">
                  <span className="rounded-md border border-line-strong bg-surface-2 px-2 py-1 text-[10px] text-fg sm:text-[11px]">{step}</span>
                  {i < FLOW.length - 1 ? (
                    <span className="animate-flow h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
