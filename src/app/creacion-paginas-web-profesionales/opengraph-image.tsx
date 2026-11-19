import { ImageResponse } from "next/og";
import { hero } from "@/content/landing";

export const alt = "botkor — Creación de páginas web profesionales a medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 14, background: "#2563eb", color: "#ffffff", fontSize: 26, fontWeight: 700, alignItems: "center", justifyContent: "center" }}>
            b/
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>botkor</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>{hero.h1}</div>
        <div style={{ display: "flex", gap: 28, fontSize: 26, color: "#06b6d4" }}>
          <span>Carga &lt; 2 s</span>
          <span>·</span>
          <span>SEO + GEO</span>
          <span>·</span>
          <span>Entrega en 1–3 semanas</span>
        </div>
      </div>
    ),
    size,
  );
}
