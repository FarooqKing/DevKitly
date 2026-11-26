"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import FileDrop from "@/components/FileDrop";
import CopyButton from "@/components/CopyButton";
import { downloadZip } from "@/lib/files";

const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];
async function resize(img: HTMLImageElement, s: number, radius: number, bg: string): Promise<Blob> {
  const c = document.createElement("canvas"); c.width = s; c.height = s; const x = c.getContext("2d")!;
  if (bg !== "transparent") { x.fillStyle = bg; x.fillRect(0, 0, s, s); }
  if (radius) { const r = (s * radius) / 100; x.beginPath(); x.roundRect(0, 0, s, s, r); x.clip(); }
  const m = Math.min(img.naturalWidth, img.naturalHeight); x.imageSmoothingQuality = "high";
  x.drawImage(img, (img.naturalWidth - m) / 2, (img.naturalHeight - m) / 2, m, m, 0, 0, s, s);
  return new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
}
// Minimal ICO container with PNG entries
function makeIco(pngs: { size: number; buf: ArrayBuffer }[]) {
  const header = 6 + 16 * pngs.length; let offset = header; const parts: ArrayBuffer[] = [];
  const h = new DataView(new ArrayBuffer(header)); h.setUint16(0, 0, true); h.setUint16(2, 1, true); h.setUint16(4, pngs.length, true);
  pngs.forEach((p, i) => { const o = 6 + i * 16; h.setUint8(o, p.size >= 256 ? 0 : p.size); h.setUint8(o + 1, p.size >= 256 ? 0 : p.size); h.setUint8(o + 2, 0); h.setUint8(o + 3, 0); h.setUint16(o + 4, 1, true); h.setUint16(o + 6, 32, true); h.setUint32(o + 8, p.buf.byteLength, true); h.setUint32(o + 12, offset, true); offset += p.buf.byteLength; parts.push(p.buf); });
  return new Blob([h.buffer, ...parts], { type: "image/x-icon" });
}

export default function FaviconGenerator() {
  const [src, setSrc] = useState(""); const [radius, setRadius] = useState(0); const [bg, setBg] = useState("transparent"); const [busy, setBusy] = useState(false);
  const html = `<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`;
  async function generate() {
    setBusy(true);
    const img = await new Promise<HTMLImageElement>((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
    const files: { name: string; data: Blob }[] = [];
    const icoParts: { size: number; buf: ArrayBuffer }[] = [];
    for (const s of sizes) { const b = await resize(img, s, radius, bg); const name = s === 180 ? "apple-touch-icon.png" : s === 192 ? "android-chrome-192x192.png" : s === 512 ? "android-chrome-512x512.png" : `favicon-${s}x${s}.png`; files.push({ name, data: b }); if ([16, 32, 48].includes(s)) icoParts.push({ size: s, buf: await b.arrayBuffer() }); }
    files.push({ name: "favicon.ico", data: makeIco(icoParts) });
    files.push({ name: "site.webmanifest", data: new Blob([JSON.stringify({ name: "", short_name: "", icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }, { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }], theme_color: "#ffffff", background_color: "#ffffff", display: "standalone" }, null, 2)]) });
    files.push({ name: "README.txt", data: new Blob([`Upload all files to the root of your website, then add to <head>:\n\n${html}`]) });
    await downloadZip(files, "favicons.zip"); setBusy(false);
  }
  return (
    <div className="max-w-3xl space-y-4">
      {!src ? <FileDrop accept="image/*" label="Drop a square logo (PNG/SVG/JPG, 512px or larger)" hint="Generates favicon.ico, PNGs for all sizes, Apple touch icon and manifest" onFiles={(f) => { const r = new FileReader(); r.onload = () => setSrc(r.result as string); r.readAsDataURL(f[0]); }} /> : (
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="flex items-end gap-3">{[64, 32, 16].map((s) => <img key={s} src={src} alt="" width={s} height={s} style={{ borderRadius: `${radius}%`, background: bg }} className="object-cover" />)}</div>
            <div className="flex-1 space-y-3">
              <div><label className="label" htmlFor="r">Corner radius: {radius}%</label><input id="r" type="range" min={0} max={50} value={radius} onChange={(e) => setRadius(+e.target.value)} className="mt-1 w-full accent-brand-600" /></div>
              <div className="flex items-center gap-3"><p className="label">Background</p><div className="seg"><button aria-pressed={bg === "transparent"} onClick={() => setBg("transparent")}>Transparent</button><button aria-pressed={bg !== "transparent"} onClick={() => setBg("#ffffff")}>Color</button></div>{bg !== "transparent" && <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-10 rounded border border-slate-300" aria-label="Background" />}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2"><button className="btn btn-primary" onClick={generate} disabled={busy}><Download size={15} /> {busy ? "Generating…" : "Download favicon package (ZIP)"}</button><button className="btn" onClick={() => setSrc("")}>Change image</button></div>
          <div className="mt-5"><div className="flex items-center justify-between"><span className="label">Add to your &lt;head&gt;</span><CopyButton text={html} className="btn-ghost h-8 px-2" /></div><pre className="mt-1 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-xs dark:bg-slate-950">{html}</pre></div>
        </div>
      )}
    </div>
  );
}
