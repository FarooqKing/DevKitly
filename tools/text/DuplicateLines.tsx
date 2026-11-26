"use client";
import { useMemo, useState } from "react";
import Pane from "@/components/Pane";

export default function DuplicateLines() {
  const [input, setInput] = useState("");
  const [caseIns, setCaseIns] = useState(false); const [trim, setTrim] = useState(true);
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none"); const [blank, setBlank] = useState(true);
  const r = useMemo(() => {
    let lines = input.split("\n"); if (trim) lines = lines.map((l) => l.trim()); if (blank) lines = lines.filter((l) => l);
    const seen = new Set<string>(); const out: string[] = []; let dup = 0;
    for (const l of lines) { const k = caseIns ? l.toLowerCase() : l; if (seen.has(k)) { dup++; continue; } seen.add(k); out.push(l); }
    if (sort !== "none") out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }) * (sort === "asc" ? 1 : -1));
    return { text: out.join("\n"), dup, kept: out.length };
  }, [input, caseIns, trim, sort, blank]);
  return (
    <div>
      <div className="card mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 p-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={caseIns} onChange={(e) => setCaseIns(e.target.checked)} /> Ignore case</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim lines</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={blank} onChange={(e) => setBlank(e.target.checked)} /> Remove blank lines</label>
        <div className="seg"><button aria-pressed={sort === "none"} onClick={() => setSort("none")}>Keep order</button><button aria-pressed={sort === "asc"} onClick={() => setSort("asc")}>Sort A→Z</button><button aria-pressed={sort === "desc"} onClick={() => setSort("desc")}>Sort Z→A</button></div>
        {input && <span className="ml-auto text-slate-500">{r.dup} duplicates removed · {r.kept} lines kept</span>}
      </div>
      <div className="grid gap-4 lg:grid-cols-2"><Pane title="Input" value={input} onChange={setInput} placeholder="One item per line…" /><Pane title="Unique lines" value={r.text} readOnly filename="unique.txt" /></div>
    </div>
  );
}
