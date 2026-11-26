"use client";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { ytId } from "../_yt";
const n = (x: number) => x.toLocaleString();
type R = { full: boolean; id: string; title: string; channel: string; channelId?: string; channelUrl?: string; published?: string; description: string; tags: string[]; thumbnail: string; duration?: string; views: number; likes?: number; comments?: number; definition?: string };

export default function YoutubeInfo({ mode = "info" }: { mode?: "info" | "tags" }) {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null);
  async function run() { const id = ytId(url); if (!id) return setErr("Couldn't find a video ID in that URL."); setBusy(true); setErr(""); setR(null); try { const res = await fetch(`/api/youtube?id=${id}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  return (
    <div className="max-w-4xl space-y-4">
      <form className="card flex flex-wrap items-center gap-3 p-4" onSubmit={(e) => { e.preventDefault(); run(); }}><div className="relative min-w-[16rem] flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="https://www.youtube.com/watch?v=…" value={url} onChange={(e) => setUrl(e.target.value)} required /></div><button className="btn btn-primary" disabled={busy}>{busy && <Loader2 size={15} className="animate-spin" />} {mode === "tags" ? "Extract tags" : "Get info"}</button></form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <>
        {mode === "tags" && <div className="card p-4"><div className="flex items-center justify-between"><span className="label">{r.tags.length} tags</span>{r.tags.length > 0 && <CopyButton text={r.tags.join(", ")} className="btn-ghost h-8 px-2" />}</div>{r.tags.length === 0 ? <p className="mt-2 text-sm text-slate-500">This video has no tags (creators often leave them empty).</p> : <div className="mt-2 flex flex-wrap gap-1.5">{r.tags.map((t) => <span key={t} className="rounded-md bg-brand-50 px-2 py-1 text-sm text-brand-700 dark:bg-brand-600/15 dark:text-brand-500">{t}</span>)}</div>}</div>}
        <div className="card grid gap-4 p-4 sm:grid-cols-[14rem_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.thumbnail} alt="" className="w-full rounded-lg" />
          <div className="min-w-0"><h2 className="font-semibold">{r.title}</h2><p className="text-sm text-slate-500">{r.channel}{r.published && ` · ${new Date(r.published).toLocaleDateString()}`}{r.duration && ` · ${r.duration}`}{r.definition && ` · ${r.definition.toUpperCase()}`}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">{[["Views", r.views], ["Likes", r.likes], ["Comments", r.comments]].map(([l, v]) => <div key={l as string} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><p className="text-lg font-semibold tabular-nums">{typeof v === "number" && v > 0 ? n(v) : "—"}</p><p className="text-xs text-slate-500">{l as string}</p></div>)}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs"><CopyButton text={r.title} label="Copy title" className="h-7 px-2" /><CopyButton text={r.id} label="Copy video ID" className="h-7 px-2" />{r.channelId && <CopyButton text={r.channelId} label="Copy channel ID" className="h-7 px-2" />}</div></div>
        </div>
        {mode === "info" && r.tags.length > 0 && <div className="card p-4"><div className="flex items-center justify-between"><span className="label">Tags ({r.tags.length})</span><CopyButton text={r.tags.join(", ")} className="btn-ghost h-8 px-2" /></div><div className="mt-2 flex flex-wrap gap-1.5">{r.tags.map((t) => <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-sm dark:bg-slate-800">{t}</span>)}</div></div>}
        {r.description && <div className="card p-4"><div className="flex items-center justify-between"><span className="label">Description</span><CopyButton text={r.description} className="btn-ghost h-8 px-2" /></div><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">{r.description}</pre></div>}
        {!r.full && <p className="text-xs text-slate-500">Likes and comments need a YouTube API key on the server (free). Tags and description are read from the public page when available.</p>}
      </>}
    </div>
  );
}
export const YoutubeTags = () => <YoutubeInfo mode="tags" />;
