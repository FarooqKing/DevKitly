"use client";
import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
async function digest(algo: string, data: ArrayBuffer) {
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [upper, setUpper] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = file ? await file.arrayBuffer() : new TextEncoder().encode(input).buffer;
      if (!file && !input) return setHashes({});
      const pairs = await Promise.all(algos.map(async (a) => [a, await digest(a, data)] as const));
      if (!cancelled) setHashes(Object.fromEntries(pairs));
    })();
    return () => { cancelled = true; };
  }, [input, file]);

  return (
    <div className="max-w-3xl">
      <textarea className="textarea h-36" value={input} onChange={(e) => { setInput(e.target.value); setFile(null); }} placeholder="Type or paste text to hash…" disabled={!!file} />
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="btn cursor-pointer">Hash a file instead<input type="file" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setInput(""); }} /></label>
        {file && <span className="text-slate-500">{file.name} ({(file.size / 1024).toFixed(1)} KB) <button className="ml-1 underline" onClick={() => setFile(null)}>remove</button></span>}
        <label className="ml-auto flex items-center gap-2"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
      </div>
      <div className="mt-6 space-y-3">
        {algos.map((a) => {
          const h = hashes[a] ? (upper ? hashes[a].toUpperCase() : hashes[a]) : "";
          return (
            <div key={a} className="card p-3">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">{a}</span><CopyButton text={h} className="btn-ghost h-8 px-2" /></div>
              <code className="mt-1 block break-all font-mono text-sm text-slate-700 dark:text-slate-300 min-h-[1.25rem]">{h || <span className="text-slate-400">Waiting for input…</span>}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
