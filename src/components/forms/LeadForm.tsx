"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { WhatsAppIcon } from "@/components/analytics/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/LinkButton";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { SECTORS, WEB_TYPES, leadFieldSchemas, type LeadField } from "@/lib/lead-schema";
import { whatsappHref } from "@/lib/site";

type Values = Record<LeadField, string>;
type Errors = Partial<Record<LeadField, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELDS: LeadField[] = ["fullName", "company", "sector", "contact", "webType"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
const INITIAL: Values = { fullName: "", company: "", sector: "", contact: "", webType: "" };

function validateField(field: LeadField, value: string): string | undefined {
  const result = leadFieldSchemas[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

function readUtm(): Record<string, string> | undefined {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) utm[key] = v.slice(0, key === "fbclid" ? 300 : key === "gclid" ? 200 : 100);
  }
  return Object.keys(utm).length ? utm : undefined;
}

export function LeadForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const startTracked = useRef(false);
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const id = (f: string) => `${uid}-${f}`;

  function update(field: LeadField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (!startTracked.current) {
      startTracked.current = true;
      trackEvent("form_start", { form_id: "cotizacion" });
    }
    // Validación en tiempo real solo después de que el usuario tocó el campo (evita errores prematuros).
    if (touched[field] || field === "sector" || field === "webType") {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  }

  function blur(field: LeadField) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Errors = {};
    for (const f of FIELDS) {
      const err = validateField(f, values[f]);
      if (err) nextErrors[f] = err;
    }
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));

    const firstInvalid = FIELDS.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError("");
    const eventId = crypto.randomUUID();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current, eventId, utm: readUtm() }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; leadId: string }
        | { ok: false; error: string; fields?: Partial<Record<LeadField, string>> }
        | null;

      if (!res.ok || !data?.ok) {
        if (data && !data.ok && data.fields) setErrors((prev) => ({ ...prev, ...data.fields }));
        setServerError(data && !data.ok ? data.error : "No pudimos enviar tu solicitud. Intenta de nuevo.");
        setStatus("error");
        return;
      }

      // Conversión: GA4 `generate_lead` + Meta `Lead` con el mismo eventId que recibe n8n (dedupe con Conversions API).
      trackEvent(
        "generate_lead",
        { form_id: "cotizacion", web_type: values.webType, sector: values.sector, currency: "USD", value: 1 },
        eventId,
      );
      setStatus("success");
    } catch {
      setServerError("Error de conexión. Revisa tu internet o escríbenos por WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const firstName = values.fullName.split(" ")[0] ?? "";
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-start gap-5 py-6 text-left">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="text-2xl font-semibold text-fg">¡Gracias, {firstName}! Recibimos tu solicitud.</p>
        <p className="text-muted">
          Un especialista de botkor revisará tu proyecto y te contactará en menos de 24 horas hábiles con una propuesta
          personalizada. Si prefieres adelantar la conversación, escríbenos ahora:
        </p>
        <a
          href={whatsappHref(`Hola botkor, soy ${values.fullName} de ${values.company}. Acabo de enviar el formulario de cotización.`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("contact", { method: "whatsapp", location: "form_success" })}
          className={buttonStyles("secondary")}
        >
          <WhatsAppIcon className="size-5 text-[#25D366]" />
          Continuar por WhatsApp
        </a>
      </div>
    );
  }

  const fieldClass = (f: LeadField) =>
    cn(
      "peer h-12 w-full rounded-xl border bg-bg/60 px-4 text-[15px] text-fg placeholder:text-subtle transition-colors duration-200",
      "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15",
      errors[f] ? "border-danger/70" : "border-line-strong hover:border-white/25",
    );

  const errorText = (f: LeadField) =>
    errors[f] ? (
      <p id={id(`${f}-error`)} className="mt-2 text-sm text-danger">
        {errors[f]}
      </p>
    ) : null;

  const aria = (f: LeadField) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? id(`${f}-error`) : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={id("form-note")} className="space-y-5">
      {/* Honeypot: fuera de pantalla y fuera del orden de tabulación. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>No completes este campo</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div>
        <label htmlFor={id("fullName")} className="mb-2 block text-sm font-medium text-fg">
          Nombre completo
        </label>
        <input
          id={id("fullName")}
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Ej. Laura Gómez"
          required
          maxLength={80}
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          onBlur={() => blur("fullName")}
          className={fieldClass("fullName")}
          {...aria("fullName")}
        />
        {errorText("fullName")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("company")} className="mb-2 block text-sm font-medium text-fg">
            Empresa
          </label>
          <input
            id={id("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Nombre de tu empresa"
            required
            maxLength={100}
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            onBlur={() => blur("company")}
            className={fieldClass("company")}
            {...aria("company")}
          />
          {errorText("company")}
        </div>
        <div>
          <label htmlFor={id("sector")} className="mb-2 block text-sm font-medium text-fg">
            Sector
          </label>
          <div className="relative">
            <select
              id={id("sector")}
              name="sector"
              required
              value={values.sector}
              onChange={(e) => update("sector", e.target.value)}
              onBlur={() => blur("sector")}
              className={cn(fieldClass("sector"), "appearance-none pr-10", !values.sector && "text-subtle")}
              {...aria("sector")}
            >
              <option value="" disabled>
                Selecciona tu sector
              </option>
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value} className="bg-surface text-fg">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" />
          </div>
          {errorText("sector")}
        </div>
      </div>

      <div>
        <label htmlFor={id("contact")} className="mb-2 block text-sm font-medium text-fg">
          WhatsApp o correo electrónico
        </label>
        <input
          id={id("contact")}
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="+57 300 000 0000 o tu@empresa.com"
          required
          maxLength={120}
          value={values.contact}
          onChange={(e) => update("contact", e.target.value)}
          onBlur={() => blur("contact")}
          className={fieldClass("contact")}
          {...aria("contact")}
        />
        {errorText("contact")}
      </div>

      <fieldset aria-describedby={errors.webType ? id("webType-error") : undefined}>
        <legend className="mb-3 text-sm font-medium text-fg">Tipo de web</legend>
        <div className="grid grid-cols-2 gap-3">
          {WEB_TYPES.map((t) => (
            <label
              key={t.value}
              className={cn(
                "relative flex h-12 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium transition-all duration-200",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                values.webType === t.value
                  ? "border-accent bg-accent/10 text-fg"
                  : errors.webType
                    ? "border-danger/60 text-muted hover:text-fg"
                    : "border-line-strong text-muted hover:border-white/25 hover:text-fg",
              )}
            >
              <input
                type="radio"
                name="webType"
                value={t.value}
                checked={values.webType === t.value}
                onChange={(e) => update("webType", e.target.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
        {errorText("webType")}
      </fieldset>

      <div aria-live="assertive" className="min-h-0">
        {status === "error" && serverError ? (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{serverError}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className={cn(buttonStyles("primary", "lg"), "w-full")}
      >
        {status === "submitting" ? (
          <>
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink" />
            Enviando solicitud…
          </>
        ) : (
          <>
            Solicitar mi cotización gratis
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p id={id("form-note")} className="text-center text-xs leading-relaxed text-subtle">
        Respuesta en menos de 24 h hábiles. Al enviar aceptas que botkor use tus datos solo para responder tu solicitud.
      </p>
    </form>
  );
}
