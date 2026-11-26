"use client";
import { useMemo, useState } from "react";
import Pane from "@/components/Pane";

const ops = [["trim", "Trim each line"], ["spaces", "Collapse multiple spaces"], ["blank", "Remove blank lines"], ["tabs", "Tabs → spaces"], ["nbsp", "Fix non-breaking spaces"], ["linebreaks", "Join lines into one paragraph"]] as const;

export default function TextCleaner() {
  const [input, setInput] = useState("");
  const [on, setOn] = useState<Record<string, boolean>>({ trim: true, spaces: true, blank: false, tabs: false, nbsp: true, linebreaks: false });
  const output = useMemo(() => {
    let t = input;
    if (on.nbsp) t = t.replace(/\u00a0/g, " ");
    if (on.tabs) t = t.replace(/\t/g, "  ");
    if (on.linebreaks) t = t.replace(/\s*\n+\s*/g, " ");
    if (on.spaces) t = t.replace(/[ \t]{2,}/g, " ");
    if (on.trim) t = t.split("\n").map((l) => l.trim()).join("\n");
    if (on.blank) t = t.split("\n").filter((l) => l.trim()).join("\n");
    return t;
  }, [input, on]);
  return (
    <div>
      <div className="card mb-4 flex flex-wrap gap-x-5 gap-y-2 p-3 text-sm">{ops.map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={on[k]} onChange={() => setOn((o) => ({ ...o, [k]: !o[k] }))} /> {l}</label>)}</div>
      <div className="grid gap-4 lg:grid-cols-2"><Pane title="Input" value={input} onChange={setInput} placeholder="Paste messy text…" /><Pane title="Cleaned" value={output} readOnly filename="cleaned.txt" /></div>
    </div>
  );
}
