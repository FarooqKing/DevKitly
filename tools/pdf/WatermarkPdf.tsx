"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Result from "./_Result";
import { downloadBlob, baseName } from "@/lib/files";

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [size, setSize] = useState(60);
  const [opacity, setOpacity] = useState(0.2);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#ff0000");
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [err, setErr] = useState("");

  async function run() {
    if (!file) return; setErr("");
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, size);
        page.drawText(text, { x: width / 2 - (tw / 2) * Math.cos((angle * Math.PI) / 180), y: height / 2 - (tw / 2) * Math.sin((angle * Math.PI) / 180), size, font, color: rgb(r, g, b), opacity, rotate: degrees(angle) });
      }
      setOut(await doc.save());
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Add a diagonal text watermark to every page" onFiles={(f) => setFile(f[0])} /> : (
        <div className="card p-4 space-y-4">
          <p className="font-medium">{file.name}</p>
          <div><label className="label" htmlFor="t">Watermark text</label><input id="t" className="field mt-1" value={text} onChange={(e) => { setText(e.target.value); setOut(null); }} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="label" htmlFor="s">Size: {size}</label><input id="s" type="range" min={20} max={150} value={size} onChange={(e) => { setSize(+e.target.value); setOut(null); }} className="mt-2 w-full accent-brand-600" /></div>
            <div><label className="label" htmlFor="o">Opacity: {Math.round(opacity * 100)}%</label><input id="o" type="range" min={5} max={100} value={opacity * 100} onChange={(e) => { setOpacity(+e.target.value / 100); setOut(null); }} className="mt-2 w-full accent-brand-600" /></div>
            <div><label className="label" htmlFor="a">Angle: {angle}°</label><input id="a" type="range" min={-90} max={90} value={angle} onChange={(e) => { setAngle(+e.target.value); setOut(null); }} className="mt-2 w-full accent-brand-600" /></div>
          </div>
          <div><p className="label">Color</p><div className="mt-1.5 flex items-center gap-2"><input type="color" value={color} onChange={(e) => { setColor(e.target.value); setOut(null); }} className="h-9 w-12 rounded border border-slate-300 dark:border-slate-700" aria-label="Color" /><code className="text-sm">{color}</code></div></div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {!out && <button className="btn btn-primary" onClick={run} disabled={!text}>Add watermark</button>}
        </div>
      )}
      {out && <Result after={out.length} onDownload={() => downloadBlob(out, `${baseName(file!.name)}-watermarked.pdf`)} onReset={() => { setFile(null); setOut(null); }} />}
    </div>
  );
}
