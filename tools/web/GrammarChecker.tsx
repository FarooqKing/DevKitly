"use client";
import { useState } from "react";
import { Loader2, Check, Wand2 } from "lucide-react";
import CopyButton from "@/components/CopyButton";

type M = { message: string; short: string; offset: number; length: number; replacements: string[]; type: string; category: string };
const colors: Record<string, string> = { misspelling: "bg-red-200/70 dark:bg-red-500/40", grammar: "bg-amber-200/70 dark:bg-amber-500/40", style: "bg-sky-200/70 dark:bg-sky-500/40", typographical: "bg-violet-200/70 dark:bg-violet-500/40" };
const langs = [["en-US", "English (US)"], ["en-GB", "English (UK)"], ["auto", "Auto-detect"], ["de-DE", "German"], ["fr", "French"], ["es", "Spanish"], ["pt-BR", "Portuguese"], ["nl", "Dutch"], ["it", "Italian"], ["ru-RU", "Russian"]];

export default function GrammarChecker() {
  const [text, setText] = useState(""); const [lang, setLang] = useState("en-US");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [matches, setMatches] = useState<M[] | null>(null);
  async function run() { setBusy(true); setErr(""); setMatches(null); try { const res = await fetch("/api/grammar", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, language: lang }) }); const d = await res.json(); if (!res.ok) throw new Error(d.error); setMatches(d.matches); } catch (e) { setErr((e as Error).message); } setBusy(false); }
  function apply(m: M, rep: string) { setText((t) => t.slice(0, m.offset) + rep + t.slice(m.offset + m.length)); const delta = rep.length - m.length; setMatches((ms) => ms!.filter((x) => x !== m).map((x) => (x.offset > m.offset ? { ...x, offset: x.offset + delta } : x))); }
  function applyAll() { let t = text; const sorted = [...(matches ?? [])].filter((m) => m.replacements[0] !== undefined).sort((a, b) => b.offset - a.offset); for (const m of sorted) t = t.slice(0, m.offset) + m.replacements[0] + t.slice(m.offset + m.length); setText(t); setMatches([]); }
  const highlighted = (() => { if (!matches) return null; const out: React.ReactNode[] = []; let i = 0; [...matches].sort((a, b) => a.offset - b.offset).forEach((m, n) => { out.push(text.slice(i, m.offset)); out.push(<mark key={n} className={`rounded px-0.5 ${colors[m.type] ?? "bg-slate-200"}`} title={m.message}>{text.slice(m.offset, m.offset + m.length)}</mark>); i = m.offset + m.length; }); out.push(text.slice(i)); return out; })();

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        <div className="card flex flex-wrap items-center gap-2 p-3">
          <select className="field w-auto py-1.5" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">{langs.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <span className="text-xs text-slate-500">{text.length.toLocaleString()} / 20,000</span>
          <button className="btn btn-primary ml-auto" onClick={run} disabled={!text.trim() || busy}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Check text</button>
          {matches && matches.length > 0 && <button className="btn" onClick={applyAll}><Wand2 size={15} /> Fix all</button>}
          <CopyButton text={text} className="h-8" />
        </div>
        {matches ? <div className="card min-h-[18rem] whitespace-pre-wrap p-4 text-sm leading-relaxed" onClick={() => setMatches(null)} title="Click to edit">{highlighted}</div>
          : <textarea className="textarea h-72 font-sans text-sm leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here. Click “Check text” to find spelling, grammar and style issues." />}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
      <div className="card h-fit">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Issues {matches && <span className={`rounded-full px-2 py-0.5 text-xs ${matches.length ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{matches.length}</span>}</header>
        {!matches ? <p className="p-4 text-sm text-slate-400">Suggestions appear here.</p> : matches.length === 0 ? <p className="p-6 text-center text-sm text-green-600">No issues found 🎉</p> :
          <ul className="max-h-[36rem] divide-y divide-slate-100 overflow-auto dark:divide-slate-800">{matches.map((m, i) => <li key={i} className="px-4 py-3 text-sm"><p className="text-xs uppercase tracking-wide text-slate-400">{m.category}</p><p className="mt-0.5"><span className="font-mono line-through decoration-red-400">{text.slice(m.offset, m.offset + m.length) || "⎵"}</span> — {m.message}</p>{m.replacements.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{m.replacements.map((r) => <button key={r} className="btn h-7 px-2 text-xs" onClick={() => apply(m, r)}>{r || "(remove)"}</button>)}</div>}</li>)}</ul>}
      </div>
      <p className="text-xs text-slate-500 lg:col-span-2">Checked with LanguageTool. Text is sent to the grammar service only for analysis and is not stored by us.</p>
    </div>
  );
}
