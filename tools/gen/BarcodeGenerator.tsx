"use client";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import JsBarcode from "jsbarcode";

const formats = [["CODE128", "Code 128 (any text)"], ["EAN13", "EAN-13 (12–13 digits)"], ["EAN8", "EAN-8 (7–8 digits)"], ["UPC", "UPC-A (11–12 digits)"], ["CODE39", "Code 39"], ["ITF14", "ITF-14"], ["MSI", "MSI"], ["pharmacode", "Pharmacode"]];
export default function BarcodeGenerator() {
  const [value, setValue] = useState("DEVKITLY-2026"); const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2); const [height, setHeight] = useState(80); const [text, setText] = useState(true);
  const [err, setErr] = useState(""); const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svg.current) return;
    try { JsBarcode(svg.current, value, { format, width, height, displayValue: text, margin: 10, background: "#ffffff", lineColor: "#000000", valid: (ok) => setErr(ok ? "" : `Invalid value for ${format}.`) }); } catch (e) { setErr((e as Error).message); }
  }, [value, format, width, height, text]);
  function download(type: "svg" | "png") {
    const s = new XMLSerializer().serializeToString(svg.current!);
    if (type === "svg") { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "image/svg+xml" })); a.download = "barcode.svg"; a.click(); return; }
    const img = new Image(); img.onload = () => { const c = document.createElement("canvas"); c.width = img.width * 2; c.height = img.height * 2; const x = c.getContext("2d")!; x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "barcode.png"; a.click(); };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(s)));
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="v">Value</label><input id="v" className="field mt-1 font-mono" value={value} onChange={(e) => setValue(e.target.value)} /></div>
        <div><label className="label" htmlFor="f">Format</label><select id="f" className="field mt-1" value={format} onChange={(e) => setFormat(e.target.value)}>{formats.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="label" htmlFor="w">Bar width: {width}</label><input id="w" type="range" min={1} max={4} value={width} onChange={(e) => setWidth(+e.target.value)} className="mt-2 w-full accent-brand-600" /></div><div><label className="label" htmlFor="h">Height: {height}</label><input id="h" type="range" min={30} max={200} value={height} onChange={(e) => setHeight(+e.target.value)} className="mt-2 w-full accent-brand-600" /></div></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={text} onChange={(e) => setText(e.target.checked)} /> Show value under barcode</label>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
      <div className="card flex flex-col items-center gap-4 p-5">
        <div className="w-full overflow-auto rounded-lg bg-white p-2"><svg ref={svg} className="mx-auto" /></div>
        <div className="flex gap-2"><button className="btn btn-primary" onClick={() => download("png")} disabled={!!err}><Download size={15} /> PNG</button><button className="btn" onClick={() => download("svg")} disabled={!!err}><Download size={15} /> SVG</button></div>
      </div>
    </div>
  );
}
