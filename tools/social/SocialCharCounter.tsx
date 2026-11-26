"use client";
import { useState } from "react";
const limits = [["X / Twitter post", 280], ["X bio", 160], ["Instagram caption", 2200], ["Instagram bio", 150], ["Facebook post", 63206], ["Facebook ad text", 125], ["LinkedIn post", 3000], ["LinkedIn headline", 220], ["YouTube title", 100], ["YouTube description", 5000], ["TikTok caption", 2200], ["Threads post", 500], ["Pinterest description", 500], ["Google title tag", 60], ["Meta description", 160], ["SMS", 160]] as const;
export default function SocialCharCounter() {
  const [text, setText] = useState("");
  const n = [...text].length; const words = text.trim() ? text.trim().split(/\s+/).length : 0; const hashtags = (text.match(/#\w+/g) ?? []).length; const mentions = (text.match(/@\w+/g) ?? []).length; const emoji = (text.match(/\p{Extended_Pictographic}/gu) ?? []).length;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div><textarea className="textarea h-72 font-sans text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your post…" /><div className="card mt-3 grid grid-cols-5 divide-x divide-slate-200 text-center dark:divide-slate-800">{[[n, "chars"], [words, "words"], [hashtags, "hashtags"], [mentions, "mentions"], [emoji, "emoji"]].map(([v, l]) => <div key={l} className="p-3"><p className="text-xl font-semibold tabular-nums">{v}</p><p className="text-xs text-slate-500">{l}</p></div>)}</div></div>
      <div className="card"><header className="border-b border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-slate-800">Platform limits</header><ul className="divide-y divide-slate-100 dark:divide-slate-800">{limits.map(([name, max]) => { const over = n > max; const pct = Math.min(100, (n / max) * 100); return <li key={name} className="px-4 py-2 text-sm"><div className="flex justify-between"><span>{name}</span><span className={`tabular-nums ${over ? "font-semibold text-red-600" : "text-slate-500"}`}>{n}/{max}{over && ` (${n - max} over)`}</span></div><div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-full ${over ? "bg-red-500" : pct > 90 ? "bg-amber-400" : "bg-green-500"}`} style={{ width: `${pct}%` }} /></div></li>; })}</ul></div>
    </div>
  );
}
