"use client";
import { useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "../pdf/_Result";
import { downloadBlob, baseName } from "@/lib/files";
import { fmtTime } from "./_audio";

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null); const [url, setUrl] = useState(""); const [dur, setDur] = useState(0); const [start, setStart] = useState(0); const [len, setLen] = useState(3); const [fps, setFps] = useState(10); const [width, setWidth] = useState(480);
  const [prog, setProg] = useState<number | null>(null); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState(""); const video = useRef<HTMLVideoElement>(null);
  async function run() {
    const v = video.current; if (!v) return; setProg(0); setErr("");
    try {
      const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
      const w = Math.min(width, v.videoWidth), h = Math.round(v.videoHeight * (w / v.videoWidth)); const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d", { willReadFrequently: true })!;
      const gif = GIFEncoder(); const frames = Math.round(len * fps); const end = Math.min(dur, start + len);
      for (let i = 0; i < frames; i++) { const t = start + i / fps; if (t > end) break; v.currentTime = t; await new Promise((r) => (v.onseeked = r)); x.drawImage(v, 0, 0, w, h); const data = x.getImageData(0, 0, w, h).data; const palette = quantize(data, 256); const index = applyPalette(data, palette); gif.writeFrame(index, w, h, { palette, delay: Math.round(1000 / fps) }); setProg((i + 1) / frames); await new Promise((r) => setTimeout(r, 0)); }
      gif.finish(); setOut(new Blob([gif.bytes()], { type: "image/gif" }));
    } catch (e) { setErr((e as Error).message); }
    setProg(null);
  }
  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="video/*" label="Drop a video to turn into a GIF" hint="MP4, WebM, MOV · up to ~15 seconds works best" onFiles={(f) => { setFile(f[0]); setUrl(URL.createObjectURL(f[0])); setOut(null); }} /> : (
        <div className="card space-y-4 p-4">
          <video ref={video} src={url} controls playsInline muted className="w-full rounded-lg bg-black" onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} />
          {dur > 0 && <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Start: {fmtTime(start)}</label><input type="range" min={0} max={Math.max(0, dur - 0.5)} step={0.1} value={start} onChange={(e) => { setStart(+e.target.value); if (video.current) video.current.currentTime = +e.target.value; }} className="mt-1 w-full accent-brand-600" /></div>
            <div><label className="label">Length: {len}s</label><input type="range" min={0.5} max={Math.min(15, dur)} step={0.5} value={len} onChange={(e) => setLen(+e.target.value)} className="mt-1 w-full accent-brand-600" /></div>
            <div><label className="label">Frame rate: {fps} fps</label><input type="range" min={5} max={20} value={fps} onChange={(e) => setFps(+e.target.value)} className="mt-1 w-full accent-brand-600" /></div>
            <div><label className="label">Width: {width}px</label><input type="range" min={160} max={800} step={20} value={width} onChange={(e) => setWidth(+e.target.value)} className="mt-1 w-full accent-brand-600" /></div>
          </div>}
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog !== null ? <Progress value={prog} label={`Encoding ${Math.round(len * fps)} frames…`} /> : !out && dur > 0 && <button className="btn btn-primary" onClick={run}>Create GIF</button>}
        </div>
      )}
      {out && file && <Result after={out.size} label="Download GIF" onDownload={() => downloadBlob(out, `${baseName(file.name)}.gif`)} onReset={() => { setFile(null); setOut(null); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={URL.createObjectURL(out)} alt="GIF preview" className="mt-4 max-w-full rounded-lg" /></Result>}
    </div>
  );
}
