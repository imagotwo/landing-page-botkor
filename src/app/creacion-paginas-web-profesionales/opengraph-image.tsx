import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, pricing } from "@/content/landing";

/** SVG de /public como data URI. Se quita el <text> ("Growth Systems"): el renderizador no carga Poppins. */
async function svgDataUri(file: string, viewBox?: string) {
  let svg = await readFile(join(process.cwd(), "public", file), "utf8");
  svg = svg.replace(/<text[\s\S]*?<\/text>/g, "");
  if (viewBox) svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`).replace(/ width="[^"]*" height="[^"]*"/, "");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export const alt = "botkor — Diseño de páginas web profesionales en Bogotá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [mark, wordmark] = await Promise.all([
    svgDataUri("icon.svg"),
    svgDataUri("brand/botkor-wordmark-blanco.svg", "77 12 151 23"),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          // Paleta BOTKOR: Azul Corporativo con degradado Azul Tecnológico → Morado Inteligente
          background: "linear-gradient(135deg, #0b1020 0%, #0b1020 45%, #2563eb 80%, #7c3aed 100%)",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo acepta <img> */}
          <img src={mark} width={84} height={84} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={302} height={46} alt="" />
        </div>
        {/* Sin letterSpacing negativo: next/og reserva el ancho sin aplicarlo y deja huecos tras las palabras largas */}
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 18, fontSize: 64, fontWeight: 700, lineHeight: 1.08, maxWidth: 1000 }}>
          {hero.h1.split(" ").map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 26, color: "#06b6d4" }}>
          <span>Carga &lt; 2 s</span>
          <span>·</span>
          <span>SEO + GEO</span>
          <span>·</span>
          <span>Desde {pricing.landing}</span>
        </div>
      </div>
    ),
    size,
  );
}
