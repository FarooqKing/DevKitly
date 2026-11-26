import { rateLimit, safeUrl, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 30;
export async function GET(req: Request) {
  const limited = rateLimit(req, "redirects", 10); if (limited) return limited;
  let url = safeUrl(new URL(req.url).searchParams.get("url") ?? ""); if (!url) return json({ error: "Enter a valid public URL." }, 400);
  const hops: { url: string; status: number; ms: number; location?: string; type?: string }[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const t = Date.now();
      const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (compatible; DevKitlyRedirectChecker/1.0)" }, signal: AbortSignal.timeout(10_000) });
      const loc = r.headers.get("location") ?? undefined;
      const type = r.status === 301 ? "Permanent (301)" : r.status === 302 ? "Temporary (302)" : r.status === 307 ? "Temporary (307)" : r.status === 308 ? "Permanent (308)" : undefined;
      hops.push({ url: url.toString(), status: r.status, ms: Date.now() - t, location: loc, type });
      if (r.status >= 300 && r.status < 400 && loc) { const next = safeUrl(new URL(loc, url).toString()); if (!next) break; url = next; } else break;
    }
    return json({ hops, final: hops[hops.length - 1]?.url, redirects: hops.length - 1, loop: hops.length >= 10 });
  } catch (e) { return json({ error: (e as Error).name === "TimeoutError" ? "Request timed out." : (e as Error).message, hops }, 502); }
}
