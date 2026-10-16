"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, baseName } from "@/lib/files";

export default function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");

  async function run(f: File) {
    setFile(f); setErr(""); setOut(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const doc = await PDFDocument.create();
      (await doc.copyPages(src, src.getPageIndices())).forEach((p) => doc.addPage(p));
      setOut(await doc.save());
    } catch {
      setErr("This PDF needs a password to open (user password). Only permission restrictions (printing, copying, editing) can be removed here.");
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a restricted PDF here or click to choose" hint="Removes printing, copying and editing restrictions" onFiles={(f) => run(f[0])} /> : (
        <div className="card p-4"><p className="font-medium">{file.name}</p>{err && <p className="mt-2 text-sm text-red-600">{err}</p>}{err && <button className="btn mt-3" onClick={() => setFile(null)}>Try another file</button>}</div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, `${baseName(file!.name)}-unlocked.pdf`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
