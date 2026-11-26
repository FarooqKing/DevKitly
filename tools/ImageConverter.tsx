"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Trash2, X } from "lucide-react";

type Format = "image/png" | "image/jpeg" | "image/webp";
const formats: { value: Format; label: string; ext: string; lossy: boolean }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg", lossy: true },
  { value: "image/png", label: "PNG", ext: "png", lossy: false },
  { value: "image/webp", label: "WebP", ext: "webp", lossy: true },
];

interface Item {
  id: string;
  file: File;
  src: string;            // object URL of original
  width: number;
  height: number;
  out?: { url: string; blob: Blob; width: number; height: number };
}

const kb = (n: number) => (n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`);
const baseName = (name: string) => name.replace(/\.[^.]+$/, "");

export default function ImageConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [maxW, setMaxW] = useState<string>("");
  const [maxH, setMaxH] = useState<string>("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [bg, setBg] = useState("#ffffff");
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fmt = formats.find((f) => f.value === format)!;

  // Add files
  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    list.forEach((file) => {
      const src = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => setItems((prev) => [...prev, { id: crypto.randomUUID(), file, src, width: img.naturalWidth, height: img.naturalHeight }]);
      img.src = src;
    });
  }, []);

  // Paste support
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => { if (e.clipboardData?.files.length) addFiles(e.clipboardData.files); };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  // Convert whenever settings or items change
  useEffect(() => {
    if (!items.length) return;
    let cancelled = false;
    setBusy(true);
    (async () => {
      const results = await Promise.all(items.map(async (it) => {
        const img = await loadImage(it.src);
        const { w, h } = targetSize(it.width, it.height, Number(maxW) || 0, Number(maxH) || 0, keepRatio);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        if (format === "image/jpeg") { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), format, fmt.lossy ? quality / 100 : undefined));
        return { id: it.id, out: { url: URL.createObjectURL(blob), blob, width: w, height: h } };
      }));
      if (cancelled) return;
      setItems((prev) => prev.map((it) => {
        const r = results.find((x) => x.id === it.id);
        if (it.out) URL.revokeObjectURL(it.out.url);
        return r ? { ...it, out: r.out } : it;
      }));
      setBusy(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, format, quality, maxW, maxH, keepRatio, bg]);

  function remove(id: string) {
    setItems((prev) => { const it = prev.find((x) => x.id === id); if (it) { URL.revokeObjectURL(it.src); if (it.out) URL.revokeObjectURL(it.out.url); } return prev.filter((x) => x.id !== id); });
  }
  function clearAll() { items.forEach((it) => { URL.revokeObjectURL(it.src); if (it.out) URL.revokeObjectURL(it.out.url); }); setItems([]); }
  function download(it: Item) {
    if (!it.out) return;
    const a = document.createElement("a"); a.href = it.out.url; a.download = `${baseName(it.file.name)}.${fmt.ext}`; a.click();
  }
  function downloadAll() { items.forEach((it, i) => setTimeout(() => download(it), i * 150)); }

  const totalIn = items.reduce((n, i) => n + i.file.size, 0);
  const totalOut = items.reduce((n, i) => n + (i.out?.blob.size ?? 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          role="button" tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          className={`card flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center transition ${drag ? "border-brand-500 bg-brand-50 dark:bg-brand-600/10" : "hover:border-brand-400"}`}>
          <ImagePlus size={28} className="text-brand-600" />
          <span className="font-medium">Drop images here, click to choose, or paste from clipboard</span>
          <span className="text-sm text-slate-500">PNG, JPG, WebP, GIF, BMP, SVG · multiple files OK · nothing is uploaded</span>
          <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        </div>

        {/* Results */}
        {items.length > 0 && (
          <section className="card overflow-hidden">
            <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-2.5 text-sm dark:border-slate-800">
              <span className="font-medium">{items.length} image{items.length > 1 ? "s" : ""}</span>
              <span className="text-slate-500">{kb(totalIn)} → {busy ? "…" : kb(totalOut)}{!busy && totalIn > 0 && <span className={`ml-1 ${totalOut < totalIn ? "text-green-600" : "text-amber-600"}`}>({totalOut >= totalIn ? "+" : ""}{Math.round((totalOut / totalIn - 1) * 100)}%)</span>}</span>
              <div className="ml-auto flex gap-2">
                <button className="btn btn-ghost h-8 px-2" onClick={clearAll}><Trash2 size={15} /> Clear</button>
                <button className="btn btn-primary h-8" onClick={downloadAll} disabled={busy}><Download size={15} /> Download all</button>
              </div>
            </header>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.out?.url ?? it.src} alt="" className="h-14 w-14 shrink-0 rounded-md border border-slate-200 object-cover dark:border-slate-700" style={{ background: "repeating-conic-gradient(#e2e8f0 0 25%, transparent 0 50%) 0 0 / 12px 12px" }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" title={it.file.name}>{baseName(it.file.name)}.{fmt.ext}</p>
                    <p className="text-xs text-slate-500">
                      {it.width}×{it.height} · {kb(it.file.size)}
                      <span className="mx-1.5 text-slate-400">→</span>
                      {it.out ? <>{it.out.width}×{it.out.height} · <span className={it.out.blob.size < it.file.size ? "text-green-600" : ""}>{kb(it.out.blob.size)}</span></> : "converting…"}
                    </p>
                  </div>
                  <button className="btn h-8" onClick={() => download(it)} disabled={!it.out}><Download size={15} /> <span className="hidden sm:inline">Download</span></button>
                  <button className="btn-icon" onClick={() => remove(it.id)} aria-label="Remove"><X size={15} /></button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Settings */}
      <aside className="card h-fit space-y-5 p-4 lg:sticky lg:top-20">
        <div>
          <p className="label">Output format</p>
          <div className="seg mt-1.5 w-full">{formats.map((f) => <button key={f.value} className="flex-1" aria-pressed={format === f.value} onClick={() => setFormat(f.value)}>{f.label}</button>)}</div>
        </div>
        <div>
          <label className="label flex items-center justify-between" htmlFor="q">Quality <span className="font-mono normal-case">{fmt.lossy ? `${quality}%` : "lossless"}</span></label>
          <input id="q" type="range" min={10} max={100} value={quality} disabled={!fmt.lossy} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full accent-brand-600 disabled:opacity-40" />
        </div>
        <div>
          <p className="label">Resize (leave empty to keep original)</p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <label className="text-xs text-slate-500">Max width<input type="number" min={1} className="field mt-1" placeholder="auto" value={maxW} onChange={(e) => setMaxW(e.target.value)} /></label>
            <label className="text-xs text-slate-500">Max height<input type="number" min={1} className="field mt-1" placeholder="auto" value={maxH} onChange={(e) => setMaxH(e.target.value)} /></label>
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} /> Keep aspect ratio</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[1920, 1280, 800, 512].map((w) => <button key={w} className="btn h-7 px-2 text-xs" onClick={() => { setMaxW(String(w)); setMaxH(""); }}>{w}px</button>)}
            <button className="btn h-7 px-2 text-xs" onClick={() => { setMaxW(""); setMaxH(""); }}>Original</button>
          </div>
        </div>
        {format === "image/jpeg" && (
          <div>
            <p className="label">Background for transparency</p>
            <div className="mt-1.5 flex items-center gap-2"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 rounded border border-slate-300 dark:border-slate-700" aria-label="Background color" /><code className="text-sm">{bg}</code></div>
          </div>
        )}
      </aside>
    </div>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = src; });
}

function targetSize(w: number, h: number, maxW: number, maxH: number, keep: boolean) {
  if (!maxW && !maxH) return { w, h };
  if (!keep) return { w: maxW || w, h: maxH || h };
  const rw = maxW ? maxW / w : Infinity, rh = maxH ? maxH / h : Infinity;
  const r = Math.min(rw, rh, 1);
  return { w: Math.max(1, Math.round(w * r)), h: Math.max(1, Math.round(h * r)) };
}
