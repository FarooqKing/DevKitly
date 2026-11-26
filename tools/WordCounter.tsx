"use client";
import { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.trim() ? text.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((x) => x.trim()).length : 0;
    const freq = new Map<string, number>();
    for (const w of words) { const k = w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, ""); if (k.length > 3) freq.set(k, (freq.get(k) ?? 0) + 1); }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    return { words: words.length, chars: text.length, charsNoSpace: text.replace(/\s/g, "").length, sentences, paragraphs, reading: Math.ceil(words.length / 225), speaking: Math.ceil(words.length / 140), top };
  }, [text]);

  const stats: [string, string | number][] = [["Words", s.words], ["Characters", s.chars], ["Without spaces", s.charsNoSpace], ["Sentences", s.sentences], ["Paragraphs", s.paragraphs], ["Reading time", `${s.reading} min`], ["Speaking time", `${s.speaking} min`]];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <textarea className="textarea h-[26rem] font-sans" value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing or paste your text…" />
      <div className="space-y-4">
        <div className="card grid grid-cols-2 gap-px overflow-hidden bg-slate-200 dark:bg-slate-800">
          {stats.map(([k, v]) => <div key={k} className="bg-white p-3 dark:bg-slate-900"><p className="text-xl font-semibold tabular-nums">{v}</p><p className="text-xs text-slate-500">{k}</p></div>)}
        </div>
        <div className="card p-3">
          <p className="text-sm font-medium">Top keywords</p>
          {s.top.length === 0 ? <p className="mt-2 text-sm text-slate-400">Appear here once you type.</p> : (
            <ul className="mt-2 space-y-1 text-sm">{s.top.map(([w, n]) => <li key={w} className="flex justify-between"><span>{w}</span><span className="text-slate-400">{n}</span></li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
