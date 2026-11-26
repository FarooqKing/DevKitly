import { rateLimit, safeUrl, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 60;
// Option A (default, zero setup): Microlink public API (free tier, rate-limited).
// Option B (own server): set SCREENSHOT_MODE=playwright and run `npm i playwright && npx playwright install chromium --with-deps`.

export async function GET(req: Request) {
  const limited = rateLimit(req, "screenshot", 5); if (limited) return limited;
  const p = new URL(req.url).searchParams;
  const url = safeUrl(p.get("url") ?? ""); if (!url) return json({ error: "Enter a valid public URL." }, 400);
  const device = p.get("device") === "mobile" ? "mobile" : "desktop";
  const full = p.get("full") === "1";
  try {
    if (process.env.SCREENSHOT_MODE === "playwright") {
      // Loaded at runtime only (not bundled): install on your server with `npm i playwright`
      const { chromium } = (eval("require") as NodeRequire)("playwright") as typeof import("playwright-core");
      const browser = await chromium.launch(); 
      const ctx = await browser.newContext({ viewport: device === "mobile" ? { width: 390, height: 844 } : { width: 1366, height: 768 }, deviceScaleFactor: 1, userAgent: device === "mobile" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1" : undefined });
      const page = await ctx.newPage();
      await page.goto(url.toString(), { waitUntil: "networkidle", timeout: 30_000 }).catch(() => {});
      const buf = await page.screenshot({ fullPage: full, type: "png" }); await browser.close();
      return new Response(new Uint8Array(buf), { headers: { "content-type": "image/png", "cache-control": "public, max-age=3600" } });
    }
    const api = new URL("https://api.microlink.io"); api.searchParams.set("url", url.toString()); api.searchParams.set("screenshot", "true"); api.searchParams.set("meta", "false");
    api.searchParams.set("viewport.width", device === "mobile" ? "390" : "1366"); api.searchParams.set("viewport.height", device === "mobile" ? "844" : "768"); if (full) api.searchParams.set("screenshot.fullPage", "true");
    const r = await fetch(api, { signal: AbortSignal.timeout(50_000) }); const d = await r.json();
    if (d.status !== "success") return json({ error: d.message ?? "Screenshot service failed." }, 502);
    const img = await fetch(d.data.screenshot.url, { signal: AbortSignal.timeout(20_000) });
    return new Response(await img.arrayBuffer(), { headers: { "content-type": img.headers.get("content-type") ?? "image/png", "cache-control": "public, max-age=3600" } });
  } catch (e) { return json({ error: (e as Error).name === "TimeoutError" ? "Screenshot timed out." : (e as Error).message }, 502); }
}
