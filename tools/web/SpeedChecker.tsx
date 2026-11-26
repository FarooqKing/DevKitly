"use client";
import { useState } from "react";
import UrlForm from "./_UrlForm";

type R = { url: string; strategy: string; scores: Record<string, number>; metrics: Record<string, { value: string; score: number | null }>; field: Record<string, string | undefined>; opportunities: { title: string; savings: string }[]; screenshot: string | null };
const col = (s: number | null) => s === null ? "text-slate-400" : s >= 0.9 ? "text-green-600" : s >= 0.5 ? "text-amber-500" : "text-red-600";
const ring = (s: number | null) => s === null ? "#94a3b8" : s >= 0.9 ? "#16a34a" : s >= 0.5 ? "#f59e0b" : "#dc2626";
const names: Record<string, string> = { performance: "Performance", accessibility: "Accessibility", bestPractices: "Best Practices", seo: "SEO" };
const mnames: Record<string, string> = { fcp: "First Contentful Paint", lcp: "Largest Contentful Paint", tbt: "Total Blocking Time", cls: "Cumulative Layout Shift", si: "Speed Index", ttfb: "Server Response Time" };
const fieldCol: Record<string, string> = { FAST: "text-green-600", AVERAGE: "text-amber-500", SLOW: "text-red-600" };

export default function SpeedChecker() {
  const [url, setUrl] = useState(""); const [strategy, setStrategy] = useState("mobile");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [r, setR] = useState<R | null>(null);
  async function run() {
    setBusy(true); setErr(""); setR(null);
    try { const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`); const d = await res.json(); if (!res.ok) throw new Error(d.error); setR(d); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  return (
    <div className="space-y-4">
      <UrlForm value={url} onChange={setUrl} onSubmit={run} busy={busy} label="Test speed"><div className="seg"><button type="button" aria-pressed={strategy === "mobile"} onClick={() => setStrategy("mobile")}>Mobile</button><button type="button" aria-pressed={strategy === "desktop"} onClick={() => setStrategy("desktop")}>Desktop</button></div></UrlForm>
      {busy && <p className="text-sm text-slate-500">Running Lighthouse via Google PageSpeed Insights, this usually takes 15–40 seconds…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {r && <>
        <div className="grid gap-4 sm:grid-cols-4">{Object.entries(r.scores).map(([k, v]) => <div key={k} className="card flex flex-col items-center p-5"><svg viewBox="0 0 36 36" className="h-20 w-20"><circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke={ring(v)} strokeWidth="3" strokeDasharray={`${(v ?? 0) * 100} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" /><text x="18" y="21.5" textAnchor="middle" className={`text-[10px] font-bold ${col(v)}`} fill="currentColor">{Math.round((v ?? 0) * 100)}</text></svg><p className="mt-2 text-sm font-medium">{names[k]}</p></div>)}</div>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="card"><header className="border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Lab metrics ({r.strategy})</header>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">{Object.entries(r.metrics).map(([k, m]) => <li key={k} className="flex items-center justify-between px-4 py-2.5 text-sm"><span>{mnames[k]}</span><span className={`font-mono font-semibold ${col(m.score)}`}>{m.value}</span></li>)}</ul>
            {r.field.overall && <p className="border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800">Real-user data (CrUX): LCP <span className={fieldCol[r.field.lcp ?? ""]}>{r.field.lcp ?? "—"}</span> · CLS <span className={fieldCol[r.field.cls ?? ""]}>{r.field.cls ?? "—"}</span> · INP <span className={fieldCol[r.field.inp ?? ""]}>{r.field.inp ?? "—"}</span></p>}
          </div>
          <div className="space-y-4">
            {r.screenshot && /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.screenshot} alt="Rendered page" className="card w-full" />}
            {r.opportunities.length > 0 && <div className="card"><header className="border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Top opportunities</header><ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">{r.opportunities.map((o) => <li key={o.title} className="flex justify-between gap-3 px-4 py-2"><span>{o.title}</span><span className="shrink-0 text-amber-600">{o.savings}</span></li>)}</ul></div>}
          </div>
        </div>
        <p className="text-xs text-slate-500">Powered by Google PageSpeed Insights / Lighthouse. Scores vary between runs; test 2–3 times for a stable picture.</p>
      </>}
    </div>
  );
}
