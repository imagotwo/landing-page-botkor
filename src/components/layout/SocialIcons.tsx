/** Iconos de marca en SVG inline (sin dependencias). Decorativos: el texto accesible va en el enlace. */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21.5v-8.2h2.75l.42-3.2H13.5V8.06c0-.93.26-1.56 1.59-1.56h1.7V3.64a22.6 22.6 0 0 0-2.47-.13c-2.45 0-4.12 1.5-4.12 4.24v2.36H7.43v3.2h2.77v8.2h3.3Z" />
    </svg>
  );
}
