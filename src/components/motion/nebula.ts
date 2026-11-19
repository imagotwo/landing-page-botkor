/**
 * Coreografía "nebula" del hero: implementación original en canvas 2D que reproduce el
 * comportamiento del vídeo de referencia (medido fotograma a fotograma, ciclo de 12,28 s):
 *
 *   0,0 – 0,8 s   fondo limpio
 *   0,8 – 3,0 s   las partículas llegan desde detrás de la cámara (bokeh grande → polvo fino)
 *                 y la nube se contrae hasta formar dos esferas
 *   3,0 – 7,0 s   dos esferas flotando y girando, muy cerca una de otra
 *   7,3 – 10,8 s  se solapan; la intersección se enciende con un núcleo cálido
 *  10,8 – 11,9 s  se funden, se expanden y atraviesan la cámara
 *  11,9 – 12,28 s fondo limpio → bucle
 *
 * Modelo: mundo 3D con radio de esfera = 1 y cámara a distancia D del centro del par.
 * La entrada y la salida son un "dolly" de cámara (Z), así que la perspectiva produce
 * de forma natural el bokeh, la convergencia y la explosión.
 */

export const NEBULA_CYCLE = 12.28;

const D = 6;          // distancia cámara → centro del par (unidades de mundo)
const Z_MAX = 19;     // salida: con este desplazamiento todo queda detrás de la cámara
const Z_SPHERES = 7.5; // entrada de las esferas (empiezan justo detrás de la cámara)
const Z_STARS = 5;     // entrada del polvo de fondo
const NEAR = 0.12;    // plano cercano

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Vector de separación entre esferas (x, y en radios; y hacia abajo), por fotogramas clave medidos. */
const SEP_KEYS: ReadonlyArray<readonly [t: number, x: number, y: number]> = [
  [3.0, 1.7, -1.12],
  [7.0, 1.76, -1.0],
  [8.4, 1.4, -0.42],
  [10.3, 1.3, -0.42],
  [11.0, 0, 0],
];

function sepAt(t: number): [number, number] {
  const first = SEP_KEYS[0]!;
  if (t <= first[0]) return [first[1], first[2]];
  for (let i = 0; i < SEP_KEYS.length - 1; i++) {
    const a = SEP_KEYS[i]!, b = SEP_KEYS[i + 1]!;
    if (t <= b[0]) {
      const e = smooth(a[0], b[0], t);
      return [a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e];
    }
  }
  return [0, 0];
}

/** Encuadre según el ancho: punto de fuga (centro del par) y escala de pantalla. */
function frameFor(w: number, h: number) {
  if (w < 768) return { cx: w * 0.6, cy: h * 0.3, unit: w * 1.7 };
  if (w < 1024) return { cx: w * 0.68, cy: h * 0.4, unit: w * 1.15 };
  return { cx: w * 0.73, cy: h * 0.47, unit: Math.min(w, h * 1.9) };
}

function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Disco pre-renderado: los puntos grandes (bokeh) se pintan con drawImage, mucho más barato que arc(). */
function makeSprite(rgb: string) {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgb(${rgb})`);
  g.addColorStop(0.82, `rgb(${rgb})`);
  g.addColorStop(1, `rgb(${rgb} / 0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  return c;
}

export interface NebulaScene {
  build(w: number, h: number): void;
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, tSec: number): void;
}

/**
 * @param rgb  color de las partículas ("r g b")
 * @param glow color del núcleo de fusión ("r g b")
 */
export function createNebula(rgb: string, glow: string): NebulaScene {
  const base = rgb.split(/\s+/).map(Number);
  const hot = glow.split(/\s+/).map(Number);
  // Las partículas dentro de la intersección toman un tono entre su color y el del núcleo.
  const tint = base.map((c, i) => Math.round(c * 0.45 + (hot[i] ?? c) * 0.55)).join(" ");
  const fillBase = `rgb(${rgb})`;
  const fillTint = `rgb(${tint})`;
  const spriteBase = makeSprite(rgb);
  const spriteTint = makeSprite(tint);

  // Esferas: posición local en la bola unitaria, tamaño (mundo), alfa, índice de esfera, dispersión
  let n = 0;
  let lx = new Float32Array(0), ly = lx, lz = lx, sz = lx, al = lx, sp = lx, ex = lx, ey = lx, ez = lx;
  // Polvo de fondo: posición de mundo en reposo
  let m = 0;
  let wx = new Float32Array(0), wy = wx, wz = wx, wsz = wx, wal = wx;
  let f = 1, cx = 0, cy = 0;

  return {
    build(w, h) {
      const fr = frameFor(w, h);
      cx = fr.cx; cy = fr.cy;
      const rPx = 0.112 * fr.unit;          // radio de esfera en reposo, en px
      f = rPx * D;                          // px por unidad de mundo a profundidad 1
      const mobile = w < 768;
      const perSphere = mobile ? 1000 : w >= 1600 ? 4200 : 3600;
      n = perSphere * 2;
      lx = new Float32Array(n); ly = new Float32Array(n); lz = new Float32Array(n);
      sz = new Float32Array(n); al = new Float32Array(n); sp = new Float32Array(n);
      ex = new Float32Array(n); ey = new Float32Array(n); ez = new Float32Array(n);
      const pxToWorld = D / f;
      for (let i = 0; i < n; i++) {
        let gx = gauss(), gy = gauss(), gz = gauss();
        const len = Math.hypot(gx, gy, gz) || 1;
        // Volumen uniforme con borde difuso
        let r = Math.cbrt(Math.random());
        if (Math.random() < 0.12) r *= 1 + Math.abs(gauss()) * 0.16;
        gx /= len; gy /= len; gz /= len;
        lx[i] = gx * r; ly[i] = gy * r; lz[i] = gz * r;
        sp[i] = i % 2;
        const px = Math.random() < 0.04 ? 2.4 + Math.random() * 1.6 : 0.9 + Math.random() * 1.3;
        sz[i] = px * pxToWorld * (mobile ? 0.9 : 1);
        al[i] = 0.62 + Math.random() * 0.38;
        ex[i] = gauss() * 0.7; ey[i] = gauss() * 0.7; ez[i] = gauss() * 0.7;
      }

      m = mobile ? 240 : 900;
      wx = new Float32Array(m); wy = new Float32Array(m); wz = new Float32Array(m);
      wsz = new Float32Array(m); wal = new Float32Array(m);
      for (let i = 0; i < m; i++) {
        // Uniforme en pantalla a una profundidad aleatoria (algunas delante de las esferas → bokeh)
        const depth = 2.6 + Math.random() * 13;
        const sx = (Math.random() * 1.2 - 0.1) * w;
        const sy = (Math.random() * 1.2 - 0.1) * h;
        wx[i] = ((sx - cx) * depth) / f;
        wy[i] = ((sy - cy) * depth) / f;
        wz[i] = depth - D;
        const big = Math.random() < 0.035;
        const px = big ? 4 + Math.random() * 5 : 0.8 + Math.random() * 1.5;
        wsz[i] = (px * depth) / f;
        wal[i] = big ? 0.95 : 0.35 + Math.random() * 0.6;
      }
    },

    draw(ctx, w, h, tSec) {
      const t = tSec % NEBULA_CYCLE;
      ctx.clearRect(0, 0, w, h);

      // Dolly de cámara. Entrada: el polvo llega primero (0,8–1,8 s) y las esferas después (1,15–3,0 s).
      // Salida (ease-in): todo atraviesa la cámara entre 10,8 y 12,1 s.
      let Z = 0, Zs = 0;
      if (t < 3) {
        Z = Z_SPHERES * (1 - clamp01((t - 1.15) / 1.85)) ** 1.3;
        Zs = Z_STARS * (1 - clamp01((t - 0.8) / 1.0)) ** 2;
      } else if (t > 10.8) {
        Z = Zs = Z_MAX * clamp01((t - 10.8) / 1.3) ** 2;
      }
      if (t < 0.75 || t > 12.05) return;
      // Fundido global de entrada y salida (evita apariciones bruscas)
      const fade = smooth(0.75, 1.3, t) * (1 - smooth(11.55, 12.0, t));

      const [sepX, sepY] = sepAt(t);
      const aX = -sepX / 2, aY = -sepY / 2, aZ = -0.12;
      const bX = sepX / 2, bY = sepY / 2, bZ = 0.12;
      // Expansión al fundirse y ensanchamiento horizontal durante el solape
      const k = 1 + 1.25 * smooth(10.7, 11.7, t);
      const scatter = k - 1;
      const stretch = 1 + 0.12 * smooth(7.2, 8.6, t) * (1 - smooth(10.6, 11.0, t));
      const heat = smooth(7.3, 9.0, t) * (1 - smooth(10.95, 11.45, t));

      let seq = 0;
      let lastTint = false;
      ctx.fillStyle = fillBase;
      const project = (x: number, y: number, z: number, zCam: number, size: number, alpha: number, tinted: boolean) => {
        const depth = D + z - zCam;
        if (depth < NEAR) return;
        const s = f / depth;
        const px = cx + x * s;
        const py = cy + y * s;
        let r = size * s;
        if (r > 48) r = 48;
        if (px < -r || px > w + r || py < -r || py > h + r) return;
        const a = alpha * fade * clamp01((depth - NEAR) / 0.8);
        if (a <= 0.01) return;
        // Puntos ampliados durante el vuelo: se pinta 1 de cada 2 (se solapan y no se nota) → mitad de coste
        if (r > 3.2 && (seq++ & 1)) return;
        ctx.globalAlpha = a;
        if (r < 3.2) {
          // Cambiar fillStyle obliga a parsear el color: solo cuando cambia
          if (tinted !== lastTint) { ctx.fillStyle = tinted ? fillTint : fillBase; lastTint = tinted; }
          ctx.fillRect(px, py, r, r);
        } else {
          ctx.drawImage(tinted ? spriteTint : spriteBase, px - r / 2, py - r / 2, r, r);
        }
      };

      // 1) Polvo de fondo (deriva vertical muy lenta)
      const drift = t * 0.035;
      for (let i = 0; i < m; i++) project(wx[i]!, wy[i]! - drift * (1 + wz[i]! * 0.05), wz[i]!, Zs, wsz[i]!, wal[i]!, false);

      // 2) Núcleo cálido en la intersección (elipse perpendicular a la separación)
      if (heat > 0.01) {
        const depth = D - Z;
        if (depth > NEAR) {
          const s = f / depth;
          const ang = Math.atan2(sepY, sepX);
          const ry = (0.95 + 0.6 * scatter) * s;
          ctx.save();
          ctx.globalAlpha = heat * fade;
          ctx.translate(cx, cy);
          ctx.rotate(ang);
          ctx.scale(0.58, 1);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
          g.addColorStop(0, `rgb(${glow} / 0.9)`);
          g.addColorStop(0.45, `rgb(${glow} / 0.45)`);
          g.addColorStop(1, `rgb(${glow} / 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(-ry, -ry, ry * 2, ry * 2);
          ctx.restore();
        }
      }

      // 3) Esferas: rotación propia, solape tintado y expansión final
      const rotA = t * 0.22, rotB = t * 0.22 + 1.7;
      const cA = Math.cos(rotA), sA = Math.sin(rotA), cB = Math.cos(rotB), sB = Math.sin(rotB);
      for (let i = 0; i < n; i++) {
        const isA = sp[i] === 0;
        const c = isA ? cA : cB, s = isA ? sA : sB;
        const x0 = lx[i]!, z0 = lz[i]!;
        const rx = (x0 * c - z0 * s) * stretch;
        const rz = x0 * s + z0 * c;
        const ry = ly[i]!;
        const ox = isA ? aX : bX, oy = isA ? aY : bY, oz = isA ? aZ : bZ;
        const x = ox + rx * k + ex[i]! * scatter;
        const y = oy + ry * k + ey[i]! * scatter;
        const z = oz + rz * k + ez[i]! * scatter;
        let tinted = false;
        if (heat > 0.05) {
          // ¿Está dentro de la otra esfera? → zona de fusión
          const dx = x - (isA ? bX : aX), dy = y - (isA ? bY : aY);
          tinted = (dx * dx) / (stretch * stretch) + dy * dy < 1.05 * k * k && ((i * 0.618034) % 1) < heat * 1.4;
        }
        project(x, y, z, Z, sz[i]!, al[i]!, tinted);
      }
      ctx.globalAlpha = 1;
    },
  };
}
