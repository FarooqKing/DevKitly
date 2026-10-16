"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, baseName } from "@/lib/files";

type Pos = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right";

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState<Pos>("bottom-center");
  const [format, setFormat] = useState("{n}");
  const [start, setStart] = useState(1);
  const [size, setSize] = useState(11);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");

  async function run() {
    if (!file) return; setErr("");
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const label = format.replace("{n}", String(i + start)).replace("{total}", String(pages.length + start - 1));
        const { width, height } = page.getSize(); const tw = font.widthOfTextAtSize(label, size);
        const x = pos.endsWith("center") ? (width - tw) / 2 : pos.endsWith("right") ? width - tw - 36 : 36;
        const y = pos.startsWith("bottom") ? 24 : height - 24 - size;
        page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
      });
      setOut(await doc.save());
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Stamp page numbers onto every page" onFiles={(f) => setFile(f[0])} /> : (
        <div className="card p-4 space-y-4">
          <p className="font-medium">{file.name}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="p">Position</label>
              <select id="p" className="field mt-1" value={pos} onChange={(e) => { setPos(e.target.value as Pos); setOut(null); }}>
                <option value="bottom-center">Bottom center</option><option value="bottom-right">Bottom right</option><option value="bottom-left">Bottom left</option><option value="top-center">Top center</option><option value="top-right">Top right</option>
              </select></div>
            <div><label className="label" htmlFor="f">Format</label>
              <select id="f" className="field mt-1" value={format} onChange={(e) => { setFormat(e.target.value); setOut(null); }}>
                <option value="{n}">1, 2, 3</option><option value="Page {n}">Page 1</option><option value="{n} / {total}">1 / 10</option><option value="Page {n} of {total}">Page 1 of 10</option>
              </select></div>
            <div><label className="label" htmlFor="st">Start at</label><input id="st" type="number" min={0} className="field mt-1" value={start} onChange={(e) => { setStart(+e.target.value); setOut(null); }} /></div>
            <div><label className="label" htmlFor="sz">Font size</label><input id="sz" type="number" min={6} max={36} className="field mt-1" value={size} onChange={(e) => { setSize(+e.target.value); setOut(null); }} /></div>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {!out && <button className="btn btn-primary" onClick={run}>Add page numbers</button>}
        </div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, `${baseName(file!.name)}-numbered.pdf`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
