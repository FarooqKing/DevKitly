"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
const limits = [["X / Twitter", 280], ["Threads", 500], ["Bluesky", 300], ["Mastodon", 500], ["LinkedIn comment", 1250]] as const;
export default function ThreadSplitter() {
  const [text, setText] = useState(""); const [limit, setLimit] = useState<number>(280); const [number, setNumber] = useState(true);
  const parts = useMemo(() => { const out: string[] = []; const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/); let cur = ""; const reserve = number ? 7 : 0;
    for (const s of sentences) { const words = s.split(" "); for (const w of words) { const next = cur ? `${cur} ${w}` : w; if (next.length > limit - reserve) { if (cur) out.push(cur); cur = w; } else cur = next; } } if (cur) out.push(cur);
    return out.map((p, i) => (number ? `${p} (${i + 1}/${out.length})` : p)); }, [text, limit, number]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3"><div className="card flex flex-wrap items-center gap-3 p-3 text-sm"><select className="field w-auto py-1.5" value={limit} onChange={(e) => setLimit(+e.target.value)} aria-label="Platform">{limits.map(([n, l]) => <option key={n} value={l}>{n} ({l})</option>)}</select><label className="flex items-center gap-2"><input type="checkbox" checked={number} onChange={(e) => setNumber(e.target.checked)} /> Number posts (1/n)</label><span className="ml-auto text-slate-500">{text.length.toLocaleString()} chars → {parts.length} posts</span></div>
        <textarea className="textarea h-80 font-sans text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your long post. It will be split at sentence and word boundaries so nothing is cut mid-word." /></div>
      <div className="space-y-3">{parts.length === 0 ? <div className="card p-6 text-center text-sm text-slate-400">Your thread appears here.</div> : <><div className="flex justify-end"><CopyButton text={parts.join("\n\n")} label="Copy whole thread" /></div>{parts.map((p, i) => <div key={i} className="card p-3"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">Post {i + 1} · {p.length}/{limit}</span><CopyButton text={p} className="btn-ghost h-7 px-2" /></div><p className="mt-1 whitespace-pre-wrap text-sm">{p}</p></div>)}</>}</div>
    </div>
  );
}
