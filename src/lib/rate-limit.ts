/**
 * Rate limiter de ventana deslizante en memoria.
 * Suficiente para una instancia única o como primera barrera. En despliegues serverless
 * con múltiples instancias, reemplazar el Map por un almacén compartido
 * (p. ej. Upstash Redis / Vercel KV) manteniendo esta misma interfaz.
 */
type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }

  bucket.hits.push(now);
  if (buckets.size >= MAX_KEYS && !buckets.has(key)) {
    const firstKey = buckets.keys().next().value;
    if (firstKey !== undefined) buckets.delete(firstKey);
  }
  buckets.set(key, bucket);
  return { ok: true, retryAfter: 0 };
}
