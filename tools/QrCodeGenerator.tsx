"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://devkitly.com");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [dark, setDark] = useState("#0f172a");
  const [light, setLight] = useState("#ffffff");
  const canvas = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!canvas.current) return;
    if (!text) { canvas.current.getContext("2d")?.clearRect(0, 0, size, size); return; }
    QRCode.toCanvas(canvas.current, text, { width: size, margin: 2, errorCorrectionLevel: level, color: { dark, light } })
      .then(() => setErr("")).catch((e) => setErr(e.message));
  }, [text, size, level, dark, light]);

  function download() {
    const a = document.createElement("a"); a.download = "qrcode.png"; a.href = canvas.current!.toDataURL("image/png"); a.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="card p-4 space-y-4">
        <div>
          <label className="label" htmlFor="qr">Content</label>
          <textarea id="qr" className="textarea mt-1 h-28" value={text} onChange={(e) => setText(e.target.value)} placeholder="URL, text, phone number, Wi-Fi string…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="sz">Size: {size}px</label><input id="sz" type="range" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full accent-brand-600" /></div>
          <div><label className="label" htmlFor="lv">Error correction</label>
            <select id="lv" className="field mt-1" value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
              <option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option>
            </select></div>
          <div><label className="label" htmlFor="c1">Foreground</label><div className="mt-1 flex items-center gap-2"><input id="c1" type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-9 w-12 rounded border border-slate-300 dark:border-slate-700" /><code className="text-sm">{dark}</code></div></div>
          <div><label className="label" htmlFor="c2">Background</label><div className="mt-1 flex items-center gap-2"><input id="c2" type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-9 w-12 rounded border border-slate-300 dark:border-slate-700" /><code className="text-sm">{light}</code></div></div>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
      <div className="card flex flex-col items-center gap-4 p-4">
        <canvas ref={canvas} className="max-w-full rounded-lg border border-slate-200 dark:border-slate-700" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
        <button className="btn btn-primary w-full" onClick={download} disabled={!text}><Download size={15} /> Download PNG</button>
      </div>
    </div>
  );
}
