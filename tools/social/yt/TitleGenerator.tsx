"use client";
import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";
const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const titleT = ["How to {k} in {y} (Step by Step)", "{K}: The Complete Beginner's Guide", "I Tried {k} for 30 Days — Here's What Happened", "{n} {K} Mistakes You're Probably Making", "{K} Explained in {m} Minutes", "The Truth About {k} Nobody Tells You", "{n} {K} Tips That Actually Work", "{K} vs {alt}: Which Is Better in {y}?", "Why Everyone Is Talking About {k}", "{K} for Beginners: Everything You Need to Know", "Stop Doing This With {k}!", "{K} Tutorial: From Zero to Pro", "Best {K} Setup in {y} (Budget to Pro)", "What I Wish I Knew Before Starting {k}", "{n} Secrets to Master {k} Fast"];
export default function TitleGenerator() {
  const [k, setK] = useState("video editing"); const [alt, setAlt] = useState("Premiere Pro"); const [seed, setSeed] = useState(0); const [hashtags, setHashtags] = useState("#tutorial #howto");
  const y = new Date().getFullYear();
  const titles = useMemo(() => { void seed; const n = [5, 7, 10, 12][Math.floor(Math.random() * 4)], m = [5, 10, 15][Math.floor(Math.random() * 3)]; return [...titleT].sort(() => Math.random() - 0.5).slice(0, 10).map((t) => t.replace(/\{k\}/g, k.toLowerCase()).replace(/\{K\}/g, cap(k)).replace(/\{y\}/g, String(y)).replace(/\{n\}/g, String(n)).replace(/\{m\}/g, String(m)).replace(/\{alt\}/g, alt || "the alternative")); }, [k, alt, seed, y]);
  const desc = `In this video, I show you ${k.toLowerCase()} step by step. Whether you're a complete beginner or looking to improve, you'll learn the exact process I use.\n\n⏱ TIMESTAMPS\n0:00 Intro\n0:45 What you need\n2:10 Step 1\n5:30 Step 2\n9:00 Common mistakes\n11:20 Final result\n\n🔗 LINKS & RESOURCES\n• Website: https://\n• Free template: https://\n\n📱 FOLLOW ME\nInstagram: @\nTwitter/X: @\n\n👍 If this helped, like and subscribe for more ${k.toLowerCase()} tutorials every week!\n\n${hashtags}`;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="card space-y-3 p-4"><div><label className="label" htmlFor="k">Main keyword / topic</label><input id="k" className="field mt-1" value={k} onChange={(e) => setK(e.target.value)} /></div><div><label className="label" htmlFor="a">Alternative (for “vs” titles)</label><input id="a" className="field mt-1" value={alt} onChange={(e) => setAlt(e.target.value)} /></div><div><label className="label" htmlFor="h">Hashtags for description</label><input id="h" className="field mt-1" value={hashtags} onChange={(e) => setHashtags(e.target.value)} /></div></div>
        <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Title ideas</h2><button className="btn h-8" onClick={() => setSeed((s) => s + 1)}><RefreshCw size={14} /> Shuffle</button></header><ul className="divide-y divide-slate-100 dark:divide-slate-800">{titles.map((t) => <li key={t} className="flex items-center gap-2 px-3 py-2 text-sm"><span className="min-w-0 flex-1">{t}</span><span className={`shrink-0 text-xs ${t.length > 70 ? "text-red-500" : "text-slate-400"}`}>{t.length}</span><CopyButton text={t} label="" className="btn-ghost h-7 w-7 px-0" /></li>)}</ul><p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">Keep titles under 70 characters so they aren&apos;t cut off; put the keyword near the start.</p></div>
      </div>
      <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Description template</h2><CopyButton text={desc} className="btn-ghost h-8 px-2" /></header><pre className="whitespace-pre-wrap p-3 font-sans text-sm leading-relaxed">{desc}</pre></div>
    </div>
  );
}
