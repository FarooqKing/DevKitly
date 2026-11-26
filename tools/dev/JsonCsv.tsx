"use client";
import TwoPane from "../_TwoPane";
import Papa from "papaparse";
const sample = `[{"name":"Ali","city":"Karachi","age":28},{"name":"Sara","city":"Lahore","age":31}]`;
export default function JsonCsv({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample={sample} filename="converted.txt" inputPlaceholder="Paste JSON array or CSV…" modes={[
    { key: "j2c", label: "JSON → CSV", run: (s) => { const j = JSON.parse(s); const arr = Array.isArray(j) ? j : Object.values(j).find(Array.isArray) ?? [j]; return Papa.unparse(arr as object[]); } },
    { key: "c2j", label: "CSV → JSON", run: (s) => { const r = Papa.parse(s.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true }); if (r.errors.length) throw new Error(r.errors[0].message); return JSON.stringify(r.data, null, 2); } },
  ]} />;
}
