"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
const rnd = (n: number) => Math.floor(Math.random() * n);
const sentence = () => { const n = 8 + rnd(10); const s = Array.from({ length: n }, () => W[rnd(W.length)]).join(" "); return s[0].toUpperCase() + s.slice(1) + "."; };
const paragraph = () => Array.from({ length: 4 + rnd(4) }, sentence).join(" ");

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [classic, setClassic] = useState(true);
  const [seed, setSeed] = useState(0);

  const text = useMemo(() => {
    void seed;
    let out = unit === "paragraphs" ? Array.from({ length: count }, paragraph).join("\n\n")
      : unit === "sentences" ? Array.from({ length: count }, sentence).join(" ")
      : Array.from({ length: count }, () => W[rnd(W.length)]).join(" ");
    if (classic && unit !== "words") out = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + out.replace(/^[^.]*\. /, "");
    return out;
  }, [count, unit, classic, seed]);

  return (
    <div className="max-w-3xl">
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <input type="number" min={1} max={100} className="field w-24" value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} aria-label="Count" />
        <div className="seg">{(["paragraphs", "sentences", "words"] as const).map((u) => <button key={u} aria-pressed={unit === u} onClick={() => setUnit(u)}>{u}</button>)}</div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} /> Start with “Lorem ipsum…”</label>
        <div className="ml-auto flex gap-2"><button className="btn" onClick={() => setSeed((s) => s + 1)}>Regenerate</button><CopyButton text={text} className="btn-primary" /></div>
      </div>
      <div className="card mt-4 whitespace-pre-wrap p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</div>
    </div>
  );
}
