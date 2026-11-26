import { rateLimit, json } from "@/lib/server";
export const runtime = "nodejs";
// Only proxies YouTube thumbnail hosts so the browser can download them (they lack CORS headers).
const allowed = ["i.ytimg.com", "img.youtube.com", "i3.ytimg.com"];
export async function GET(req: Request) {
  const limited = rateLimit(req, "imgproxy", 30); if (limited) return limited;
  const u = new URL(req.url).searchParams.get("url") ?? "";
  let target: URL; try { target = new URL(u); } catch { return json({ error: "Bad URL" }, 400); }
  if (!allowed.includes(target.hostname)) return json({ error: "Host not allowed" }, 403);
  const r = await fetch(target, { signal: AbortSignal.timeout(10_000) });
  if (!r.ok) return json({ error: "Not found" }, 404);
  return new Response(await r.arrayBuffer(), { headers: { "content-type": r.headers.get("content-type") ?? "image/jpeg", "cache-control": "public, max-age=86400", "content-disposition": `attachment; filename="thumbnail.jpg"` } });
}
