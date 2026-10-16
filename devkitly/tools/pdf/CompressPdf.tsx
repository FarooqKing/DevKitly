"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "./_Result";
import { downloadBlob, renderPdfPages, baseName } from "@/lib/files";

const presets = [
  { key: "low", label: "Light", desc: "Best quality, smaller savings", scale: 1.6, q: 0.85 },
  { key: "med", label: "Balanced", desc: "Good for email and web", scale: 1.3, q: 0.72 },
  { key: "high", label: "Maximum", desc: "Smallest file, lower quality", scale: 1.0, q: 0.55 },
];

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState("med");
  const [prog, setProg] = useState<[number, number] | null>(null);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");

  async function run() {
    if (!file) return; setErr(""); setProg([0, 1]);
    try {
      const p = presets.find((x) => x.key === preset)!;
      const buf = await file.arrayBuffer();
      const { images } = await renderPdfPages(buf.slice(0), { scale: p.scale, type: "image/jpeg", quality: p.q, onProgress: (d, t) => setProg([d, t]) });
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      for (const img of images) {
        const jpg = await doc.embedJpg(await img.blob.arrayBuffer());
        const page = doc.addPage([img.width / p.scale, img.height / p.scale]);
        page.drawImage(jpg, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      }
      const bytes = await doc.save();
      setOut(bytes.length < file.size ? bytes : new Uint8Array(buf));
    } catch (e) { setErr(`Could not compress: ${(e as Error).message}`); }
    setProg(null);
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Great for scanned documents and image-heavy PDFs" onFiles={(f) => setFile(f[0])} /> : (
        <div className="card p-4 space-y-4">
          <p className="font-medium">{file.name}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {presets.map((p) => (
              <button key={p.key} onClick={() => setPreset(p.key)} aria-pressed={preset === p.key} className={`rounded-lg border p-3 text-left text-sm transition ${preset === p.key ? "border-brand-600 bg-brand-50 dark:bg-brand-600/10" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}>
                <span className="block font-medium">{p.label}</span><span className="text-slate-500">{p.desc}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">Pages are re-encoded as images, so text will no longer be selectable. If the result isn&apos;t smaller, the original is kept.</p>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog ? <Progress value={prog[0] / prog[1]} label={`Processing page ${prog[0]} of ${prog[1]}…`} /> : !out && <button className="btn btn-primary" onClick={run}>Compress PDF</button>}
        </div>
      )}
      {out && file && <Result before={file.size} after={out.length} onDownload={() => downloadBlob(out, `${baseName(file.name)}-compressed.pdf`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
