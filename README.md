# botkor — Landing Pilar «Creación de páginas web profesionales»

Next.js 16 · React 19 · TypeScript strict · Tailwind CSS v4 · Zod

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # completa las variables
npm run dev                  # http://localhost:3000 → redirige a /creacion-paginas-web-profesionales
npm run build && npm start   # build de producción
```

## Dónde editar

| Qué | Archivo |
|---|---|
| Textos, FAQ y precios (también alimentan el JSON-LD) | `src/content/landing.ts` |
| Marca, correo, WhatsApp, redes (`sameAs`) | `src/lib/site.ts` |
| Colores, tipografía, geometría | `src/styles/design-tokens.css` (ver `docs/DESIGN_SYSTEM.md`) |
| Animaciones | `src/styles/motion.css` (ver `docs/ANIMATION_SYSTEM.md`) |
| Reglas del formulario | `src/lib/lead-schema.ts` |

## Variables de entorno

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp Business (solo dígitos, con código de país). Si falta, se usa el comercial `573219610898` definido en `lib/site.ts` |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Analítica (opcional) |
| `N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET` | Destino de los leads y secreto HMAC. **Obligatorio en producción:** sin él, la API responde 503 en lugar de perder leads |

## Antes de publicar (pendientes marcados con `TODO(botkor)`)

- [x] Precios «desde» en COP en `content/landing.ts`
- [x] Correo comercial (info@botkor.com), ubicación (Bogotá) y perfiles de Instagram y Facebook en `lib/site.ts`
- [ ] Revisar que las 4 preguntas frecuentes nuevas (edición, soporte, proceso, cobertura) describen el servicio real
- [ ] Validar el JSON-LD en https://search.google.com/test/rich-results
- [ ] Con varias instancias serverless, mover el rate limit a Redis/KV (ver `docs/ARCHITECTURE.md` §4)

## Validación visual

```bash
npm run build && npm start        # en otra terminal:
npm run visual:check              # capturas + pruebas funcionales en Chrome → visual-out/
```

Documentación: [ARCHITECTURE](docs/ARCHITECTURE.md) · [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) · [ANIMATION_SYSTEM](docs/ANIMATION_SYSTEM.md) · [VISUAL_IMPLEMENTATION](docs/VISUAL_IMPLEMENTATION.md) · [VISUAL_REFERENCE_AUDIT](docs/VISUAL_REFERENCE_AUDIT.md)
