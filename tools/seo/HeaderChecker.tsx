"use client";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import UrlForm from "../web/_UrlForm";
type R = { url: string; status: number; statusText: string; ms: number; headers: Record<string, string>; security: { name: string; present: boolean; value?: string }[]; server?: string; https: boolean };
export default function HeaderChecker() {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null);
  async function run() { setBusy(true); setErr(""); setR(null); try { const res = await fetch(`/api/headers?url=${encodeURIComponent(url)}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  return (
    <div className="space-y-4">
      <UrlForm value={url} onChange={setUrl} onSubmit={run} busy={busy} label="Check headers" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <div className="grid gap-4 lg:grid-cols-2">
        <div className="card"><header className="border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Response · <span className="font-mono">{r.status} {r.statusText}</span> · {r.ms} ms{r.server && <> · {r.server}</>}</header><table className="w-full text-xs"><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{Object.entries(r.headers).map(([k, v]) => <tr key={k}><td className="px-4 py-1.5 align-top font-mono text-slate-500">{k}</td><td className="break-all px-4 py-1.5 font-mono">{v}</td></tr>)}</tbody></table></div>
        <div className="card h-fit"><header className="border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Security headers · {r.security.filter((s) => s.present).length}/{r.security.length}</header><ul className="divide-y divide-slate-100 dark:divide-slate-800"><li className="flex items-center gap-2 px-4 py-2 text-sm">{r.https ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />} HTTPS</li>{r.security.map((s) => <li key={s.name} className="flex items-start gap-2 px-4 py-2 text-sm">{s.present ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-red-600" />}<div className="min-w-0"><p className="font-mono text-xs">{s.name}</p>{s.value && <p className="truncate text-xs text-slate-500" title={s.value}>{s.value}</p>}</div></li>)}</ul></div>
      </div>}
    </div>
  );
}
