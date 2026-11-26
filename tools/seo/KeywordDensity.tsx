"use client";
import { useMemo, useState } from "react";
const stop = new Set("a an the and or but if of to in on at by for with from as is are was were be been it its this that these those i you he she we they them his her our your their not no so than then there here what which who whom will would can could should may might do does did has have had about into over after before more most very just also up out".split(" "));
function grams(words: string[], n: number) { const m = new Map<string, number>(); for (let i = 0; i + n <= words.length; i++) { const g = words.slice(i, i + n); if (n === 1 && (stop.has(g[0]) || g[0].length < 3)) continue; if (n > 1 && (stop.has(g[0]) || stop.has(g[n - 1]))) continue; const k = g.join(" "); m.set(k, (m.get(k) ?? 0) + 1); } return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15); }
export default function KeywordDensity() {
  const [text, setText] = useState(""); const [target, setTarget] = useState("");
  const r = useMemo(() => { const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, " ").split(/\s+/).filter(Boolean); const total = words.length; const t = target.trim().toLowerCase(); const tc = t ? (text.toLowerCase().match(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) ?? []).length : 0; return { total, one: grams(words, 1), two: grams(words, 2), three: grams(words, 3), tc, tDensity: total ? (tc * t.split(/\s+/).length / total) * 100 : 0 }; }, [text, target]);
  const Table = ({ title, rows }: { title: string; rows: [string, number][] }) => <div className="card"><header className="border-b border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-800">{title}</header>{rows.length === 0 ? <p className="p-3 text-xs text-slate-400">—</p> : <table className="w-full text-xs"><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map(([k, n]) => <tr key={k}><td className="px-3 py-1.5">{k}</td><td className="px-3 py-1.5 text-right tabular-nums text-slate-500">{n}</td><td className="w-16 px-3 py-1.5 text-right tabular-nums font-medium">{((n / r.total) * 100).toFixed(1)}%</td></tr>)}</tbody></table>}</div>;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-3">
        <textarea className="textarea h-80 font-sans text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your article or page text…" />
        <div className="card flex flex-wrap items-center gap-3 p-3 text-sm"><span className="text-slate-500">{r.total.toLocaleString()} words</span><input className="field w-56 py-1.5" placeholder="Target keyword (optional)" value={target} onChange={(e) => setTarget(e.target.value)} />{target && <span>Appears <strong>{r.tc}×</strong> · density <strong className={r.tDensity > 3 ? "text-red-600" : r.tDensity >= 0.5 ? "text-green-600" : "text-amber-600"}>{r.tDensity.toFixed(2)}%</strong> <span className="text-slate-400">(aim 0.5–2.5%)</span></span>}</div>
      </div>
      <div className="space-y-3"><Table title="Top keywords" rows={r.one} /><Table title="Two-word phrases" rows={r.two} /><Table title="Three-word phrases" rows={r.three} /></div>
    </div>
  );
}
