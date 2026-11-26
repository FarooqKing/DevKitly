import { rateLimit, safeUrl, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 60;

export async function GET(req: Request) {
  const limited = rateLimit(req, "pagespeed", 5); if (limited) return limited;
  const { searchParams } = new URL(req.url);
  const url = safeUrl(searchParams.get("url") ?? ""); if (!url) return json({ error: "Enter a valid public URL." }, 400);
  const strategy = searchParams.get("strategy") === "desktop" ? "desktop" : "mobile";
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url.toString()); api.searchParams.set("strategy", strategy);
  ["performance", "accessibility", "best-practices", "seo"].forEach((c) => api.searchParams.append("category", c));
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  try {
    const r = await fetch(api, { signal: AbortSignal.timeout(55_000) });
    const d = await r.json();
    if (!r.ok) return json({ error: d.error?.message ?? "PageSpeed API error" }, 502);
    const lh = d.lighthouseResult; const a = lh.audits; const cat = lh.categories;
    const metric = (id: string) => ({ value: a[id]?.displayValue ?? "—", score: a[id]?.score ?? null });
    const opportunities = Object.values(a as Record<string, { id: string; title: string; score: number | null; details?: { type?: string; overallSavingsMs?: number } ; displayValue?: string }>)
      .filter((x) => x.details?.type === "opportunity" && (x.score ?? 1) < 0.9).sort((x, y) => (y.details?.overallSavingsMs ?? 0) - (x.details?.overallSavingsMs ?? 0)).slice(0, 8)
      .map((x) => ({ title: x.title, savings: x.displayValue ?? "" }));
    const crux = d.loadingExperience?.metrics ?? {};
    return json({
      url: lh.finalUrl, strategy, fetchedAt: lh.fetchTime,
      scores: { performance: cat.performance?.score, accessibility: cat.accessibility?.score, bestPractices: cat["best-practices"]?.score, seo: cat.seo?.score },
      metrics: { fcp: metric("first-contentful-paint"), lcp: metric("largest-contentful-paint"), tbt: metric("total-blocking-time"), cls: metric("cumulative-layout-shift"), si: metric("speed-index"), ttfb: metric("server-response-time") },
      field: { lcp: crux.LARGEST_CONTENTFUL_PAINT_MS?.category, cls: crux.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category, inp: crux.INTERACTION_TO_NEXT_PAINT?.category, overall: d.loadingExperience?.overall_category },
      opportunities, screenshot: a["final-screenshot"]?.details?.data ?? null,
    });
  } catch (e) { return json({ error: (e as Error).name === "TimeoutError" ? "Analysis timed out. Try again." : (e as Error).message }, 502); }
}
