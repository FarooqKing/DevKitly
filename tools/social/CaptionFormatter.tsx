"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
const INV = "\u2063"; // invisible separator keeps blank lines on Instagram
export default function CaptionFormatter() {
  const [text, setText] = useState("Weekend vibes ☀️\n\nSwipe to see the full set.\nSave this for later!\n\n#travel #pakistan #weekend");
  const [hideTags, setHideTags] = useState(true); const [dots, setDots] = useState(false);
  const out = useMemo(() => { let t = text.replace(/[ \t]+$/gm, ""); if (hideTags) { const tags = t.match(/#\w+/g) ?? []; if (tags.length) { t = t.replace(/#\w+/g, "").replace(/\n{3,}$/g, "\n").trimEnd(); t += "\n" + Array(5).fill(dots ? "." : INV).join("\n") + "\n" + tags.join(" "); } } return t.split("\n").map((l) => (l.trim() === "" ? (dots ? "." : INV) : l)).join("\n"); }, [text, hideTags, dots]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3"><textarea className="textarea h-72 font-sans text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your caption with blank lines…" /><div className="card flex flex-wrap gap-4 p-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={hideTags} onChange={(e) => setHideTags(e.target.checked)} /> Move hashtags below the fold</label><label className="flex items-center gap-2"><input type="checkbox" checked={dots} onChange={(e) => setDots(e.target.checked)} /> Use dots instead of invisible characters</label></div></div>
      <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Formatted caption · {[...out].length} chars</h2><CopyButton text={out} className="btn-ghost h-8 px-2" /></header><pre className="whitespace-pre-wrap p-3 font-sans text-sm leading-relaxed">{out}</pre><p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">Instagram strips blank lines; invisible characters keep your spacing. Copy, paste into the app and post.</p></div>
    </div>
  );
}
