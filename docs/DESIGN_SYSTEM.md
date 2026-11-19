# Sistema de diseño — BOTKOR

Todo el lenguaje visual se controla desde `src/styles/`. Los componentes no contienen colores, tipografías ni duraciones literales: usan tokens.

```
src/styles/
├─ design-tokens.css   ← colores, tipografía, geometría (EMPIEZA AQUÍ)
├─ surfaces.css        ← temas por sección (claro / negro / panel / marca)
├─ typography.css      ← clases de rol: .t-display-1, .t-title, .t-quote…
├─ motion.css          ← tokens y reglas de animación (ver ANIMATION_SYSTEM.md)
└─ components.css      ← .btn, .card-float, .row-list, .field, .link-underline
src/app/globals.css    ← importa todo y crea el puente con Tailwind (@theme inline)
src/app/layout.tsx     ← carga de fuentes (next/font)
```

## 1. Cambiar colores

Edita las primitivas en `design-tokens.css`. La paleta es la corporativa de BOTKOR:

| Color corporativo | Variable | Valor | Uso en la página |
|---|---|---|---|
| Azul Corporativo | `--ink`, `--black` | `#0B1020` | Texto principal, secciones oscuras, barra del header, botón oscuro |
| Azul Tecnológico | `--brand` | `#2563EB` | CTA principales, enlaces, iconos y acentos sobre claro, inicio del degradado de contacto |
| Morado Inteligente | `--violet` | `#7C3AED` | Etiquetas de IA/innovación (constelación) y final del degradado de marca |
| Cian Estratégico | `--cyan` | `#06B6D4` | Acentos sobre fondos oscuros: métricas, numeración, partículas de automatización, botón outline |
| Gris Balance | `--gray` | `#E5E7EB` | Líneas y separadores (`border-gray-balance`) |
| Blanco Inteligente | `--paper-muted` | `#FAFAFA` | Fondo claro alternativo (`bg-snow`) |

Derivados:

| Variable | Uso | Valor |
|---|---|---|
| `--brand-hover`, `--brand-ink` | Hover del azul y azul para texto pequeño sobre blanco (6,7:1) | `#1D4ED8` |
| `--brand-contrast` | Texto sobre azul | `#FFFFFF` |
| `--graphite`, `--graphite-2` | Paneles sobre azul corporativo (panel del hero, casos, FAQ) | `#131B33`, `#1A2440` |
| `--ink-muted`, `--smoke` | Texto secundario sobre claro y sobre oscuro | `#4B5563`, `#A3ABBD` |
| `--gradient-brand` | Degradado azul → morado ("Paleta en acción") | – |
| `--night`, `--night-glow` | Fondo del hero. **Fijos**, no dependen de la paleta | `#000515`, `#0A22D6` |

**Regla de contraste:** el Azul Tecnológico sobre Azul Corporativo solo llega a 3,7:1, así que no sirve para texto en fondos oscuros. Ahí los acentos usan cian (7,8:1). Sobre blanco, el azul (5,2:1) y el morado (5,7:1) cumplen AA.

**Logotipo:** `public/brand/botkor-logotipo.svg` (texto azul corporativo, para fondos claros) y `botkor-logotipo-blanco.svg` (fondos oscuros). Originales en `imagenes/`. El header superpone las dos versiones y las funde al pasar de transparente a sólido (`Logo tone="light" | "dark"` en `Header.tsx`); el footer usa la blanca. A las copias de `public/brand` se les añadió una fuente de respaldo para el texto "Growth Systems" (Poppins no se carga en la web).

El `themeColor` de `layout.tsx` y `opengraph-image.tsx` llevan los colores escritos a mano: si cambias la paleta, actualízalos también.

**Favicon:** `src/app/favicon.ico` (16, 32 y 48 px; Next.js lo enlaza solo). No añadas `src/app/icon.svg`: el navegador lo preferiría al `.ico`. `public/icon.svg` es el símbolo "B" recortado del logotipo y existe porque el JSON-LD (`Organization.logo`) apunta a `/icon.svg`.

### Superficies (temas por sección)

Cada sección declara una clase `surface-*`. Dentro, los componentes usan tokens semánticos que cambian solos:

| Clase | Fondo | `fg` | `muted` | `accent` |
|---|---|---|---|---|
| `surface-light` | blanco | azul corporativo | gris | `--brand-ink` |
| `surface-night` | `--night` + halos (hero) | blanco | blanco al 74 % | `--brand` |
| `surface-dark` | azul corporativo | blanco | `--smoke` | `--cyan` |
| `surface-panel` | `--graphite` | blanco | `--smoke` | `--cyan` |
| `surface-panel-2` | `--graphite-2` | blanco | gris azulado | `--cyan` |
| `surface-brand` | degradado azul → morado | blanco | blanco al 84 % | blanco |

En Tailwind: `text-fg`, `text-muted`, `text-accent`, `border-line`, `bg-card`, `text-danger` (semánticas), y `bg-brand`, `text-brand-cyan`, `text-brand-violet`, `text-ink`, `bg-paper`, `bg-graphite` (fijas).

**Fondo del hero:** superficie `.surface-night` (`--night: #000515`) con la capa `.hero-backdrop` (halos azules de `--night-glow: #0a22d6`, en `surfaces.css`), debajo del canvas de partículas. Para mover o intensificar los halos, edita los tres `radial-gradient` de `.hero-backdrop`.

`--particle-color` (en formato `r g b`) define el color de las partículas de cada superficie: blancas en el hero y cian en las secciones oscuras. `--particle-glow` define el núcleo cálido que aparece cuando se funden las esferas del hero (`255 204 0`).

## 2. Cambiar tipografías

1. En `src/app/layout.tsx`, reemplaza `Inter_Tight` y `Newsreader` por otras fuentes de `next/font/google` (o `next/font/local`) y **conserva los nombres de variable** `--font-inter-tight` y `--font-newsreader`, o cámbialos también en el paso 2.
2. En `design-tokens.css`: `--font-display-stack`, `--font-body-stack`, `--font-serif-stack`.
3. Pesos: `--weight-display` (500, igual que la referencia), `--weight-title`, `--weight-body`, `--weight-strong`.

### Escala tipográfica (fluida, de 390 a 1440 px)

| Token | Clase | Uso | Máximo |
|---|---|---|---|
| `--text-display-1` | `.t-display-1` | H1 | ~108 px |
| `--text-display-2` | `.t-display-2` | H2 editoriales | ~80 px |
| `--text-display-3` | `.t-display-3` | H2 en paneles, métricas | ~50 px |
| `--text-title` | `.t-title` | H3 de filas y tarjetas | ~22 px |
| `--text-lead` | `.t-lead` | Párrafos Answer-First | 20 px |
| `--text-quote` | `.t-quote` | Citas (serif) | 28 px |

También son tokens: `--leading-*` (altura de línea), `--tracking-*` (espaciado; el logo usa `--tracking-logo`).

## 3. Geometría

| Token | Valor | Uso |
|---|---|---|
| `--gutter` | 16–20 px | Margen lateral (20 px en la referencia) |
| `--container` | 1152 px | Contenido (`container-content`) |
| `--container-wide` | 1400 px | Header, paneles y footer (`container-wide`) |
| `--nav-height` | 85 px | Alto del header |
| `--section-y` / `--section-y-sm` | hasta 150 / 100 px | Padding vertical de sección |
| `--space-stack` | hasta 72 px | Separación entre encabezado y contenido |
| `--radius-panel`, `--radius-card` | 10 px | Paneles y tarjetas |
| `--radius-button`, `--radius-icon` | 6 / 4 px | Botones y caja de icono |
| `--row-border` | 2 px | Filetes de filas y del FAQ |

## 4. Componentes base

| Componente | Dónde | Notas |
|---|---|---|
| Botón `.btn` (+ `--brand`, `--light`, `--outline`, `--block`) | `components.css`, `ui/LinkButton.tsx`, `analytics/TrackedLink.tsx` | La caja del icono se expande en hover. Usa `<ButtonContent>` para el markup |
| `.link-underline` | `components.css` | Enlace con subrayado que se contrae en hover |
| `.card-float` | `components.css` | Tarjeta blanca con la sombra difusa de la referencia |
| `RowList` | `ui/RowList.tsx` | Filas [H3 \| texto \| índice/etiqueta/bullets] |
| `Section` + `SectionHeader` | `ui/Section.tsx` | Superficie, H2 con reveal por palabras y párrafo Answer-First |
| `.field`, `.field-label`, `.field-error` | `components.css` | Campos del formulario (solo presentación) |
| `IconBadge` | `ui/Icon.tsx` | Icono lineal en el color de acento de la superficie |
| `ParticleField` | `motion/ParticleField.tsx` | `nebula` (hero) / `embers` (secciones negras) |
