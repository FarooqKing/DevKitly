"use client";
import { useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, parsePageRanges, pdfPageCount, baseName } from "@/lib/files";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [angle, setAngle] = useState(90);
  const [which, setWhich] = useState<"all" | "some">("all");
  const [ranges, setRanges] = useState("");
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");

  async function run() {
    if (!file) return; setErr("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const idx = which === "all" ? doc.getPageIndices() : parsePageRanges(ranges, pages);
      if (!idx.length) throw new Error("Enter at least one valid page.");
      idx.forEach((i) => { const p = doc.getPage(i); p.setRotation(degrees((p.getRotation().angle + angle) % 360)); });
      setOut(await doc.save());
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Rotate all pages or just the ones you pick" onFiles={async (f) => { setFile(f[0]); setPages(await pdfPageCount(await f[0].arrayBuffer())); }} /> : (
        <div className="card p-4 space-y-4">
          <p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{pages} pages</span></p>
          <div><p className="label">Rotation</p><div className="seg mt-1.5"><button aria-pressed={angle === 90} onClick={() => setAngle(90)}><RotateCw size={14} className="mr-1 inline" />90° right</button><button aria-pressed={angle === 180} onClick={() => setAngle(180)}>180°</button><button aria-pressed={angle === 270} onClick={() => setAngle(270)}><RotateCcw size={14} className="mr-1 inline" />90° left</button></div></div>
          <div><p className="label">Pages</p><div className="seg mt-1.5"><button aria-pressed={which === "all"} onClick={() => setWhich("all")}>All pages</button><button aria-pressed={which === "some"} onClick={() => setWhich("some")}>Specific pages</button></div>
            {which === "some" && <input className="field mt-2 font-mono" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1, 3-5" />}</div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {!out && <button className="btn btn-primary" onClick={run}>Rotate PDF</button>}
        </div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, `${baseName(file!.name)}-rotated.pdf`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
