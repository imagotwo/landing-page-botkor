/**
 * Envía un lead de prueba firmado al webhook de n8n, igual que lo hace /api/lead.
 * Sirve para probar el flujo de n8n sin llenar el formulario.
 *
 *   node --env-file=.env.local scripts/test-n8n-webhook.mjs          → lead válido (debe responder 200)
 *   node --env-file=.env.local scripts/test-n8n-webhook.mjs --mala   → firma incorrecta (debe responder 401)
 *
 * Usa N8N_WEBHOOK_URL y N8N_WEBHOOK_SECRET. Para la URL de prueba de n8n (/webhook-test/…)
 * pulsa antes "Listen for test event" en el nodo Webhook.
 */
import { createHash, createHmac, randomUUID } from "node:crypto";

const url = process.env.N8N_WEBHOOK_URL;
const secret = process.env.N8N_WEBHOOK_SECRET;
if (!url || !secret) {
  console.error("Faltan N8N_WEBHOOK_URL y/o N8N_WEBHOOK_SECRET (usa --env-file=.env.local).");
  process.exit(1);
}

const leadId = randomUUID();
const body = JSON.stringify({
  event: "lead.created",
  version: 1,
  leadId,
  eventId: randomUUID(),
  submittedAt: new Date().toISOString(),
  source: {
    site: "botkor",
    page: "https://botkor.com/creacion-paginas-web-profesionales",
    referrer: null,
    utm: { utm_source: "prueba", utm_campaign: "test-n8n" },
  },
  lead: {
    fullName: "Lead de Prueba",
    company: "Empresa Prueba S.A.S.",
    sector: "servicios",
    webType: "landing",
    email: null,
    whatsapp: "+573000000000",
    preferredChannel: "whatsapp",
  },
  meta: { userAgent: "test-n8n-webhook", ipHash: createHash("sha256").update("127.0.0.1").digest("hex"), fillTimeMs: 15000 },
});

const timestamp = Math.floor(Date.now() / 1000).toString();
const key = process.argv.includes("--mala") ? "secreto-equivocado" : secret;
const signature = createHmac("sha256", key).update(`${timestamp}.${body}`).digest("hex");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Botkor-Timestamp": timestamp,
    "X-Botkor-Signature": `sha256=${signature}`,
    "Idempotency-Key": leadId,
  },
  body,
  signal: AbortSignal.timeout(8000),
});

console.log(`HTTP ${res.status}`, await res.text());
process.exit(res.ok === !process.argv.includes("--mala") ? 0 : 1);
