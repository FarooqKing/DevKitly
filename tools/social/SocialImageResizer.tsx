"use client";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import FileDrop from "@/components/FileDrop";
const presets = [
  ["Instagram", [["Post (square)", 1080, 1080], ["Post (portrait)", 1080, 1350], ["Story / Reel", 1080, 1920], ["Profile", 320, 320]]],
  ["Facebook", [["Post", 1200, 630], ["Cover", 820, 312], ["Profile", 170, 170], ["Story", 1080, 1920]]],
  ["YouTube", [["Thumbnail", 1280, 720], ["Channel banner", 2560, 1440], ["Profile", 800, 800]]],
  ["Twitter / X", [["Post", 1600, 900], ["Header", 1500, 500], ["Profile", 400, 400]]],
  ["LinkedIn", [["Post", 1200, 627], ["Cover", 1584, 396], ["Company logo", 300, 300]]],
  ["TikTok / WhatsApp", [["TikTok video", 1080, 1920], ["WhatsApp DP", 500, 500], ["WhatsApp status", 1080, 1920]]],
] as const;
export default function SocialImageResizer() {
  const [img, setImg] = useState<HTMLImageElement | null>(null); const [sel, setSel] = useState<[string, number, number]>(["Instagram Post (square)", 1080, 1080]);
  const [fit, setFit] = useState<"cover" | "contain">("cover"); const [bg, setBg] = useState("#ffffff"); const [fmt, setFmt] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (!img || !canvas.current) return; const [, w, h] = sel; const c = canvas.current; c.width = w; c.height = h; const x = c.getContext("2d")!; x.fillStyle = bg; x.fillRect(0, 0, w, h); const s = fit === "cover" ? Math.max(w / img.naturalWidth, h / img.naturalHeight) : Math.min(w / img.naturalWidth, h / img.naturalHeight); const dw = img.naturalWidth * s, dh = img.naturalHeight * s; x.imageSmoothingQuality = "high"; x.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh); }, [img, sel, fit, bg]);
  function download() { const a = document.createElement("a"); a.download = `${sel[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${sel[1]}x${sel[2]}.${fmt === "image/png" ? "png" : "jpg"}`; a.href = canvas.current!.toDataURL(fmt, 0.92); a.click(); }
  return (
    <div className="space-y-4">
      {!img ? <FileDrop accept="image/*" label="Drop an image to resize for social media" hint="JPG, PNG, WebP · resized in your browser" onFiles={(f) => { const i = new Image(); i.onload = () => setImg(i); i.src = URL.createObjectURL(f[0]); }} /> : (
        <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
          <div className="card space-y-4 p-4">
            {presets.map(([net, sizes]) => <div key={net}><p className="label">{net}</p><div className="mt-1.5 flex flex-wrap gap-1.5">{sizes.map(([n, w, h]) => { const name = `${net} ${n}`; return <button key={n} className={`btn h-7 px-2 text-xs ${sel[0] === name ? "btn-primary" : ""}`} onClick={() => setSel([name, w, h])} title={`${w}×${h}`}>{n}</button>; })}</div></div>)}
            <div className="seg w-full"><button className="flex-1" aria-pressed={fit === "cover"} onClick={() => setFit("cover")}>Fill (crop)</button><button className="flex-1" aria-pressed={fit === "contain"} onClick={() => setFit("contain")}>Fit (pad)</button></div>
            <div className="flex items-center gap-3 text-sm"><label className="flex items-center gap-2">Background <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-10 rounded border border-slate-300" /></label><div className="seg ml-auto"><button aria-pressed={fmt === "image/jpeg"} onClick={() => setFmt("image/jpeg")}>JPG</button><button aria-pressed={fmt === "image/png"} onClick={() => setFmt("image/png")}>PNG</button></div></div>
            <button className="btn btn-primary w-full" onClick={download}><Download size={15} /> Download {sel[1]}×{sel[2]}</button>
            <button className="btn w-full" onClick={() => setImg(null)}>Change image</button>
          </div>
          <div className="card flex items-center justify-center p-4"><canvas ref={canvas} className="max-h-[32rem] max-w-full rounded border border-slate-200 dark:border-slate-700" /></div>
        </div>
      )}
    </div>
  );
}
