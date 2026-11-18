import { createHash, createHmac, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { contactKind, leadRequestSchema } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";
import { landingUrl, siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const MIN_FILL_TIME_MS = 2500;

type ApiResponse = { ok: true; leadId: string } | { ok: false; error: string; fields?: Record<string, string> };

function json(body: ApiResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Protección CSRF: solo se aceptan envíos desde el propio dominio. */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "Origen no permitido." }, 403);

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Formato no soportado." }, 415);
  }

  const ip = clientIp(req);
  const limit = rateLimit(`lead:${ip}`);
  if (!limit.ok) {
    return json(
      { ok: false, error: "Recibimos varias solicitudes seguidas. Intenta de nuevo en unos minutos o escríbenos por WhatsApp." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "Solicitud demasiado grande." }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  const parsed = leadRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    // Honeypot activado → respuesta de éxito falsa para no dar pistas al bot.
    if (fields.website) return json({ ok: true, leadId: randomUUID() });
    return json({ ok: false, error: "Revisa los campos marcados.", fields }, 422);
  }

  const lead = parsed.data;
  const elapsed = Date.now() - lead.startedAt;
  if (elapsed < MIN_FILL_TIME_MS || elapsed > 1000 * 60 * 60 * 24) {
    return json({ ok: true, leadId: randomUUID() }); // trampa de tiempo: descartado en silencio
  }

  const leadId = randomUUID();
  const kind = contactKind(lead.contact);

  /** Payload normalizado para n8n → CRM / WhatsApp Business / Meta CAPI / GA4 Measurement Protocol. */
  const event = {
    event: "lead.created",
    version: 1,
    leadId,
    eventId: lead.eventId,
    submittedAt: new Date().toISOString(),
    source: {
      site: siteConfig.name,
      page: landingUrl,
      referrer: req.headers.get("referer") ?? null,
      utm: lead.utm ?? {},
    },
    lead: {
      fullName: lead.fullName,
      company: lead.company,
      sector: lead.sector,
      webType: lead.webType,
      email: kind === "email" ? lead.contact.toLowerCase() : null,
      whatsapp: kind === "whatsapp" ? lead.contact.replace(/[^\d+]/g, "") : null,
      preferredChannel: kind,
    },
    meta: {
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      // IP con hash: útil para deduplicar sin almacenar el dato personal en claro.
      ipHash: createHash("sha256").update(ip).digest("hex"),
      fillTimeMs: elapsed,
    },
  };

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[lead] N8N_WEBHOOK_URL no configurado. Lead recibido (dev):", event);
      return json({ ok: true, leadId });
    }
    console.error("[lead] N8N_WEBHOOK_URL no configurado en producción.");
    return json({ ok: false, error: "No pudimos registrar tu solicitud. Escríbenos por WhatsApp." }, 503);
  }

  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = secret ? createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex") : "";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Botkor-Timestamp": timestamp,
        "X-Botkor-Signature": `sha256=${signature}`,
        "Idempotency-Key": leadId,
      },
      body,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
  } catch (error) {
    console.error("[lead] Error enviando al webhook:", error instanceof Error ? error.message : error);
    return json({ ok: false, error: "No pudimos registrar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp." }, 502);
  }

  return json({ ok: true, leadId });
}

export function GET() {
  return json({ ok: false, error: "Método no permitido." }, 405, { Allow: "POST" });
}
