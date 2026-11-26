import { rateLimit, json } from "@/lib/server";
export const runtime = "nodejs"; export const maxDuration = 30;
// Default: LanguageTool public API (free, ~20 req/min, 20k chars). Self-host for unlimited: docker run -p 8010:8010 erikvl87/languagetool  → LANGUAGETOOL_URL=http://localhost:8010
const BASE = process.env.LANGUAGETOOL_URL ?? "https://api.languagetool.org";

export async function POST(req: Request) {
  const limited = rateLimit(req, "grammar", 15); if (limited) return limited;
  const { text, language = "en-US" } = await req.json().catch(() => ({}));
  if (!text || typeof text !== "string") return json({ error: "No text provided." }, 400);
  if (text.length > 20_000) return json({ error: "Text is limited to 20,000 characters." }, 400);
  try {
    const body = new URLSearchParams({ text, language, enabledOnly: "false" });
    const r = await fetch(`${BASE}/v2/check`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body, signal: AbortSignal.timeout(25_000) });
    if (!r.ok) return json({ error: r.status === 429 ? "Grammar service is busy; try again in a minute." : `Grammar service error (${r.status})` }, 502);
    const d = await r.json();
    return json({ matches: (d.matches ?? []).map((m: { message: string; shortMessage?: string; offset: number; length: number; replacements: { value: string }[]; rule: { id: string; category: { name: string }; issueType?: string } }) => ({
      message: m.message, short: m.shortMessage || m.rule.category.name, offset: m.offset, length: m.length, replacements: m.replacements.slice(0, 5).map((x) => x.value), type: m.rule.issueType ?? "other", category: m.rule.category.name })) });
  } catch (e) { return json({ error: (e as Error).message }, 502); }
}
