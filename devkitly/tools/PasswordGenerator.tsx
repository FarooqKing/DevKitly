"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";

const sets = { lower: "abcdefghijklmnopqrstuvwxyz", upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", digits: "0123456789", symbols: "!@#$%^&*()-_=+[]{};:,.<>?" };
const labels: Record<keyof typeof sets, string> = { lower: "Lowercase (a-z)", upper: "Uppercase (A-Z)", digits: "Numbers (0-9)", symbols: "Symbols (!@#…)" };

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [pw, setPw] = useState("");

  function generate() {
    const pool = (Object.keys(sets) as (keyof typeof sets)[]).filter((k) => opts[k]).map((k) => sets[k]).join("");
    if (!pool) return setPw("");
    const bytes = crypto.getRandomValues(new Uint32Array(length));
    setPw(Array.from(bytes, (b) => pool[b % pool.length]).join(""));
  }
  useEffect(() => { generate(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [length, opts]);

  const poolSize = (Object.keys(sets) as (keyof typeof sets)[]).filter((k) => opts[k]).reduce((n, k) => n + sets[k].length, 0);
  const entropy = poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  const strength = entropy < 40 ? ["Weak", "bg-red-500", 25] : entropy < 60 ? ["Fair", "bg-amber-500", 50] : entropy < 80 ? ["Strong", "bg-green-500", 75] : ["Very strong", "bg-green-600", 100];

  return (
    <div className="max-w-2xl">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all font-mono text-lg">{pw || <span className="text-slate-400">Select at least one character set</span>}</code>
          <button className="btn-icon" onClick={generate} title="Regenerate"><RefreshCw size={16} /></button>
          <CopyButton text={pw} className="btn-primary" />
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-full ${strength[1]} transition-all`} style={{ width: `${strength[2]}%` }} /></div>
        <p className="mt-1.5 text-xs text-slate-500">{strength[0]} · {entropy} bits of entropy</p>
      </div>
      <div className="card mt-4 p-4">
        <label className="flex items-center justify-between text-sm font-medium" htmlFor="len">Length <span className="font-mono">{length}</span></label>
        <input id="len" type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {(Object.keys(sets) as (keyof typeof sets)[]).map((k) => (
            <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={opts[k]} onChange={() => setOpts((o) => ({ ...o, [k]: !o[k] }))} /> {labels[k]}</label>
          ))}
        </div>
      </div>
    </div>
  );
}
