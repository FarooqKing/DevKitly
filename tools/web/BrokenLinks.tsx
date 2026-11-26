"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import UrlForm from "./_UrlForm";
import CopyButton from "@/components/CopyButton";

type R = { page: string; total: number; checked: number; truncated: boolean; results: { url: string; status: number | null; ok: boolean; ms: number; error?: string; internal: boolean }[] };
export default function BrokenLinks() {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null); const [filter, setFilter] = useState<"all" | "broken">("broken");
  async function run() { setBusy(true); setErr(""); setR(null); try { const res = await fetch(`/api/links?url=${encodeURIComponent(url)}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); setFilter(d.results.some((x: { ok: boolean }) => !x.ok) ? "broken" : "all"); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  const broken = r?.results.filter((x) => !x.ok) ?? []; const shown = filter === "broken" ? broken : r?.results ?? [];
  return (
    <div className="space-y-4">
      <UrlForm value={url} onChange={setUrl} onSubmit={run} busy={busy} label="Check links" />
      {busy && <p className="text-sm text-slate-500">Fetching the page and testing every link (up to 150)…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <div className="card">
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <span className="text-sm"><strong>{r.checked}</strong> links checked{r.truncated && <span className="text-slate-400"> (of {r.total})</span>} · <strong className={broken.length ? "text-red-600" : "text-green-600"}>{broken.length} broken</strong></span>
          <div className="seg ml-auto"><button aria-pressed={filter === "broken"} onClick={() => setFilter("broken")}>Broken only</button><button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button></div>
          {broken.length > 0 && <CopyButton text={broken.map((x) => x.url).join("\n")} label="Copy broken" className="h-8" />}
        </header>
        {shown.length === 0 ? <p className="p-6 text-center text-sm text-green-600">No broken links found 🎉</p> : <ul className="max-h-[32rem] divide-y divide-slate-100 overflow-auto text-sm dark:divide-slate-800">{shown.map((x) => <li key={x.url} className="flex items-center gap-3 px-4 py-2"><span className="shrink-0">{x.ok ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}</span><span className={`w-14 shrink-0 font-mono text-xs ${x.ok ? "text-slate-500" : "text-red-600"}`}>{x.status ?? x.error}</span><a href={x.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate hover:underline" title={x.url}>{x.url}</a><span className="hidden shrink-0 rounded bg-slate-100 px-1.5 text-[10px] text-slate-500 sm:inline dark:bg-slate-800">{x.internal ? "internal" : "external"}</span><span className="hidden w-14 shrink-0 text-right text-xs text-slate-400 sm:inline">{x.ms} ms</span><ExternalLink size={13} className="shrink-0 text-slate-400" /></li>)}</ul>}
      </div>}
    </div>
  );
}
