"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "../pdf/_Result";
import { downloadBlob, baseName } from "@/lib/files";

export default function ExcelToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<Blob | null>(null);
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(f: File) {
    setFile(f); setErr(""); setOut(null); setBusy(true);
    try {
      const XLSX = await import("xlsx");
      const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, WidthType, TextRun } = await import("docx");
      const wb = f.name.endsWith(".csv") || f.name.endsWith(".tsv") ? XLSX.read(await f.text(), { type: "string" }) : XLSX.read(await f.arrayBuffer(), { type: "array" });
      const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];
      let tables = 0;
      for (const name of wb.SheetNames) {
        const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: "" });
        if (!rows.length) continue;
        tables++;
        if (wb.SheetNames.length > 1) children.push(new Paragraph({ text: name, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }));
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows.slice(0, 2000).map((r, ri) => new TableRow({ tableHeader: ri === 0, children: r.map((c) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(c ?? ""), bold: ri === 0 })] })] })) })),
        }));
        children.push(new Paragraph(""));
      }
      if (!tables) throw new Error("No data found in this file.");
      const doc = new Document({ sections: [{ children }] });
      setOut(await Packer.toBlob(doc)); setInfo(`${tables} sheet${tables > 1 ? "s" : ""} converted to Word tables`);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept=".xlsx,.xls,.csv,.tsv" label="Drop an Excel or CSV file here or click to choose" hint="Each sheet becomes a formatted table in a Word document" onFiles={(f) => run(f[0])} /> : (
        <div className="card p-4"><p className="font-medium">{file.name}</p>{busy && <p className="mt-1 text-sm text-slate-500">Converting…</p>}{info && <p className="mt-1 text-sm text-slate-500">{info}</p>}{err && <><p className="mt-2 text-sm text-red-600">{err}</p><button className="btn mt-3" onClick={() => setFile(null)}>Try another file</button></>}</div>
      )}
      {out && <Result after={out.size} label="Download .docx" onDownload={() => downloadBlob(out, `${baseName(file!.name)}.docx`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
