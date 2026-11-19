# Arquitectura — Landing Pilar botkor

`botkor.com/creacion-paginas-web-profesionales`

## 1. Stack y principios

| Capa | Decisión | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 | RSC, SSG, Metadata API, rutas de API en el mismo despliegue |
| Lenguaje | TypeScript `strict` + `noUncheckedIndexedAccess` | Errores en build, no en producción |
| Estilos | Tailwind CSS v4 con tokens en `@theme` (`globals.css`) | Sistema de diseño sin JS en runtime |
| Validación | Zod, un esquema compartido cliente/servidor | Una sola fuente de verdad para las reglas del formulario |
| Iconos | `lucide-react` (tree-shaken, se renderizan en servidor) | 0 KB de JS extra en el cliente |
| Fuentes | `next/font` (Geist), autoalojadas | Sin peticiones a Google Fonts, CLS = 0 |

**Principios:** 1) todo el texto se renderiza en servidor; 2) el contenido vive en un único archivo tipado; 3) el JS del cliente se limita a islas de interacción; 4) la analítica nunca bloquea ni rompe la conversión.

## 2. Estructura de carpetas

```
src/
├─ app/
│  ├─ layout.tsx                     # <html lang="es">, fuentes, skip-link, scripts de analítica
│  ├─ globals.css                    # Importa src/styles/* y puentea tokens ⇄ Tailwind
│  ├─ robots.ts                      # Permite Googlebot, GPTBot, PerplexityBot, ClaudeBot…
│  ├─ sitemap.ts
│  ├─ favicon.ico                    # Favicon (16/32/48 px). El logo del JSON-LD está en public/icon.svg
│  ├─ not-found.tsx
│  ├─ api/lead/route.ts              # POST: seguridad, validación y reenvío a n8n
│  └─ creacion-paginas-web-profesionales/
│     ├─ page.tsx                    # Metadata + composición de secciones (SSG, revalidate 24 h)
│     └─ opengraph-image.tsx         # Imagen OG generada en build
├─ styles/                          # Sistema de diseño: tokens, superficies, tipografía, motion, componentes
├─ content/landing.ts                # TODO el copy: secciones, FAQ, precios (fuente del JSON-LD)
├─ components/
│  ├─ ui/                            # Átomos: Container, Section, LinkButton, FeatureCard, Icon
│  ├─ layout/                        # Header (logo = enlace, no heading), Footer
│  ├─ sections/                      # Las 12 secciones (Server Components)
│  ├─ forms/LeadForm.tsx             # 'use client' (cargado en diferido vía LeadFormLoader)
│  ├─ motion/                        # MotionRuntime, SplitWords, ParticleField
│  ├─ analytics/                     # TrackedLink, WhatsAppFloat ('use client'), AnalyticsScripts
│  └─ seo/JsonLdSchema.tsx           # Organization + WebPage + Service + FAQPage
└─ lib/
   ├─ site.ts                        # URL, marca, WhatsApp
   ├─ lead-schema.ts                 # Zod + sanitización (cliente y servidor)
   ├─ analytics.ts                   # trackEvent → gtag/dataLayer + fbq
   ├─ rate-limit.ts
   └─ cn.ts
```

## 3. Server vs. Client Components

| Componente | Tipo | Justificación |
|---|---|---|
| Todas las secciones, Header, Footer, JSON-LD | **Server** | El HTML inicial contiene el 100 % del texto SEO/GEO |
| FAQ | **Server** (`<details>/<summary>` nativo) | Acordeón accesible sin JS; las respuestas están en el DOM aunque estén cerradas |
| Animaciones | CSS + `MotionRuntime` (client, ~2 KB) + Lenis diferido | Ver docs/ANIMATION_SYSTEM.md. Sin JS todo el contenido es visible |
| `LeadForm` | Client | Estado, validación en tiempo real, `fetch` |
| `TrackedLink`, `WhatsAppFloat` | Client (islas mínimas) | Solo `onClick` → evento analítico |

La página se genera de forma estática en el build (`force-static`, `revalidate: 86400`) y se sirve desde CDN.

## 4. Seguridad (OWASP)

**Cabeceras** (`next.config.ts`, todas las rutas): CSP restrictiva, HSTS con preload, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP, y `X-Powered-By` desactivado.

> **Decisión sobre la CSP:** `script-src` incluye `'unsafe-inline'` porque los scripts de hidratación de Next.js son inline. Un CSP con nonce obliga a renderizar en cada request (sin SSG/CDN), lo que empeora TTFB y LCP. El riesgo se mitiga porque no hay contenido generado por usuarios en la página y solo se permiten los orígenes de GA4 y Meta.

**Endpoint `/api/lead`, en orden:**
1. **CSRF:** la cabecera `Origin` debe coincidir con el host (403 si no).
2. Solo acepta `Content-Type: application/json` (415).
3. **Rate limit:** 5 envíos cada 10 min por IP (429 + `Retry-After`).
4. Tamaño máximo del cuerpo: 8 KB (413).
5. **Zod `.strict()`:** rechaza campos desconocidos (protege contra mass assignment). Antes de validar se sanitiza el texto: caracteres de control, ancho cero, bidi y `< >`.
6. **Honeypot** (`website`) y **trampa de tiempo** (menos de 2,5 s desde que se mostró el formulario): el servidor responde un éxito falso para no dar pistas al bot.
7. **Webhook firmado:** `X-Botkor-Signature: sha256=HMAC(secret, timestamp + "." + body)`, más `X-Botkor-Timestamp` e `Idempotency-Key`. Timeout de 8 s.
8. Los errores nunca exponen detalles internos. La IP solo viaja como hash SHA-256.

**Para producción a escala:**
- `rate-limit.ts` guarda los contadores en memoria, por instancia. Con varias instancias serverless, reemplázalo por Upstash Redis o Vercel KV; la interfaz no cambia.
- `x-forwarded-for` solo es confiable detrás de un proxy propio o una plataforma como Vercel o Cloudflare.
- Opcional: añadir Cloudflare Turnstile si aparece spam humano.

## 5. Flujo de datos de un lead

```
Usuario ─▶ LeadForm (Zod en cliente, eventId = UUID, UTMs/gclid/fbclid)
        ─▶ POST /api/lead (Origin, rate limit, Zod, honeypot, tiempo)
        ─▶ n8n Webhook (firma HMAC)
              ├─ verificar firma y descartar si el timestamp tiene más de 5 min
              ├─ CRM (HubSpot / Pipedrive / Zoho…): crear contacto + negocio
              ├─ WhatsApp Business Cloud API: plantilla de bienvenida (si preferredChannel = whatsapp)
              ├─ Email / Slack: aviso al equipo comercial
              ├─ Meta Conversions API: evento Lead con event_id = eventId  ◀─┐ deduplicación
              └─ GA4 Measurement Protocol (opcional)                         │
        ◀─ { ok: true }                                                      │
LeadForm ─▶ trackEvent('generate_lead') → gtag + fbq('track','Lead',{eventID}) ┘
```

**Payload enviado a n8n (`version: 1`):**
```json
{
  "event": "lead.created", "version": 1, "leadId": "uuid", "eventId": "uuid",
  "submittedAt": "ISO-8601",
  "source": { "site": "botkor", "page": "https://botkor.com/creacion-paginas-web-profesionales", "referrer": "…", "utm": {} },
  "lead": { "fullName": "…", "company": "…", "sector": "salud", "webType": "landing",
            "email": "…|null", "whatsapp": "+57…|null", "preferredChannel": "email|whatsapp" },
  "meta": { "userAgent": "…", "ipHash": "sha256", "fillTimeMs": 12345 }
}
```

**Verificación de la firma en n8n** (nodo Code):
```js
const crypto = require('crypto');
const ts = $json.headers['x-botkor-timestamp'];
const expected = 'sha256=' + crypto.createHmac('sha256', $env.BOTKOR_SECRET)
  .update(ts + '.' + JSON.stringify($json.body)).digest('hex');
if (expected !== $json.headers['x-botkor-signature'] || Date.now()/1000 - Number(ts) > 300) throw new Error('Firma inválida');
```
*(Activa "Raw Body" en el nodo Webhook para firmar exactamente los mismos bytes.)*

**Flujo listo para importar (Google Sheets + correo):** [`docs/n8n/`](n8n/README.md), con la guía paso a paso. Para probarlo sin el formulario: `node --env-file=.env.local scripts/test-n8n-webhook.mjs`.

## 6. Eventos analíticos

| Evento (GA4) | Meta | Dónde se dispara |
|---|---|---|
| `cta_click` (`location`) | `trackCustom` | Header, CTAs del hero |
| `contact` (`method: whatsapp`) | `Contact` | Botón flotante, hero, pantalla de éxito |
| `form_start` | `trackCustom` | Primera interacción con el formulario |
| `generate_lead` (`web_type`, `sector`) | `Lead` + `eventID` | Envío confirmado por el servidor |

Los scripts de GA4 y del Pixel solo se cargan si existe la variable de entorno correspondiente, y lo hacen con `lazyOnload`, fuera de la ruta crítica. Si usas un banner de cookies, cambia el `consent default` en `AnalyticsScripts.tsx` a `denied`.

## 7. SEO / GEO

- Un único `<h1>`; la jerarquía H2/H3 es exactamente la del brief. Los títulos de tarjeta de las secciones 6, 8 y 9 son `<p>` para no alterarla.
- Párrafos *Answer-First* de 40–60 palabras bajo cada H2 y en cada respuesta de la FAQ.
- El JSON-LD (`@graph`) se genera desde `content/landing.ts`, así coincide palabra por palabra con lo visible. Se escapa `<` para evitar XSS.
- `robots.ts` permite explícitamente Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended y Applebot.
- Metadata: canonical, Open Graph con imagen generada, Twitter card, `max-snippet: -1`.
