import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' en script-src es necesario para los scripts de hidratación de Next.js
 *   cuando la página se genera estáticamente (SSG). Un CSP con nonce obligaría a renderizado
 *   dinámico en cada request y penalizaría TTFB/LCP. Ver docs/ARCHITECTURE.md §4.
 * - Solo se permiten los orígenes de GA4 y Meta Pixel; ningún otro tercero puede ejecutar JS.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // En desarrollo se omite: forzaría https al abrir el sitio por IP de red (http://192.168.x.x:3000)
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ")
  .replace(/\s{2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HSTS solo en producción: en desarrollo obligaría a https a los hosts de la red local
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /**
   * Solo afecta a `next dev`: permite abrir el servidor de desarrollo desde cualquier IP o
   * dominio de la red (móvil, otra PC, IP nueva tras reconectar el Wi-Fi) sin que Next.js
   * bloquee sus recursos internos (/_next, HMR). "**.*" = cualquier host con al menos un punto
   * (todas las IPv4 y dominios). Se ignora en producción.
   */
  allowedDevOrigins: ["**.*"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // En este proyecto la landing pilar es la ruta principal.
    return [{ source: "/", destination: "/creacion-paginas-web-profesionales", permanent: false }];
  },
};

export default nextConfig;
