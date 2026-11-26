"use client";
import { useState } from "react";
import { Dices } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default function RandomNumber() {
  const [min, setMin] = useState("1"); const [max, setMax] = useState("100"); const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false); const [sorted, setSorted] = useState(false);
  const [nums, setNums] = useState<number[]>([]);
  function roll() {
    const lo = Math.min(+min, +max), hi = Math.max(+min, +max), n = Math.min(Math.max(+count || 1, 1), 10000);
    const range = hi - lo + 1; const out: number[] = [];
    if (unique && n > range) { setNums([]); return; }
    const seen = new Set<number>();
    while (out.length < n) { const r = lo + Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * range); if (unique) { if (seen.has(r)) continue; seen.add(r); } out.push(r); }
    setNums(sorted ? [...out].sort((a, b) => a - b) : out);
  }
  return (
    <div className="max-w-2xl">
      <div className="card p-5">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="label" htmlFor="a">Min</label><input id="a" type="number" className="field mt-1" value={min} onChange={(e) => setMin(e.target.value)} /></div>
          <div><label className="label" htmlFor="b">Max</label><input id="b" type="number" className="field mt-1" value={max} onChange={(e) => setMax(e.target.value)} /></div>
          <div><label className="label" htmlFor="c">How many</label><input id="c" type="number" min={1} max={10000} className="field mt-1" value={count} onChange={(e) => setCount(e.target.value)} /></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats</label><label className="flex items-center gap-2"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort ascending</label></div>
        <div className="mt-4 flex gap-2"><button className="btn btn-primary" onClick={roll}><Dices size={15} /> Generate</button>{nums.length > 0 && <CopyButton text={nums.join(", ")} />}</div>
      </div>
      {nums.length > 0 && <div className="card mt-4 p-5">{nums.length === 1 ? <p className="text-center text-6xl font-bold tabular-nums text-brand-600">{nums[0]}</p> : <p className="break-words font-mono text-sm leading-relaxed">{nums.join(", ")}</p>}</div>}
      {unique && +count > Math.abs(+max - +min) + 1 && <p className="mt-2 text-sm text-red-600">Not enough unique numbers in that range.</p>}
    </div>
  );
}
