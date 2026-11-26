"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "../pdf/_Result";
import CopyButton from "@/components/CopyButton";
import { downloadBlob, baseName } from "@/lib/files";

type Out = "xlsx" | "csv" | "json" | "html";

export default function SpreadsheetConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [sheet, setSheet] = useState("");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [out, setOut] = useState<Out>("csv");
  const [result, setResult] = useState<{ data: Blob; text?: string } | null>(null);
  const [err, setErr] = useState("");
  const [wb, setWb] = useState<import("xlsx").WorkBook | null>(null);

  async function pick(f: File) {
    setFile(f); setErr(""); setResult(null);
    try {
      const XLSX = await import("xlsx");
      let book: import("xlsx").WorkBook;
      if (f.name.endsWith(".json")) {
        const json = JSON.parse(await f.text());
        const arr = Array.isArray(json) ? json : Object.values(json).find(Array.isArray) ?? [json];
        book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(arr as object[]), "Sheet1");
        setOut("xlsx");
      } else { book = XLSX.read(await f.arrayBuffer(), { type: "array" }); if (f.name.endsWith(".csv")) setOut("xlsx"); }
      setWb(book); setSheets(book.SheetNames); setSheet(book.SheetNames[0]);
      setRows(XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: "" }));
    } catch (e) { setErr(`Could not read file: ${(e as Error).message}`); }
  }
  async function changeSheet(name: string) { const XLSX = await import("xlsx"); setSheet(name); setRows(XLSX.utils.sheet_to_json(wb!.Sheets[name], { defval: "" })); setResult(null); }

  async function convert() {
    if (!wb) return;
    const XLSX = await import("xlsx"); const ws = wb.Sheets[sheet];
    if (out === "xlsx") { const nb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(nb, ws, sheet.slice(0, 31)); const buf = XLSX.write(nb, { type: "array", bookType: "xlsx" }); setResult({ data: new Blob([buf]) }); }
    else if (out === "csv") { const t = XLSX.utils.sheet_to_csv(ws); setResult({ data: new Blob([t], { type: "text/csv" }), text: t }); }
    else if (out === "json") { const t = JSON.stringify(XLSX.utils.sheet_to_json(ws, { defval: null }), null, 2); setResult({ data: new Blob([t], { type: "application/json" }), text: t }); }
    else { const t = XLSX.utils.sheet_to_html(ws); setResult({ data: new Blob([t], { type: "text/html" }), text: t }); }
  }
  const cols = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className="max-w-4xl space-y-4">
      {!file ? <FileDrop accept=".xlsx,.xls,.xlsm,.csv,.tsv,.json,.ods" label="Drop a spreadsheet here or click to choose" hint="Excel (.xlsx, .xls), CSV, TSV, JSON, ODS → Excel, CSV, JSON or HTML table" onFiles={(f) => pick(f[0])} /> : (
        <div className="card p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium">{file.name}</p>
            {sheets.length > 1 && <select className="field w-auto py-1.5" value={sheet} onChange={(e) => changeSheet(e.target.value)} aria-label="Sheet">{sheets.map((s) => <option key={s}>{s}</option>)}</select>}
            <span className="text-sm text-slate-500">{rows.length} rows · {cols.length} columns</span>
            <button className="btn btn-ghost ml-auto h-8 px-2" onClick={() => { setFile(null); setResult(null); }}>Change file</button>
          </div>
          {rows.length > 0 && (
            <div className="max-h-64 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs"><thead className="sticky top-0 bg-slate-100 dark:bg-slate-800"><tr>{cols.map((c) => <th key={c} className="px-2 py-1.5 font-medium">{c}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{rows.slice(0, 50).map((r, i) => <tr key={i}>{cols.map((c) => <td key={c} className="whitespace-nowrap px-2 py-1">{String(r[c] ?? "")}</td>)}</tr>)}</tbody></table>
              {rows.length > 50 && <p className="bg-slate-50 px-2 py-1 text-xs text-slate-500 dark:bg-slate-900">Showing first 50 of {rows.length} rows</p>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <p className="label">Convert to</p>
            <div className="seg">{(["xlsx", "csv", "json", "html"] as Out[]).map((o) => <button key={o} aria-pressed={out === o} onClick={() => { setOut(o); setResult(null); }}>{o.toUpperCase()}</button>)}</div>
            {!result && <button className="btn btn-primary ml-auto" onClick={convert}>Convert</button>}
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      )}
      {result && file && (
        <Result after={result.data.size} label={`Download .${out}`} onDownload={() => downloadBlob(result.data, `${baseName(file.name)}.${out}`)} onReset={() => { setFile(null); setResult(null); }}>
          {result.text && <div className="mt-4"><div className="mb-1 flex justify-end"><CopyButton text={result.text} className="btn-ghost h-8 px-2" /></div><pre className="max-h-64 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-xs dark:bg-slate-950">{result.text.slice(0, 20000)}</pre></div>}
        </Result>
      )}
    </div>
  );
}
