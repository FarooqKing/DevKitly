"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import FileList from "@/components/FileList";
import Result from "./_Result";
import { downloadBlob } from "@/lib/files";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function merge() {
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
        (await merged.copyPages(src, src.getPageIndices())).forEach((p) => merged.addPage(p));
      }
      setOut(await merged.save());
    } catch (e) { setErr(`Could not merge: ${(e as Error).message}`); }
    setBusy(false);
  }
  const total = files.reduce((n, f) => n + f.size, 0);

  return (
    <div className="max-w-3xl space-y-4">
      <FileDrop accept="application/pdf,.pdf" multiple label="Drop PDF files here or click to choose" hint="Add two or more PDFs, then arrange the order" onFiles={(f) => { setFiles((p) => [...p, ...f]); setOut(null); }} compact={files.length > 0} />
      <FileList files={files} onChange={(f) => { setFiles(f); setOut(null); }} reorder />
      {err && <p className="text-sm text-red-600">{err}</p>}
      {files.length > 0 && !out && <button className="btn btn-primary" onClick={merge} disabled={files.length < 2 || busy}>{busy ? "Merging…" : `Merge ${files.length} PDFs`}</button>}
      {out && <Result before={total} after={out.length} onDownload={() => downloadBlob(out, "merged.pdf")} onReset={() => { setFiles([]); setOut(null); }} />}
    </div>
  );
}
