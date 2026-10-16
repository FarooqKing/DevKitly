"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, parsePageRanges, pdfPageCount, baseName } from "@/lib/files";

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [ranges, setRanges] = useState("");
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");
  const toDelete = parsePageRanges(ranges, pages);

  async function run() {
    if (!file) return; setErr("");
    try {
      if (!toDelete.length) throw new Error("Enter the pages to remove.");
      if (toDelete.length >= pages) throw new Error("You can't remove every page.");
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      [...toDelete].reverse().forEach((i) => doc.removePage(i));
      setOut(await doc.save());
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Remove blank, duplicate or unwanted pages" onFiles={async (f) => { setFile(f[0]); setPages(await pdfPageCount(await f[0].arrayBuffer())); }} /> : (
        <div className="card p-4 space-y-3">
          <p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{pages} pages</span></p>
          <div><label className="label" htmlFor="d">Pages to remove</label><input id="d" className="field mt-1 font-mono" value={ranges} onChange={(e) => { setRanges(e.target.value); setOut(null); }} placeholder="e.g. 2, 5-7" />
            {toDelete.length > 0 && <p className="mt-1 text-sm text-slate-500">Removing {toDelete.length} page{toDelete.length > 1 ? "s" : ""}; {pages - toDelete.length} will remain.</p>}</div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {!out && <button className="btn btn-primary" onClick={run}>Remove pages</button>}
        </div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, `${baseName(file!.name)}-edited.pdf`)} onReset={() => { setFile(null); setOut(null); setRanges(""); }} />}
    </div>
  );
}
