"use client";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default function ImageToBase64() {
  const [data, setData] = useState("");
  const [meta, setMeta] = useState<{ name: string; size: number; type: string } | null>(null);
  const [drag, setDrag] = useState(false);

  function load(f?: File) {
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader(); r.onload = () => { setData(r.result as string); setMeta({ name: f.name, size: f.size, type: f.type }); }; r.readAsDataURL(f);
  }
  const css = data ? `background-image: url("${data}");` : "";
  const html = data ? `<img src="${data}" alt="" />` : "";

  return (
    <div className="max-w-3xl">
      <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]); }}
        className={`card flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-10 text-center transition ${drag ? "border-brand-500 bg-brand-50 dark:bg-brand-600/10" : ""}`}>
        <ImagePlus size={28} className="text-brand-600" />
        <span className="font-medium">Drop an image here or click to choose</span>
        <span className="text-sm text-slate-500">PNG, JPG, GIF, SVG, WebP · stays on your device</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => load(e.target.files?.[0])} />
      </label>
      {data && meta && (
        <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr]">
          <div className="card p-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data} alt="" className="mx-auto max-h-32 rounded" />
            <p className="mt-2 truncate text-xs text-slate-500" title={meta.name}>{meta.name}</p>
            <p className="text-xs text-slate-400">{(meta.size / 1024).toFixed(1)} KB → {(data.length / 1024).toFixed(1)} KB</p>
          </div>
          <div className="space-y-3">
            {[["Data URL", data], ["CSS", css], ["HTML", html]].map(([k, v]) => (
              <div key={k} className="card p-3">
                <div className="flex items-center justify-between"><span className="text-sm font-medium">{k}</span><CopyButton text={v} className="btn-ghost h-8 px-2" /></div>
                <code className="mt-1 block max-h-20 overflow-hidden break-all font-mono text-xs text-slate-500">{v.slice(0, 300)}{v.length > 300 ? "…" : ""}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
