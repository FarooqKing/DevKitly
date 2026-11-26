"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

function slugify(s: string, sep: string, lower: boolean) {
  let t = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); if (lower) t = t.toLowerCase();
  const e = sep === "-" ? "\\-" : "_";
  return t.replace(/[^a-zA-Z0-9]+/g, sep).replace(new RegExp(`^${e}+|${e}+$`, "g"), "").replace(new RegExp(`${e}{2,}`, "g"), sep);
}
export default function SlugGenerator() {
  const [input, setInput] = useState("How to Merge PDF Files Online — Free & Fast!");
  const [sep, setSep] = useState("-"); const [lower, setLower] = useState(true);
  const lines = useMemo(() => input.split("\n").filter((l) => l.trim()).map((l) => slugify(l, sep, lower)), [input, sep, lower]);
  return (
    <div className="max-w-3xl">
      <label className="label" htmlFor="s">Title or text (one per line for bulk)</label>
      <textarea id="s" className="textarea mt-1 h-28 font-sans" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <div className="seg"><button aria-pressed={sep === "-"} onClick={() => setSep("-")}>hyphen-case</button><button aria-pressed={sep === "_"} onClick={() => setSep("_")}>underscore_case</button></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> Lowercase</label>
      </div>
      <div className="card mt-4 p-4">
        <div className="flex items-center justify-between"><span className="label">Slug{lines.length > 1 ? "s" : ""}</span><CopyButton text={lines.join("\n")} className="btn-ghost h-8 px-2" /></div>
        <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-lg text-brand-700 dark:text-brand-500">{lines.join("\n") || "…"}</pre>
        {lines.length === 1 && <p className="mt-2 text-xs text-slate-500">{lines[0].length} characters · https://example.com/blog/{lines[0]}</p>}
      </div>
    </div>
  );
}
