import type { Metadata, Viewport } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// next/font: autoalojadas, subset latino y métricas de respaldo ajustadas → CLS = 0.
// Para cambiar de tipografía: reemplaza aquí y conserva los nombres de variable CSS.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Se ejecuta antes del primer pintado: activa los estados iniciales de animación
 * solo si hay JS y el usuario no pidió reducir movimiento. Si el motor no arranca
 * en 4 s (JS bloqueado o error), se retira la clase y todo queda visible.
 */
const MOTION_BOOT = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__motion)d.classList.remove('motion')},4000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${interTight.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-[6px] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Saltar al contenido
        </a>
        {children}
        <MotionRuntime />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
