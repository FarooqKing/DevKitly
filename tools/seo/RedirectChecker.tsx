"use client";
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import UrlForm from "../web/_UrlForm";
type R = { hops: { url: string; status: number; ms: number; location?: string; type?: string }[]; final: string; redirects: number; loop: boolean };
export default function RedirectChecker() {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null);
  async function run() { setBusy(true); setErr(""); setR(null); try { const res = await fetch(`/api/redirects?url=${encodeURIComponent(url)}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  const c = (s: number) => s < 300 ? "bg-green-100 text-green-700" : s < 400 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return (
    <div className="space-y-4">
      <UrlForm value={url} onChange={setUrl} onSubmit={run} busy={busy} label="Trace redirects" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <div className="card p-4">
        <p className="text-sm"><strong>{r.redirects}</strong> redirect{r.redirects === 1 ? "" : "s"} · final status <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${c(r.hops[r.hops.length - 1].status)}`}>{r.hops[r.hops.length - 1].status}</span>{r.loop && <span className="ml-2 text-red-600">Possible redirect loop (stopped after 10 hops)</span>}{r.redirects > 1 && <span className="ml-2 text-amber-600">Redirect chain: point the first URL directly to the final one.</span>}</p>
        <ol className="mt-4 space-y-2">{r.hops.map((h, i) => <li key={i}><div className="flex items-center gap-3 text-sm"><span className={`w-12 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-xs ${c(h.status)}`}>{h.status}</span><span className="min-w-0 flex-1 break-all font-mono text-xs">{h.url}</span><span className="shrink-0 text-xs text-slate-400">{h.type ?? ""} · {h.ms} ms</span></div>{i < r.hops.length - 1 && <ArrowDown size={14} className="ml-4 mt-1 text-slate-400" />}</li>)}</ol>
      </div>}
    </div>
  );
}
