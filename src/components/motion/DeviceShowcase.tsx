/* eslint-disable @next/next/no-img-element -- capturas largas recortadas por CSS: next/image no aporta aquí */

/**
 * Vitrina de dispositivos (sección #tecnologia): bucle de 24,4 s.
 *  - Laptop (scroll de 10 s): hace scroll continuo y lento por la web real de Enfermeras Ángeles de Vida
 *    (proyecto de BOTKOR, captura en /public/showcase).
 *  - Giro suave en Y y entran los tres celulares (scroll de 10 s) con la versión móvil del mismo sitio;
 *    el central hace scroll continuo. Vuelve a girar hacia la laptop.
 * Solo HTML + CSS (showcase.css), sin JavaScript. Decorativo: aria-hidden + data-nosnippet.
 * Arranca al entrar en viewport (.is-inview); con reduced-motion queda fija la laptop.
 */
/*
 * Cada captura tiene dos tamaños; el navegador elige según el ancho real de la pantalla del dispositivo
 * (laptop ≈ 61 % del escenario, celular central ≈ 24 %; escenario = min(100vw − 32px, 1024px)).
 * La captura de escritorio está recortada a 6 300 px de alto: el scroll de la laptop no pasa de ahí.
 */
const DESKTOP = {
  src: "/showcase/angeles-desktop.webp",
  srcSet: "/showcase/angeles-desktop-640.webp 640w, /showcase/angeles-desktop.webp 1100w",
  sizes: "(min-width: 1056px) 623px, 61vw",
  w: 1100,
  h: 4813,
};
const MOBILE = {
  src: "/showcase/angeles-mobile.webp",
  srcSet: "/showcase/angeles-mobile-280.webp 280w, /showcase/angeles-mobile.webp 480w",
  sizes: "(min-width: 1056px) 246px, 24vw",
  w: 480,
  h: 12308,
};

function Shot({ img }: { img: typeof DESKTOP }) {
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.sizes}
      width={img.w}
      height={img.h}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

function Phone({ pos, scroll }: { pos: "left" | "center" | "right"; scroll: string }) {
  return (
    <div className={`ph ph--${pos}`}>
      <span className="ph-btn ph-btn--a" />
      <span className="ph-btn ph-btn--b" />
      <span className="ph-btn ph-btn--c" />
      <div className="ph-bezel">
        <div className="sc-screen ph-screen">
          <div className={`sc-scroll ${scroll}`}>
            <Shot img={MOBILE} />
          </div>
          <span className="ph-island" />
          <span className="sc-glare" />
        </div>
      </div>
    </div>
  );
}

export function DeviceShowcase({ className }: { className?: string }) {
  return (
    <div data-reveal="fade" data-nosnippet aria-hidden="true" className={`showcase ${className ?? ""}`}>
      <div className="sc-stage">
        {/* Laptop */}
        <div className="sc-scene sc-scene--laptop">
          <div className="sc-shadow sc-shadow--laptop" />
          <div className="lp">
            <div className="lp-deck">
              <span className="lp-grille lp-grille--l" />
              <span className="lp-keys" />
              <span className="lp-grille lp-grille--r" />
              <span className="lp-pad" />
              <span className="lp-front" />
            </div>
            <div className="lp-hinge" />
            <div className="lp-lid">
              <span className="lp-cam" />
              <div className="sc-screen lp-screen">
                <div className="sc-scroll sc-scroll--laptop">
                  <Shot img={DESKTOP} />
                </div>
                <span className="sc-glare" />
              </div>
            </div>
          </div>
        </div>

        {/* Celulares */}
        <div className="sc-scene sc-scene--phones">
          <div className="sc-shadow sc-shadow--phones" />
          <div className="ph-float" style={{ "--d": "-0.8s" } as React.CSSProperties}>
            <Phone pos="left" scroll="sc-scroll--ph-left" />
          </div>
          <div className="ph-float" style={{ "--d": "-1.9s" } as React.CSSProperties}>
            <Phone pos="right" scroll="sc-scroll--ph-right" />
          </div>
          <div className="ph-float" style={{ "--d": "0s" } as React.CSSProperties}>
            <Phone pos="center" scroll="sc-scroll--ph-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
