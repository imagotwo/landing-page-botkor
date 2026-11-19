# Sistema de animaciones — BOTKOR

**Un solo motor, sin GSAP ni Framer Motion.** Se usan CSS para las transiciones, un componente cliente de ~2 KB (`MotionRuntime`) y Lenis cargado bajo demanda. Es el mismo enfoque que la referencia (transiciones CSS activadas por clase + scroll inercial), con menos peso.

## 1. Arquitectura

```
layout.tsx
 ├─ <script> MOTION_BOOT (inline, antes del primer pintado)
 │     añade html.motion solo si hay JS y no hay prefers-reduced-motion.
 │     Si el motor no arranca en 4 s, retira la clase → todo visible.
 └─ <MotionRuntime/> (client)
       1. [data-reveal]   → IntersectionObserver añade .is-inview (una vez)
       2. [data-live]     → alterna .is-live dentro/fuera de pantalla (pausa el marquee)
       3. [data-parallax] → rAF + scroll pasivo, solo elementos visibles, solo ≥ 768 px
       4. Lenis           → scroll inercial (solo puntero fino, sin reduced-motion, en idle)
ParticleField (client) → canvas 2D; arranca tras `load` + idle; se pausa fuera de pantalla o con la pestaña oculta
```

**Garantías:**
- **Sin JS:** `html.motion` nunca se activa y no hay nada oculto (verificado: 0 elementos invisibles).
- **Reduced motion:** sin clase `motion`, sin Lenis, sin parallax; el canvas dibuja un solo frame y la duración de todas las transiciones baja a 0,01 ms.
- **Animación:** solo `transform`, `opacity` y `clip-path`. El parallax usa la propiedad `translate`, independiente de `transform`, así que nunca choca con los reveals.

## 2. Tokens (`src/styles/motion.css`)

| Token | Valor | Origen |
|---|---|---|
| `--dur-fast` | 300 ms | Hover de botón (medido en la referencia) |
| `--dur-nav` | 500 ms | Header (medido) |
| `--dur-medium` | 500 ms | Filas (medido) |
| `--dur-slow` | 900 ms | Fade-up de bloques |
| `--dur-hero` | 900 ms | Palabras de los titulares |
| `--ease-out` | `cubic-bezier(.3,1,.7,1)` | Filas (medido) |
| `--ease-in-out` | `cubic-bezier(.86,0,.07,1)` | Titulares (medido) |
| `--ease-nav` | `cubic-bezier(.34,.7,.27,1)` | Header (medido) |
| `--reveal-distance` | 48 px (28 px en móvil) | Desplazamiento de entrada |
| `--row-scale` | 0.8 | Escala inicial de las filas (medido) |
| `--row-delay` | 150 ms | Retraso de las filas (referencia: 500 ms) |
| `--stagger` / `--word-stagger` | 80 / 45 ms | Escalonado entre hermanos y entre palabras |
| `--parallax-intensity` | 1 (0 en móvil) | Multiplicador global del parallax |

## 3. API de atributos (cómo animar un elemento nuevo)

| Atributo | Efecto |
|---|---|
| `data-reveal` | Fade-up |
| `data-reveal="fade"` | Solo opacidad |
| `data-reveal="row"` | Escala .8 → 1 + opacidad (filas) |
| `data-reveal="clip"` | Revelado con `clip-path` (paneles) |
| `data-reveal="words"` | Titular dividido con `<SplitWords text="…"/>`: cada palabra sube desde una máscara |
| `style={{"--i": n}}` | Índice de escalonado |
| `data-parallax="0.3"` | Velocidad vertical (negativa = sentido contrario) |
| `data-parallax-x="0.1"` | Velocidad horizontal |
| `data-parallax-from="1280"` | Ancho mínimo para activar el parallax |
| `data-live` | Añade `.is-live` mientras el elemento está en pantalla |

> **Regla:** no pongas `data-reveal` en el mismo elemento que tiene un `transform` de hover (por ejemplo `.card-float`). Envuélvelo en un `<div data-reveal>`.

## 4. Inventario implementado

| Animación | Implementación | Móvil |
|---|---|---|
| H1 por palabras | `.hero-title .split-w > span` + keyframes `word-rise` (CSS puro) | Sin animación (protege el LCP) |
| Lead, CTAs y lema del hero | `.hero-enter` con escalonado | Igual |
| H2 por palabras | `data-reveal="words"` | Igual |
| Fade-up de párrafos y tarjetas | `data-reveal` | Distancia de 28 px |
| Filas (scale .8) | `data-reveal="row"` | Igual |
| Paneles (clip-path) | `data-reveal="clip"` | Igual |
| Parallax de tarjetas (X/Y) | `data-parallax*` | Desactivado |
| Partículas del hero (coreografía de 12,28 s) | `ParticleField variant="nebula"` → `motion/nebula.ts` | 2 × 1000 partículas a ~30 fps |
| Brasas de secciones oscuras | `ParticleField variant="embers"` | 320 partículas a ~30 fps |
| Header ocultar/mostrar | `Header.tsx` (rAF + scroll pasivo) | Igual |
| Menú (velo, panel, ítems escalonados) | `.menu-enter`, `.menu-item` | Pantalla completa |
| Hover de botón (caja expandida + flecha) | `.btn__icon` | Solo `:active` |
| Hover de tarjetas | `.card-float:hover` (solo con `hover: hover`) | – |
| Marquee de integraciones | `.marquee-track` + `data-live` | Igual |
| Acordeón del FAQ | `details::details-content` + `interpolate-size` | Igual (Chrome 131+; en otros navegadores abre sin animar) |
| Scroll inercial | Lenis (`lerp: 0.11`, anclas con offset) | Nativo |

## 5. Ajustes rápidos

- **Hacerlo más sutil:** baja `--reveal-distance` y `--row-scale` → 0.92, y pon `--parallax-intensity: 0.5`.
- **Desactivar el parallax:** `--parallax-intensity: 0`.
- **Desactivar el scroll inercial:** en `MotionRuntime.tsx`, elimina el bloque 4 (Lenis).
- **Densidad de partículas:** `perSphere` y `m` en `build()` de `nebula.ts` (hero); `length` en `createEmbers()` de `ParticleField.tsx` (brasas).

## 6. Coreografía del hero (`nebula.ts`)

Recreación propia, en canvas, del vídeo de partículas de la referencia (no se usa el MP4: es un recurso de Talamus y pesa 15 MB). Se midió fotograma a fotograma y se repite en bucle cada 12,28 s:

| Tramo | Qué ocurre | Dónde se ajusta |
|---|---|---|
| 0–0,8 s | Fondo limpio | `fade` |
| 0,8–3,0 s | El polvo y luego las esferas llegan desde detrás de la cámara (bokeh → polvo fino) | `Z_STARS`, `Z_SPHERES` y las curvas de `Z` / `Zs` |
| 3–7 s | Dos esferas giran y flotan casi tocándose | `SEP_KEYS` (separación por fotogramas clave) |
| 7,3–10,8 s | Se solapan; la intersección se enciende con un núcleo cálido | `heat`, color `--particle-glow` |
| 10,8–12,1 s | Se funden, se expanden y atraviesan la cámara | `k` (expansión) y `Z_MAX` |

Encuadre por ancho en `frameFor()`: centro del par en el 73 % × 47 % del hero en escritorio. Con reduced-motion se dibuja un único fotograma fijo (t = 5,5 s). Coste medido en Chrome: unos 6 ms por fotograma a 1440 px y menos de 2 ms a 390 px.

## 7. Vitrina de dispositivos (#tecnologia)

`components/motion/DeviceShowcase.tsx` + `styles/showcase.css`. Bucle CSS de 24,4 s (`--sc-cycle`), sin JavaScript:

| Tramo | Escena |
|---|---|
| 0 – 10,6 s | Laptop: scroll continuo de 10 s por la web de Enfermeras Ángeles de Vida (del inicio a "Funciones", ≈ 515 px/s) |
| 10,6 – 12,2 s | Giro en Y de 1,6 s: sale la laptop y entran los celulares |
| 12,2 – 22,8 s | Tres celulares con la versión móvil; el central hace scroll continuo de 10 s (hasta "Funciones") |
| 22,8 – 24,4 s | Giro de 1,6 s de vuelta a la laptop |

- Capturas: `public/showcase/angeles-desktop.webp` (1440 px de ancho original, 465 KB) y `angeles-mobile.webp` (390 px, primeros 10 000 px, 388 KB). Carga diferida (`loading="lazy"`): no afecta al LCP.
- Las paradas de `@keyframes sc-scroll-laptop` y `sc-scroll-ph-center` marcan hasta qué sección llega el scroll (en % del alto de la captura). Si cambias la captura, recalcúlalo: `-(top de la sección / alto total) × 100 %`.
- La base de la laptop es un plano 3D real (`rotateX`) con perspectiva propia en `.lp`.
- Arranca al entrar en viewport (`.is-inview`); con reduced-motion queda fija la laptop. `aria-hidden` y `data-nosnippet`.
