"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [list, setList] = useState<string[]>([]);

  function generate(n = count) {
    setList(Array.from({ length: Math.min(Math.max(n, 1), 500) }, () => crypto.randomUUID()));
  }
  useEffect(() => { generate(5); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const shown = list.map((u) => (hyphens ? u : u.replace(/-/g, ""))).map((u) => (upper ? u.toUpperCase() : u));

  return (
    <div className="max-w-3xl">
      <div className="card p-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="label" htmlFor="n">Quantity</label>
          <input id="n" type="number" min={1} max={500} className="field mt-1 w-28" value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
        <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} /> Hyphens</label>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-primary" onClick={() => generate()}><RefreshCw size={15} /> Generate</button>
          <CopyButton text={shown.join("\n")} label="Copy all" />
        </div>
      </div>
      <ul className="card mt-4 divide-y divide-slate-200 dark:divide-slate-800 max-h-[32rem] overflow-auto">
        {shown.map((u, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-2">
            <code className="flex-1 font-mono text-sm">{u}</code>
            <CopyButton text={u} label="" className="btn-ghost h-8 w-8 px-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
