"use client";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import CopyButton from "@/components/CopyButton";
type R = { channelId: string; name?: string; handle?: string; subscribers?: string; url: string; rss?: string };
export default function ChannelIdFinder() {
  const [q, setQ] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null);
  async function run() { setBusy(true); setErr(""); setR(null); try { const res = await fetch(`/api/youtube-channel?q=${encodeURIComponent(q)}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  return (
    <div className="max-w-3xl space-y-4">
      <form className="card flex flex-wrap items-center gap-3 p-4" onSubmit={(e) => { e.preventDefault(); run(); }}><div className="relative min-w-[16rem] flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="@handle, channel URL or any video URL from the channel" value={q} onChange={(e) => setQ(e.target.value)} required /></div><button className="btn btn-primary" disabled={busy}>{busy && <Loader2 size={15} className="animate-spin" />} Find channel ID</button></form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <div className="card divide-y divide-slate-100 dark:divide-slate-800">{[["Channel ID", r.channelId], ["Name", r.name], ["Handle", r.handle], ["Subscribers", r.subscribers], ["Channel URL", r.url], ["RSS feed", r.rss]].filter(([, v]) => v).map(([k, v]) => <div key={k as string} className="flex items-center gap-3 px-4 py-3 text-sm"><span className="w-28 shrink-0 text-slate-500">{k}</span><code className="min-w-0 flex-1 break-all font-mono">{v}</code><CopyButton text={v as string} label="" className="btn-ghost h-8 w-8 px-0" /></div>)}</div>}
      <p className="text-xs text-slate-500">Channel IDs start with “UC” and are needed for the YouTube API, RSS feeds, embeds and many third-party tools.</p>
    </div>
  );
}
