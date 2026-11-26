"use client";
import { useState } from "react";
import TwoPane from "./_TwoPane";

const sample = `{"name":"DevKitly","tools":["json","jwt","regex"],"free":true,"meta":{"version":2,"tags":null}}`;

export default function JsonFormatter({ defaultMode }: { defaultMode?: string } = {}) {
  const [indent, setIndent] = useState<string | number>(2);
  return (
    <TwoPane defaultMode={defaultMode}
      sample={sample}
      filename="formatted.json"
      inputPlaceholder="Paste JSON here…"
      modes={[
        { key: "format", label: "Beautify", run: (s) => JSON.stringify(JSON.parse(s), null, indent) },
        { key: "minify", label: "Minify", run: (s) => JSON.stringify(JSON.parse(s)) },
      ]}
      extraActions={
        <select className="field w-auto py-1.5" value={String(indent)} onChange={(e) => setIndent(e.target.value === "\t" ? "\t" : Number(e.target.value))} aria-label="Indentation">
          <option value="2">2 spaces</option><option value="4">4 spaces</option><option value={"\t"}>Tabs</option>
        </select>
      }
    />
  );
}
