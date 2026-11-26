"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Pane from "@/components/Pane";
const sample = `// Example\nfunction greet(name) {\n  const message = "Hello, " + name + "!";\n  console.log(message);\n  return message;\n}\ngreet("DevKitly");`;
export default function JsMinifier() {
  const [input, setInput] = useState(""); const [output, setOutput] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [mangle, setMangle] = useState(true);
  async function run() {
    setBusy(true); setErr("");
    try { const { minify } = await import("terser"); const r = await minify(input, { mangle, compress: true, format: { comments: false } }); setOutput(r.code ?? ""); }
    catch (e) { setErr((e as Error).message); setOutput(""); }
    setBusy(false);
  }
  const pct = input && output ? Math.round((1 - output.length / input.length) * 100) : 0;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={run} disabled={!input || busy}>{busy && <Loader2 size={15} className="animate-spin" />} Minify JavaScript</button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={mangle} onChange={(e) => setMangle(e.target.checked)} /> Shorten variable names (mangle)</label>
        {output && <span className="text-sm text-green-600">{pct}% smaller</span>}
        <button className="btn btn-ghost ml-auto" onClick={() => setInput(sample)}>Load sample</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2"><Pane title="JavaScript" value={input} onChange={setInput} error={err} accept=".js,.mjs" placeholder="Paste JavaScript…" /><Pane title="Minified" value={output} readOnly filename="script.min.js" /></div>
    </div>
  );
}
