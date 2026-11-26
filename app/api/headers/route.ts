import { rateLimit, safeUrl, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 30;
const security = ["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"];
export async function GET(req: Request) {
  const limited = rateLimit(req, "headers", 10); if (limited) return limited;
  const url = safeUrl(new URL(req.url).searchParams.get("url") ?? ""); if (!url) return json({ error: "Enter a valid public URL." }, 400);
  try {
    const t = Date.now();
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; DevKitlyHeaderChecker/1.0)" }, signal: AbortSignal.timeout(15_000) });
    const headers: Record<string, string> = {}; r.headers.forEach((v, k) => (headers[k] = v));
    return json({ url: r.url, status: r.status, statusText: r.statusText, ms: Date.now() - t, headers, security: security.map((h) => ({ name: h, present: h in headers, value: headers[h] })), server: headers["server"], contentType: headers["content-type"], https: r.url.startsWith("https://") });
  } catch (e) { return json({ error: (e as Error).name === "TimeoutError" ? "Request timed out." : (e as Error).message }, 502); }
}
