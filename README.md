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
| Colores y tipografía | `src/app/globals.css` (`@theme`) |
| Reglas del formulario | `src/lib/lead-schema.ts` |

## Variables de entorno

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp Business (solo dígitos, con código de país) |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Analítica (opcional) |
| `N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET` | Destino de los leads y secreto HMAC. **Obligatorio en producción:** sin él, la API responde 503 en lugar de perder leads |

## Antes de publicar (pendientes marcados con `TODO(botkor)`)

- [ ] Confirmar los precios «desde» en `content/landing.ts`
- [ ] Confirmar el correo comercial y añadir los perfiles sociales en `lib/site.ts`
- [ ] Verificar que las cifras de los casos de éxito están respaldadas por proyectos reales
- [ ] Validar el JSON-LD en https://search.google.com/test/rich-results
- [ ] Con varias instancias serverless, mover el rate limit a Redis/KV (ver `docs/ARCHITECTURE.md` §4)

La arquitectura completa está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
