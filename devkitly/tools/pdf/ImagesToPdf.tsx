"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import FileList from "@/components/FileList";
import Result from "./_Result";
import { downloadBlob } from "@/lib/files";

type Size = "fit" | "a4" | "letter";
const sizes: Record<Exclude<Size, "fit">, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };

async function toPngBytes(file: File): Promise<ArrayBuffer> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
  c.getContext("2d")!.drawImage(img, 0, 0); URL.revokeObjectURL(url);
  const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
  return blob.arrayBuffer();
}

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<Size>("fit");
  const [landscape, setLandscape] = useState(false);
  const [margin, setMargin] = useState(20);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      for (const f of files) {
        const img = f.type === "image/jpeg" ? await doc.embedJpg(await f.arrayBuffer()) : f.type === "image/png" ? await doc.embedPng(await f.arrayBuffer()) : await doc.embedPng(await toPngBytes(f));
        let pw = img.width, ph = img.height;
        if (size !== "fit") { [pw, ph] = sizes[size]; if (landscape) [pw, ph] = [ph, pw]; }
        const page = doc.addPage([pw, ph]);
        const m = size === "fit" ? 0 : margin;
        const s = Math.min((pw - 2 * m) / img.width, (ph - 2 * m) / img.height, size === "fit" ? 1 : Infinity);
        const w = img.width * s, h = img.height * s;
        page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }
      setOut(await doc.save());
    } catch (e) { setErr(`Could not build PDF: ${(e as Error).message}`); }
    setBusy(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      <FileDrop accept="image/*" multiple label="Drop images here or click to choose" hint="JPG, PNG, WebP, GIF, BMP · arrange the order below" onFiles={(f) => { setFiles((p) => [...p, ...f]); setOut(null); }} compact={files.length > 0} />
      <FileList files={files} onChange={(f) => { setFiles(f); setOut(null); }} reorder />
      {files.length > 0 && (
        <div className="card flex flex-wrap items-end gap-5 p-4">
          <div><p className="label">Page size</p><div className="seg mt-1.5"><button aria-pressed={size === "fit"} onClick={() => setSize("fit")}>Fit image</button><button aria-pressed={size === "a4"} onClick={() => setSize("a4")}>A4</button><button aria-pressed={size === "letter"} onClick={() => setSize("letter")}>Letter</button></div></div>
          {size !== "fit" && <>
            <div><p className="label">Orientation</p><div className="seg mt-1.5"><button aria-pressed={!landscape} onClick={() => setLandscape(false)}>Portrait</button><button aria-pressed={landscape} onClick={() => setLandscape(true)}>Landscape</button></div></div>
            <div><label className="label" htmlFor="m">Margin: {margin}pt</label><input id="m" type="range" min={0} max={72} value={margin} onChange={(e) => setMargin(+e.target.value)} className="mt-2 block w-40 accent-brand-600" /></div>
          </>}
          {err && <p className="w-full text-sm text-red-600">{err}</p>}
          {!out && <button className="btn btn-primary ml-auto" onClick={run} disabled={busy}>{busy ? "Building…" : "Create PDF"}</button>}
        </div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, "images.pdf")} onReset={() => { setFiles([]); setOut(null); }} />}
    </div>
  );
}
