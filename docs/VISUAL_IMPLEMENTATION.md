# Implementación del rediseño visual — BOTKOR

**Punto de restauración:** commit `89b6a60` (landing funcional previa). Para volver atrás: `git checkout 89b6a60 -- .`

## 1. Auditoría del proyecto (fase 2)

| Aspecto | Estado encontrado |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript strict |
| Estilos | Tailwind CSS 4 con tokens en `globals.css` |
| Componentes con lógica de negocio (**no tocados**) | `app/api/lead/route.ts`, `lib/lead-schema.ts`, `lib/site.ts`, `lib/analytics.ts`, `lib/rate-limit.ts`, `components/seo/JsonLdSchema.tsx`, `content/landing.ts`, `robots.ts`, `sitemap.ts`, `next.config.ts`, metadata de `page.tsx` |
| Componente mixto | `forms/LeadForm.tsx`: se cambiaron **solo** clases y markup de presentación; estado, validación, `fetch`, eventos, `name` e `id` quedaron intactos (revisado con `git diff`) |
| Animaciones previas | CSS `animation-timeline` + `.card-glow` (sustituidos) |

## 2. Archivos

**Nuevos**
- `src/styles/design-tokens.css`, `surfaces.css`, `typography.css`, `motion.css`, `components.css`: sistema de diseño.
- `src/components/motion/MotionRuntime.tsx`: motor de reveals, parallax y Lenis.
- `src/components/motion/SplitWords.tsx`: titulares divididos por palabras (Server Component).
- `src/components/motion/ParticleField.tsx`: partículas en canvas.
- `src/components/ui/RowList.tsx`: lista editorial en filas.
- `src/components/forms/LeadFormLoader.tsx`: carga diferida del formulario y de Zod.
- `scripts/visual/audit-reference.mjs`, `scripts/visual/check-site.mjs`: auditoría y validación con Chrome real.
- `docs/VISUAL_REFERENCE_AUDIT.md`, `DESIGN_SYSTEM.md`, `ANIMATION_SYSTEM.md` y este archivo.

**Modificados (solo presentación):** `app/globals.css`, `app/layout.tsx` (fuentes, script de arranque de movimiento, `MotionRuntime`, `themeColor`), `layout/Header.tsx`, `layout/Footer.tsx`, todas las secciones de `components/sections/*`, `ui/Container.tsx`, `ui/Section.tsx`, `ui/LinkButton.tsx`, `ui/Icon.tsx`, `analytics/TrackedLink.tsx`, `analytics/WhatsAppFloat.tsx`, `forms/LeadForm.tsx` (clases), `icon.svg` y `opengraph-image.tsx` (color de marca).

**Eliminados:** `ui/FeatureCard.tsx`, sustituido por `.card-float` y `RowList`.

**Dependencias añadidas:** `lenis` (runtime, cargado bajo demanda) y `playwright-core` (solo desarrollo, usa el Chrome instalado).

## 3. Decisiones de arquitectura

1. **Secciones como Server Components.** Solo son cliente `Header`, `MotionRuntime`, `ParticleField`, `TrackedLink`, `WhatsAppFloat` y `LeadForm`.
2. **Reveal sin riesgo para SEO ni accesibilidad.** Los estados ocultos dependen de `html.motion`; sin JS o con reduced-motion todo es visible desde el inicio.
3. **H1 animado solo con CSS**, y sin animación en móvil para proteger el LCP.
4. **Partículas en canvas** en lugar de vídeo: arrancan tras `load`, se pausan fuera de pantalla y bajan densidad y fps en móvil.
5. **Formulario diferido** (`next/dynamic`, `ssr:false`) con un placeholder de alto fijo: Zod sale de la ruta crítica.
6. **El orden de secciones y todos los textos comerciales se conservan.** Los textos nuevos son solo etiquetas de UI: CTAs secundarios ("Cotizar mi proyecto", "Ver cómo trabajamos", "Empezar mi diagnóstico", "Quiero un plan de soporte", "¿Otra pregunta? Escríbenos") y la firma "Equipo botkor" de la cita del panel, que reutiliza una frase existente de `whyBotkor.intro`.

## 4. Responsive

| Breakpoint | Cambios |
|---|---|
| < 768 px | H1 sin animación; parallax desactivado; partículas al ~30 fps y con menos densidad; menú a pantalla completa; filas apiladas; `--reveal-distance` de 28 px |
| 768–1023 px | Constelación y servicios en cuadrícula; menú a pantalla completa (barra negra oculta) |
| ≥ 1024 px | Barra de navegación negra; tarjetas de servicios escalonadas con parallax |
| ≥ 1280 px | Constelación dispersa con parallax en X/Y |

## 5. Pruebas realizadas (2026-11-18)

**Técnicas**
- `tsc --noEmit` sin errores.
- `next build` correcto; la landing sigue siendo estática (SSG, revalidación de 24 h).
- No hay linter configurado: Next 16 retiró `next lint` y el proyecto no tiene ESLint. Tampoco hay suite de tests previa.

**Visuales** (`scripts/visual/check-site.mjs` en Chrome real, a 1440, 1366, 768 y 390 px):
- Capturas de página completa, hero, cada sección, menú, formulario (vacío, con errores y enviado) y hover de botón.
- Sin desbordamiento horizontal en ningún ancho.
- Los 81 elementos animados terminan visibles.

**Funcionales**
- Header: se oculta al bajar (`-85px`) y vuelve con fondo blanco al subir.
- Menú: `aria-expanded` correcto; el foco va al primer enlace y vuelve al botón con Escape; el foco queda atrapado en el panel.
- Formulario vacío: 5 mensajes de error y foco en el primer campo.
- Envío real desde la interfaz → `/api/lead` 200 → webhook local que **verifica la firma HMAC: válida**, con email normalizado e idempotency key.
- Sin webhook configurado (producción): 503 y mensaje de error visible, igual que antes del rediseño.
- Reduced motion: 0 elementos ocultos, sin clase `motion`.
- Sin JavaScript: 0 elementos ocultos y las 4 respuestas del FAQ en el DOM.
- 0 errores de consola, 0 errores de página y 0 peticiones fallidas.

**SEO y seguridad (sin regresiones)**
- Las 34 etiquetas H1/H2/H3 coinciden exactamente con el brief; hay un solo H1.
- JSON-LD con Organization, WebPage, Service y FAQPage; sus respuestas de FAQ están presentes en el HTML visible.
- Canonical y title sin cambios.
- `robots.txt` con Googlebot, GPTBot, PerplexityBot y ClaudeBot.
- Las 7 cabeceras de seguridad presentes.
- `git diff 89b6a60` de API, `lib`, SEO, contenido, robots, sitemap, `next.config` y `page.tsx`: **sin cambios**.

## 6. Rendimiento (Lighthouse 12 en local, `next start`)

| Perfil | Performance | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Desktop, rediseño | **100** | **100** | **100** | **100** | 0.6 s | 0 ms | 0 |
| Móvil, rediseño (3 ejecuciones) | 90–96 | 100 | 100 | 100 | 2.3–2.8 s | 170–270 ms | 0 |
| Móvil, versión previa `89b6a60` (3 ejecuciones) | 88–95 | 100 | 100 | 100 | 2.8 s | 100–340 ms | 0 |

El perfil móvil es simulado (4G lenta + CPU 4× más lenta) y medido en localhost, así que el TTFB no refleja un CDN real. El rediseño **no empeora** la versión previa. El objetivo de LCP < 2,5 s se cumple en 1 de 3 ejecuciones móviles; el cuello de botella restante es la hidratación de React (`react-dom`, ~360 ms de script simulado), común a ambas versiones.

## 7. Pendientes

- **LCP móvil:** medirlo en producción (CDN real) con PageSpeed Insights o CrUX. Si sigue por encima de 2,5 s, hay dos opciones: reducir el JS del header (convertir la barra en Server Component y dejar cliente solo el botón de menú) o retrasar Lenis y el `MotionRuntime` hasta la primera interacción.
- **Probar en Safari/iOS y Firefox reales.** Las pruebas se hicieron en Chrome. El acordeón animado depende de `::details-content` (en los demás navegadores abre sin animación).
- ~~Validar el color de marca~~ → aplicada la paleta corporativa oficial (Azul Corporativo, Azul Tecnológico, Morado, Cian, Gris y Blanco). Ver `DESIGN_SYSTEM.md` §1.
- **Revisar los textos de UI nuevos** (sección 3.6) antes de publicar.
