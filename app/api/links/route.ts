import { rateLimit, safeUrl, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 60;
const UA = "Mozilla/5.0 (compatible; DevKitlyLinkChecker/1.0)";

async function check(href: string): Promise<{ url: string; status: number | null; ok: boolean; ms: number; error?: string }> {
  const t = Date.now();
  try {
    let r = await fetch(href, { method: "HEAD", redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(8000) });
    if (r.status === 405 || r.status === 403 || r.status === 501) r = await fetch(href, { method: "GET", redirect: "follow", headers: { "user-agent": UA, range: "bytes=0-0" }, signal: AbortSignal.timeout(8000) });
    return { url: href, status: r.status, ok: r.ok || (r.status >= 300 && r.status < 400), ms: Date.now() - t };
  } catch (e) { return { url: href, status: null, ok: false, ms: Date.now() - t, error: (e as Error).name === "TimeoutError" ? "Timeout" : "Unreachable" }; }
}

export async function GET(req: Request) {
  const limited = rateLimit(req, "links", 5); if (limited) return limited;
  const url = safeUrl(new URL(req.url).searchParams.get("url") ?? ""); if (!url) return json({ error: "Enter a valid public URL." }, 400);
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15_000) });
    if (!r.ok) return json({ error: `Page returned HTTP ${r.status}` }, 502);
    const html = (await r.text()).slice(0, 2_000_000);
    const hrefs = new Set<string>();
    for (const m of html.matchAll(/<a\b[^>]*?\bhref\s*=\s*["']([^"'#]+?)["']/gi)) {
      try { const abs = new URL(m[1], url); if (["http:", "https:"].includes(abs.protocol)) { abs.hash = ""; hrefs.add(abs.toString()); } } catch {}
    }
    const list = [...hrefs].slice(0, 150);
    const results: Awaited<ReturnType<typeof check>>[] = [];
    for (let i = 0; i < list.length; i += 12) results.push(...(await Promise.all(list.slice(i, i + 12).map(check))));
    const host = url.hostname;
    return json({ page: url.toString(), total: hrefs.size, checked: list.length, truncated: hrefs.size > list.length,
      results: results.map((x) => ({ ...x, internal: new URL(x.url).hostname === host })).sort((a, b) => Number(a.ok) - Number(b.ok)) });
  } catch (e) { return json({ error: (e as Error).name === "TimeoutError" ? "The page took too long to load." : (e as Error).message }, 502); }
}
