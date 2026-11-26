import { rateLimit, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 20;
export async function GET(req: Request) {
  const limited = rateLimit(req, "ytchannel", 20); if (limited) return limited;
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim(); if (!q) return json({ error: "Enter a channel URL, @handle or video URL." }, 400);
  let url = q;
  if (/^UC[\w-]{22}$/.test(q)) return json({ channelId: q, url: `https://www.youtube.com/channel/${q}` });
  if (/^@/.test(q)) url = `https://www.youtube.com/${q}`;
  else if (!/^https?:\/\//.test(q)) url = `https://www.youtube.com/@${q.replace(/^\/+/, "")}`;
  if (!/youtube\.com|youtu\.be/.test(url)) return json({ error: "Only YouTube URLs are supported." }, 400);
  try {
    const html = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "en" }, signal: AbortSignal.timeout(10_000) })).text();
    const id = html.match(/"channelId":"(UC[\w-]{22})"/)?.[1] ?? html.match(/channel\/(UC[\w-]{22})/)?.[1] ?? html.match(/<meta itemprop="identifier" content="(UC[\w-]{22})"/)?.[1];
    if (!id) return json({ error: "Couldn't find a channel ID on that page." }, 404);
    const name = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? ""; const handle = html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/)?.[1] ?? "";
    const subs = html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/)?.[1] ?? html.match(/"subscriberCountText":"([^"]+)"/)?.[1] ?? "";
    return json({ channelId: id, name, handle, subscribers: subs, url: `https://www.youtube.com/channel/${id}`, rss: `https://www.youtube.com/feeds/videos.xml?channel_id=${id}` });
  } catch (e) { return json({ error: (e as Error).message }, 502); }
}
