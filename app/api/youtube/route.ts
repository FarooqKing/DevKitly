import { rateLimit, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 20;
// With YOUTUBE_API_KEY: full stats + tags. Without: basic info via public oEmbed (no key needed).
export async function GET(req: Request) {
  const limited = rateLimit(req, "youtube", 30); if (limited) return limited;
  const id = new URL(req.url).searchParams.get("id") ?? ""; if (!/^[\w-]{11}$/.test(id)) return json({ error: "Invalid video ID." }, 400);
  const key = process.env.YOUTUBE_API_KEY;
  try {
    if (key) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${key}`, { signal: AbortSignal.timeout(10_000) });
      const d = await r.json(); if (!r.ok) return json({ error: d.error?.message ?? "YouTube API error" }, 502);
      const v = d.items?.[0]; if (!v) return json({ error: "Video not found or private." }, 404);
      const dur = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/) ?? [];
      return json({ full: true, id, title: v.snippet.title, channel: v.snippet.channelTitle, channelId: v.snippet.channelId, published: v.snippet.publishedAt, description: v.snippet.description, tags: v.snippet.tags ?? [], category: v.snippet.categoryId, thumbnail: v.snippet.thumbnails.maxres?.url ?? v.snippet.thumbnails.high?.url, duration: `${dur[1] ? dur[1] + ":" : ""}${String(dur[2] ?? 0).padStart(dur[1] ? 2 : 1, "0")}:${String(dur[3] ?? 0).padStart(2, "0")}`, views: +v.statistics.viewCount || 0, likes: +v.statistics.likeCount || 0, comments: +v.statistics.commentCount || 0, definition: v.contentDetails.definition });
    }
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { signal: AbortSignal.timeout(10_000) });
    if (!r.ok) return json({ error: "Video not found or private." }, 404);
    const d = await r.json();
    // Try to pull tags/description from the watch page (best effort, no key)
    let tags: string[] = [], description = "", views = 0;
    try { const html = await (await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "en" }, signal: AbortSignal.timeout(10_000) })).text();
      const kw = html.match(/"keywords":\[(.*?)\]/); if (kw) tags = JSON.parse(`[${kw[1]}]`);
      const ds = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/); if (ds) description = JSON.parse(`"${ds[1]}"`);
      const vc = html.match(/"viewCount":"(\d+)"/); if (vc) views = +vc[1]; } catch {}
    return json({ full: false, id, title: d.title, channel: d.author_name, channelUrl: d.author_url, thumbnail: d.thumbnail_url, tags, description, views });
  } catch (e) { return json({ error: (e as Error).message }, 502); }
}
