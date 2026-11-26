"use client";
import { useMemo, useState } from "react";

const flagList = [["g", "global"], ["i", "ignore case"], ["m", "multiline"], ["s", "dotAll"], ["u", "unicode"]] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+)\\.com\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact: alice@example.com, bob@test.com or support@devkitly.com for help.");

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpExecArray[], error: "" };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches: RegExpExecArray[] = []; let m: RegExpExecArray | null;
      while ((m = re.exec(text)) && matches.length < 1000) { matches.push(m); if (m[0] === "") re.lastIndex++; }
      return { matches: flags.includes("g") ? matches : matches.slice(0, 1), error: "" };
    } catch (e) { return { matches: [], error: (e as Error).message }; }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    const out: React.ReactNode[] = []; let last = 0;
    result.matches.forEach((m, i) => {
      out.push(text.slice(last, m.index));
      out.push(<mark key={i} className="rounded bg-yellow-200 text-slate-900 dark:bg-yellow-500/70">{m[0]}</mark>);
      last = m.index + m[0].length;
    });
    out.push(text.slice(last)); return out;
  }, [result, text]);

  return (
    <div>
      <div className="card p-4">
        <label className="label" htmlFor="pat">Regular expression</label>
        <div className="mt-1 flex items-center gap-1 font-mono">
          <span className="text-slate-400">/</span>
          <input id="pat" className={`field flex-1 font-mono ${result.error ? "border-red-500" : ""}`} value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} />
          <span className="text-slate-400">/</span>
          <input className="field w-20 font-mono" value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} aria-label="Flags" />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {flagList.map(([f, name]) => (
            <label key={f} className="flex items-center gap-1.5"><input type="checkbox" checked={flags.includes(f)} onChange={(e) => setFlags((x) => (e.target.checked ? x + f : x.replace(f, "")))} /><code>{f}</code> <span className="text-slate-500">{name}</span></label>
          ))}
        </div>
        {result.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card flex flex-col overflow-hidden">
          <header className="border-b border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-800">Test string</header>
          <textarea className="min-h-[14rem] flex-1 resize-y bg-transparent p-3 font-mono text-sm outline-none" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
        </section>
        <section className="card flex flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-800">Matches <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-600/15 dark:text-brand-500">{result.matches.length}</span></header>
          <pre className="min-h-[7rem] whitespace-pre-wrap border-b border-slate-200 p-3 font-mono text-sm leading-relaxed dark:border-slate-800">{highlighted}</pre>
          <div className="max-h-64 overflow-auto text-sm">
            {result.matches.length === 0 && <p className="p-3 text-slate-400">No matches yet.</p>}
            {result.matches.map((m, i) => (
              <div key={i} className="border-b border-slate-100 px-3 py-2 dark:border-slate-800/60">
                <div className="flex gap-3"><span className="text-slate-400">#{i + 1}</span><code className="font-mono">{m[0]}</code><span className="ml-auto text-xs text-slate-400">index {m.index}</span></div>
                {m.length > 1 && <ul className="mt-1 pl-8 text-xs text-slate-500">{Array.from(m).slice(1).map((g, gi) => <li key={gi}>Group {gi + 1}: <code className="font-mono text-slate-700 dark:text-slate-300">{g ?? "undefined"}</code></li>)}</ul>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
