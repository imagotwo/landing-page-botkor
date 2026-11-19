# Auditoría visual de la referencia — talamus.pro

Fecha: 2026-11-18 · Método: Chrome real automatizado (`scripts/visual/audit-reference.mjs`, playwright-core + Chrome instalado) en 1920×1080, 1440×900, 1366×768, 768×1024, 430×932 y 390×844. Se midieron estilos computados, transformaciones durante el scroll, estados de hover y comportamiento del header y del menú.

> Los valores marcados **(medido)** salen del navegador. Los marcados **(hipótesis)** se infieren de capturas o nombres de clase y no se verificaron cuadro a cuadro.

## 1. Stack técnico de la referencia

| Aspecto | Hallazgo |
|---|---|
| CMS | WordPress 7.1 con tema propio, bundle `main.js` y jQuery 3.6 **(medido)** |
| Scroll | Locomotive Scroll: contenedor `[data-scroll-container]` **(medido)** |
| Animación | **No expone GSAP ni ScrollTrigger.** Transiciones CSS activadas por clase (`--tadam`, in-view) y Splitting.js para el H1 (`.words .chars .splitting`) **(medido)** |
| Partículas | Dos vídeos MP4 en bucle (`TALAMUS-BlancOrange.mp4` y `TALAMUS-OrangeNoir.mp4`), no WebGL **(medido)** |
| Tipografía | Adobe Fonts: **Halyard Display** 400/500/700 y **Presti Text** 400, una serif para citas **(medido)** |
| Keyframes CSS | `load-transition`, `open-transition`, `float`, `wave-animation`, `marquee` **(medido)** |

## 2. Estructura visual (1440 px)

| # | Sección (clase) | Fondo | Alto | Composición |
|---|---|---|---|---|
| 1 | `home-head` | Naranja `#FE4100` con vídeo de partículas blancas | 900 px (100 vh) | H1 de 130/124 px y peso 500 a la izquierda (x = 138). CTA negro con caja de icono. Lema abajo a la derecha con filete vertical de 2 px |
| 2 | `module-content-image` | Panel `#1C1C1C`, radio 10 px | ~505 px | Panel de 1400 px (margen de 20 px) **superpuesto al borde inferior del hero**: foto en blanco y negro a la izquierda; a la derecha, etiqueta naranja, botón con contorno y cita en serif |
| 3 | `home-plateforme` | Blanco | 1573 px, padding 100 | H2 de 88/94 px centrado, párrafo centrado y CTA naranja. **Constelación de 6 tarjetas** blancas de 300×300 px, radio 10 y sombra `0 0 37px 16px rgba(216,216,216,.56)`, dispersas con parallax en X/Y |
| 4 | `home-accompagnement` | Negro | 1323 px, padding 150 | H2 blanco gigante con vídeo de partículas naranjas a la derecha. **Lista en filas**: borde superior de 2 px blanco, padding 30 px, columnas [título \| descripción \| "En savoir plus +"] |
| 5 | `module-cta` | Negro con cúmulo de brasas naranjas | 1100 px | Titular y CTA alineados a la derecha sobre la nube de partículas |
| 6 | `module-faq` | Panel `#333` redondeado sobre negro | 462 px | Titular y CTA a la izquierda; a la derecha, acordeón con filetes blancos de 2 px |
| 7 | `footer` | Negro | 605 px | Wordmark gigante, lema a la derecha, filas con divisores |

**Geometría (medido):** header de 85 px; contenedor del header de 1400 px con margen de 20 px; contenido a 1152 px (80 %) con margen de 144 px; radio de 10 px en paneles y tarjetas; radio de 6 px en botones.

**Tipografía (medido):** H1 de 130/124 px; H2 de 88/94 px; H3 editorial de 50/48 px; todo en peso 500 con espaciado normal; cuerpo de 16/20 px en peso 500.

## 3. Navegación

- **Desktop (medido):** `position: fixed`, transparente sobre el hero. Al bajar, `header--hide` con `translateY(-85px)`; al subir, `header--small` con fondo blanco. Transición de `0.5s cubic-bezier(.34,.7,.27,1)`.
- **Barra:** bloque negro de esquinas redondeadas alineado a la derecha, con enlaces blancos, un botón blanco interno y el icono de hamburguesa.
- **Menú desktop (captura):** tarjeta blanca bajo la barra, alineada a la derecha, con los enlaces centrados. Un velo oscuro de aproximadamente el 60 % cubre la página y la X sustituye a la hamburguesa.
- **Menú móvil (captura):** panel blanco a pantalla completa, filas con divisor y flecha a la derecha, y botón de cierre en un cuadrado negro.

## 4. Inventario de animaciones

| # | Elemento | Movimiento | Duración / curva | Retraso | Disparador | Móvil | Fuente |
|---|---|---|---|---|---|---|---|
| A1 | Cortina de carga `.transition--load` | Overlay negro que se retira | 1.2 s `cubic-bezier(.3,.86,.36,.95)` | 0 | Carga de la página | Igual | medido |
| A2 | Letras del H1 (`.char`) | `translateY(~1.24em)` → 0, por carácter y escalonado | 0.7 s `cubic-bezier(.86,0,.07,1)` | ~3 s (tras A1) | Clase `--tadam` | Igual | medido |
| A3 | Párrafos | Fade-up de ~47 px | ~0.9 s | – | Entrada en viewport | Igual | medido (muestra intermedia) |
| A4 | Tarjetas de la constelación | Parallax en X/Y a distinta velocidad (p. ej. `translate(20px,-150px)`) | Ligado al scroll | – | Scroll | Cuadrícula de 2 columnas, sin dispersión | medido |
| A5 | Filas de lista | `scale(.8)` y opacidad 0 → 1 | 0.5 s `cubic-bezier(.3,1,.7,1)` | 0.5 s | Entrada en viewport | Igual | medido |
| A6 | Botón | Caja blanca del icono que se expande al 100 % y flecha que pasa de ↗ a → | 0.3 s | – | Hover | Sin hover | medido + captura |
| A7 | Header | Ocultar y mostrar | 0.5 s `cubic-bezier(.34,.7,.27,1)` | – | Dirección del scroll | Igual | medido |
| A8 | Partículas | Vídeo en bucle | – | – | Autoplay | Igual | medido |
| A9 | Menú | Velo y aparición del panel | ~0.3 s | – | Clic | Pantalla completa | hipótesis |
| A10 | `float`, `wave-animation`, `marquee` | Existen como keyframes | – | – | – | – | hipótesis de uso |
| A11 | Scroll suave | Inercia de Locomotive | – | – | Rueda | Nativo | medido |

## 5. Comportamiento responsive (390 px)

- El hero se reduce a unos 450 px de alto y el H1 baja a unos 44 px.
- El panel superpuesto se apila: imagen arriba, texto abajo.
- La constelación pasa a una **cuadrícula ordenada de 2 columnas**.
- Las filas se apilan en vertical: título, descripción y enlace.
- El FAQ y el CTA se apilan en una sola columna.
- El menú ocupa la pantalla completa.

## 6. Librerías recomendadas para BOTKOR

| Necesidad | Decisión | Motivo |
|---|---|---|
| Reveals y filas | **CSS + IntersectionObserver** (propio, ~2 KB) | Es lo que usa la referencia; sin coste de librería |
| H1 por palabras | **CSS puro** (Server Component) | No depende de JS ni de la hidratación |
| Parallax | **rAF propio** solo sobre elementos visibles | Ligero; se desactiva por debajo de 768 px |
| Scroll inercial | **Lenis 1.3** con carga diferida | Equivalente moderno de Locomotive y basado en el scroll nativo |
| Partículas | **Canvas 2D propio** | Unos 6 KB frente a varios MB de MP4 |
| GSAP / Framer Motion | **No se instalan** | Sin ventaja visual aquí; duplicarían motor y peso |

## 7. Matriz de equivalencias Talamus → BOTKOR

| Talamus | BOTKOR | Componente |
|---|---|---|
| Hero naranja + vídeo de partículas | Hero en color de marca + `ParticleField variant="nebula"` | `sections/Hero.tsx` |
| Panel `#1C1C1C` superpuesto (foto + cita) | Panel superpuesto con dashboard de rendimiento, métricas y cita en serif | `Hero.tsx`, `HeroVisual.tsx` |
| Constelación de tarjetas blancas | Sección de tecnología (6 tarjetas) | `sections/Innovation.tsx` |
| H2 centrado + CTA + tarjetas | Soluciones (3 tarjetas escalonadas con parallax) | `FeatureSections.tsx → Solutions` |
| Sección negra + partículas + filas | Automatización y Por qué botkor | `FeatureSections.tsx`, `ui/RowList.tsx` |
| Filas sobre fondo claro | Ingeniería y seguridad | `RowList aside="bullets"` |
| Panel gris "Para mentes curiosas" | Gestión y FAQ | `Management`, `sections/Faq.tsx` |
| `module-cta` con brasas | Proceso (titular a la derecha + línea de tiempo) | `sections/Process.tsx` |
| Footer con wordmark gigante | Footer con wordmark gigante | `layout/Footer.tsx` |
| Header de ocultar y mostrar + barra negra | Igual | `layout/Header.tsx` |

## 8. Desviaciones deliberadas

1. **Sin cortina de carga (A1).** Ocultar la página 1.2 s retrasaría el LCP en más de 1 s. La entrada se hace con el reveal del H1.
2. **H1 por palabras, no por letras (A2).** Dividir por caracteres rompe la lectura en VoiceOver. Además, en móvil (menos de 768 px) el H1 aparece sin animación para mantener el LCP bajo 2.5 s.
3. **Retraso de filas de 150 ms** en lugar de 500 ms, para no frenar la lectura.
4. **Partículas en canvas** en lugar de vídeo, con color controlado por token y pausa fuera de pantalla.
5. **Tipografía:** Halyard y Presti son de licencia comercial (Adobe Fonts). Se usan **Inter Tight** (grotesca de peso 500 con tracking cerrado) y **Newsreader** (serif de citas), autoalojadas con `next/font`.
6. **Color:** se conserva la identidad de BOTKOR (verde de marca). El naranja de Talamus no se copia y se puede activar con una sola variable (ver `DESIGN_SYSTEM.md`).
