"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "../pdf/_Result";
import { downloadBlob, baseName } from "@/lib/files";

export default function WordToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<Blob | null>(null);
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(f: File) {
    setFile(f); setErr(""); setOut(null); setBusy(true);
    try {
      const mammoth = await import("mammoth");
      const XLSX = await import("xlsx");
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await f.arrayBuffer() });
      const doc = new DOMParser().parseFromString(html, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));
      const wb = XLSX.utils.book_new();
      if (tables.length) {
        tables.forEach((t, i) => XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(t), `Table ${i + 1}`));
        setInfo(`${tables.length} table${tables.length > 1 ? "s" : ""} found → one sheet each`);
      } else {
        const paras = Array.from(doc.querySelectorAll("p,h1,h2,h3,li")).map((p) => [p.textContent?.trim() ?? ""]).filter((r) => r[0]);
        if (!paras.length) throw new Error("No tables or text found in this document.");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Text"], ...paras]), "Text");
        setInfo("No tables found; paragraphs were placed one per row instead.");
      }
      setOut(new Blob([XLSX.write(wb, { type: "array", bookType: "xlsx" })]));
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept=".docx" label="Drop a Word (.docx) file here or click to choose" hint="Tables in the document become Excel sheets" onFiles={(f) => run(f[0])} /> : (
        <div className="card p-4"><p className="font-medium">{file.name}</p>{busy && <p className="mt-1 text-sm text-slate-500">Converting…</p>}{info && <p className="mt-1 text-sm text-slate-500">{info}</p>}{err && <><p className="mt-2 text-sm text-red-600">{err}</p><button className="btn mt-3" onClick={() => setFile(null)}>Try another file</button></>}</div>
      )}
      {out && <Result after={out.size} label="Download .xlsx" onDownload={() => downloadBlob(out, `${baseName(file!.name)}.xlsx`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
