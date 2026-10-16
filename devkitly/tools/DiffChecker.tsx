"use client";
import { useMemo, useState } from "react";
import { diffLines, diffWords, diffChars } from "diff";
import Pane from "@/components/Pane";

const a = `server:
  port: 8080
  host: localhost
features:
  auth: true
  cache: false`;
const b = `server:
  port: 9090
  host: 0.0.0.0
features:
  auth: true
  cache: true
  logging: debug`;

export default function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<"lines" | "words" | "chars">("lines");

  const parts = useMemo(() => {
    if (!left && !right) return [];
    const fn = mode === "lines" ? diffLines : mode === "words" ? diffWords : diffChars;
    return fn(left, right);
  }, [left, right, mode]);
  const added = parts.filter((p) => p.added).reduce((n, p) => n + (p.count ?? 0), 0);
  const removed = parts.filter((p) => p.removed).reduce((n, p) => n + (p.count ?? 0), 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="seg">{(["lines", "words", "chars"] as const).map((m) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{m[0].toUpperCase() + m.slice(1)}</button>)}</div>
        {parts.length > 0 && <span className="text-sm"><span className="text-green-600">+{added}</span> <span className="ml-2 text-red-600">−{removed}</span> <span className="ml-1 text-slate-400">{mode}</span></span>}
        <button className="btn btn-ghost ml-auto" onClick={() => { setLeft(a); setRight(b); }}>Load sample</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Pane title="Original" value={left} onChange={setLeft} placeholder="Paste the original text…" className="[&_textarea]:min-h-[12rem]" />
        <Pane title="Changed" value={right} onChange={setRight} placeholder="Paste the changed text…" className="[&_textarea]:min-h-[12rem]" />
      </div>
      {parts.length > 0 && (
        <section className="card mt-4 overflow-hidden">
          <header className="border-b border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-800">Differences</header>
          <pre className="overflow-auto p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {parts.map((p, i) => (
              <span key={i} className={p.added ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200" : p.removed ? "bg-red-100 text-red-900 line-through decoration-red-400 dark:bg-red-900/40 dark:text-red-200" : "text-slate-600 dark:text-slate-400"}>{p.value}</span>
            ))}
          </pre>
        </section>
      )}
    </div>
  );
}
