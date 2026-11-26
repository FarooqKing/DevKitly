// Server-side helpers for API routes (rate limit, URL validation)
import { NextResponse } from "next/server";

const buckets = new Map<string, { n: number; reset: number }>();
/** Simple in-memory limiter: `limit` requests per `windowMs` per IP. Enough for one server; use Redis for multiple instances. */
export function rateLimit(req: Request, key: string, limit = 10, windowMs = 60_000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const k = `${key}:${ip}`; const now = Date.now(); const b = buckets.get(k);
  if (!b || b.reset < now) { buckets.set(k, { n: 1, reset: now + windowMs }); return null; }
  if (b.n >= limit) return NextResponse.json({ error: `Too many requests. Try again in ${Math.ceil((b.reset - now) / 1000)}s.` }, { status: 429 });
  b.n++; return null;
}

/** Only allow public http(s) URLs; block localhost/private ranges (SSRF). */
export function safeUrl(input: string): URL | null {
  let u: URL; try { u = new URL(input.trim().match(/^https?:\/\//) ? input.trim() : `https://${input.trim()}`); } catch { return null; }
  if (!["http:", "https:"].includes(u.protocol)) return null;
  const h = u.hostname;
  if (h === "localhost" || h.endsWith(".local") || /^(127|10|0)\./.test(h) || /^192\.168\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h) || h === "::1" || h === "[::1]") return null;
  return u;
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
