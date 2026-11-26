"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { ytId } from "../_yt";
const toSec = (t: string) => { const p = t.trim().split(":").map(Number); if (p.some(isNaN)) return NaN; return p.reduce((a, b) => a * 60 + b, 0); };
export default function TimestampLinks() {
  const [url, setUrl] = useState(""); const [list, setList] = useState("0:00 Intro\n1:30 Setup\n4:05 Main demo\n9:40 Conclusion");
  const id = ytId(url);
  const rows = useMemo(() => list.split("\n").map((l) => { const m = l.match(/^\s*(\d{1,2}(?::\d{2}){1,2})\s*[-–:]?\s*(.*)$/); if (!m) return null; const s = toSec(m[1]); return isNaN(s) ? null : { t: m[1], s, label: m[2].trim(), link: id ? `https://youtu.be/${id}?t=${s}` : "" }; }).filter(Boolean) as { t: string; s: number; label: string; link: string }[], [list, id]);
  const chapters = rows.map((r) => `${r.t} ${r.label}`).join("\n"); const links = rows.map((r) => `${r.t} ${r.label} — ${r.link}`).join("\n");
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-3 p-4">
        <div><label className="label" htmlFor="u">YouTube video URL</label><input id="u" className="field mt-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />{url && !id && <p className="mt-1 text-xs text-red-600">No video ID found.</p>}</div>
        <div><label className="label" htmlFor="l">Timestamps (one per line: mm:ss label)</label><textarea id="l" className="field mt-1 h-48 font-mono text-sm" value={list} onChange={(e) => setList(e.target.value)} /></div>
        <p className="text-xs text-slate-500">For YouTube chapters, the first timestamp must be 0:00 and you need at least 3 entries, each 10+ seconds apart.</p>
      </div>
      <div className="space-y-4">
        <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Timestamp links</h2><CopyButton text={links} className="btn-ghost h-8 px-2" /></header>{rows.length === 0 ? <p className="p-3 text-sm text-slate-400">Add timestamps.</p> : <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">{rows.map((r, i) => <li key={i} className="flex items-center gap-3 px-3 py-2"><code className="w-14 shrink-0 font-mono text-slate-500">{r.t}</code><span className="min-w-0 flex-1 truncate">{r.label}</span>{r.link ? <><a href={r.link} target="_blank" rel="noreferrer" className="truncate font-mono text-xs text-brand-600 hover:underline">{r.link}</a><CopyButton text={r.link} label="" className="btn-ghost h-7 w-7 px-0" /></> : <span className="text-xs text-slate-400">add URL</span>}</li>)}</ul>}</div>
        <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Chapters block (paste into description)</h2><CopyButton text={chapters} className="btn-ghost h-8 px-2" /></header><pre className="p-3 font-mono text-sm">{chapters || "—"}</pre></div>
      </div>
    </div>
  );
}
