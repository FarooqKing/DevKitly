"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, downloadZip, parsePageRanges, pdfPageCount, baseName } from "@/lib/files";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<"ranges" | "every" | "extract">("extract");
  const [ranges, setRanges] = useState("");
  const [outs, setOuts] = useState<{ name: string; data: Uint8Array }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(f: File) { setFile(f); setOuts(null); setErr(""); try { setPages(await pdfPageCount(await f.arrayBuffer())); } catch { setErr("Could not read this PDF."); } }

  async function run() {
    if (!file) return; setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const name = baseName(file.name);
      const make = async (idx: number[]) => { const d = await PDFDocument.create(); (await d.copyPages(src, idx)).forEach((p) => d.addPage(p)); return d.save(); };
      let result: { name: string; data: Uint8Array }[] = [];
      if (mode === "every") result = await Promise.all(src.getPageIndices().map(async (i) => ({ name: `${name}-page-${i + 1}.pdf`, data: await make([i]) })));
      else if (mode === "extract") { const idx = parsePageRanges(ranges, pages); if (!idx.length) throw new Error("Enter at least one valid page or range."); result = [{ name: `${name}-pages.pdf`, data: await make(idx) }]; }
      else { const parts = ranges.split(",").map((s) => s.trim()).filter(Boolean); if (!parts.length) throw new Error("Enter ranges like 1-3, 4-6."); result = await Promise.all(parts.map(async (r, i) => ({ name: `${name}-part-${i + 1}.pdf`, data: await make(parsePageRanges(r, pages)) }))); }
      setOuts(result);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Extract pages, split into parts, or save every page separately" onFiles={(f) => pick(f[0])} /> : (
        <div className="card p-4">
          <p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{pages} pages</span></p>
          <div className="seg mt-4"><button aria-pressed={mode === "extract"} onClick={() => setMode("extract")}>Extract pages</button><button aria-pressed={mode === "ranges"} onClick={() => setMode("ranges")}>Split by ranges</button><button aria-pressed={mode === "every"} onClick={() => setMode("every")}>Every page</button></div>
          {mode !== "every" && (
            <div className="mt-3">
              <label className="label" htmlFor="r">{mode === "extract" ? "Pages to keep (one new PDF)" : "Ranges, comma separated (one PDF each)"}</label>
              <input id="r" className="field mt-1 font-mono" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder={mode === "extract" ? "e.g. 1-3, 7, 10-12" : "e.g. 1-3, 4-6, 7-10"} />
            </div>
          )}
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          {!outs && <button className="btn btn-primary mt-4" onClick={run} disabled={busy}>{busy ? "Working…" : "Split PDF"}</button>}
        </div>
      )}
      {outs && <Result after={outs.reduce((n, o) => n + o.data.length, 0)} label={outs.length > 1 ? `Download ${outs.length} files (ZIP)` : "Download PDF"}
        onDownload={() => (outs.length > 1 ? downloadZip(outs, `${baseName(file!.name)}-split.zip`) : downloadBlob(outs[0].data, outs[0].name))} onReset={() => { setFile(null); setOuts(null); setRanges(""); }} />}
    </div>
  );
}
