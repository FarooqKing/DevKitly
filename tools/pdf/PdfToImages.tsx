"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "./_Result";
import { downloadBlob, downloadZip, renderPdfPages, baseName } from "@/lib/files";

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"image/png" | "image/jpeg">("image/png");
  const [scale, setScale] = useState(2);
  const [prog, setProg] = useState<[number, number] | null>(null);
  const [imgs, setImgs] = useState<{ blob: Blob; url: string }[] | null>(null);
  const [err, setErr] = useState("");

  async function run() {
    if (!file) return; setErr(""); setProg([0, 1]);
    try {
      const { images } = await renderPdfPages(await file.arrayBuffer(), { scale, type, quality: 0.9, onProgress: (d, t) => setProg([d, t]) });
      setImgs(images.map((i) => ({ blob: i.blob, url: URL.createObjectURL(i.blob) })));
    } catch (e) { setErr(`Could not convert: ${(e as Error).message}`); }
    setProg(null);
  }
  const ext = type === "image/png" ? "png" : "jpg";

  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="application/pdf,.pdf" label="Drop a PDF here or click to choose" hint="Each page becomes a PNG or JPG image" onFiles={(f) => setFile(f[0])} /> : (
        <div className="card p-4 space-y-4">
          <p className="font-medium">{file.name}</p>
          <div className="flex flex-wrap gap-6">
            <div><p className="label">Format</p><div className="seg mt-1.5"><button aria-pressed={type === "image/png"} onClick={() => setType("image/png")}>PNG</button><button aria-pressed={type === "image/jpeg"} onClick={() => setType("image/jpeg")}>JPG</button></div></div>
            <div><p className="label">Resolution</p><div className="seg mt-1.5"><button aria-pressed={scale === 1} onClick={() => setScale(1)}>72 dpi</button><button aria-pressed={scale === 2} onClick={() => setScale(2)}>144 dpi</button><button aria-pressed={scale === 3} onClick={() => setScale(3)}>216 dpi</button></div></div>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog ? <Progress value={prog[0] / prog[1]} label={`Rendering page ${prog[0]} of ${prog[1]}…`} /> : !imgs && <button className="btn btn-primary" onClick={run}>Convert to images</button>}
        </div>
      )}
      {imgs && file && (
        <Result after={imgs.reduce((n, i) => n + i.blob.size, 0)} label={imgs.length > 1 ? `Download all (ZIP)` : `Download ${ext.toUpperCase()}`}
          onDownload={() => (imgs.length > 1 ? downloadZip(imgs.map((i, n) => ({ name: `${baseName(file.name)}-${n + 1}.${ext}`, data: i.blob })), `${baseName(file.name)}-images.zip`) : downloadBlob(imgs[0].blob, `${baseName(file.name)}.${ext}`))}
          onReset={() => { imgs.forEach((i) => URL.revokeObjectURL(i.url)); setImgs(null); setFile(null); }}>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {imgs.map((i, n) => (
              <a key={n} href={i.url} download={`${baseName(file.name)}-${n + 1}.${ext}`} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.url} alt={`Page ${n + 1}`} className="aspect-[3/4] w-full rounded border border-slate-200 object-cover object-top dark:border-slate-700" />
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[10px] text-white">{n + 1}</span>
              </a>
            ))}
          </div>
        </Result>
      )}
    </div>
  );
}
