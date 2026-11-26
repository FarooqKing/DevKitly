"use client";
import { useEffect, useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "../pdf/_Result";
import { decode, slice, toWav, toMp3, fmtTime } from "./_audio";
import { downloadBlob, baseName } from "@/lib/files";

export default function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null); const [buf, setBuf] = useState<AudioBuffer | null>(null); const [start, setStart] = useState(0); const [end, setEnd] = useState(0); const [fmt, setFmt] = useState<"mp3" | "wav">("mp3");
  const [prog, setProg] = useState<number | null>(null); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState(""); const canvas = useRef<HTMLCanvasElement>(null); const audio = useRef<HTMLAudioElement>(null);
  async function pick(f: File) { setFile(f); setOut(null); setErr(""); try { const b = await decode(f); setBuf(b); setStart(0); setEnd(b.duration); } catch { setErr("Could not decode this audio file."); } }
  useEffect(() => { if (!buf || !canvas.current) return; const c = canvas.current; const w = (c.width = c.clientWidth * 2), h = (c.height = 160); const x = c.getContext("2d")!; const d = buf.getChannelData(0); const step = Math.ceil(d.length / w); x.clearRect(0, 0, w, h); x.fillStyle = "#cbd5e1"; for (let i = 0; i < w; i++) { let m = 0; for (let j = 0; j < step; j++) m = Math.max(m, Math.abs(d[i * step + j] ?? 0)); x.fillRect(i, h / 2 - m * h / 2, 1, Math.max(1, m * h)); } const s = (start / buf.duration) * w, e = (end / buf.duration) * w; x.fillStyle = "rgba(79,70,229,.25)"; x.fillRect(s, 0, e - s, h); x.fillStyle = "#4f46e5"; x.fillRect(s - 2, 0, 4, h); x.fillRect(e - 2, 0, 4, h); }, [buf, start, end]);
  async function run() { if (!buf) return; setProg(0); try { const part = slice(buf, start, end); setOut(fmt === "wav" ? toWav(part) : await toMp3(part, 128, setProg)); } catch (e) { setErr((e as Error).message); } setProg(null); }
  function preview() { if (!audio.current) return; audio.current.currentTime = start; audio.current.play(); const stop = () => { if (audio.current && audio.current.currentTime >= end) { audio.current.pause(); audio.current.removeEventListener("timeupdate", stop); } }; audio.current.addEventListener("timeupdate", stop); }
  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="audio/*" label="Drop an audio file to cut" hint="MP3, WAV, OGG, M4A · trimmed in your browser" onFiles={(f) => pick(f[0])} /> : buf && (
        <div className="card space-y-4 p-4">
          <p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{fmtTime(buf.duration)}</span></p>
          <canvas ref={canvas} className="h-40 w-full rounded-lg bg-slate-50 dark:bg-slate-950" />
          <div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Start: {fmtTime(start)} ({start.toFixed(1)}s)</label><input type="range" min={0} max={buf.duration} step={0.1} value={start} onChange={(e) => { setStart(Math.min(+e.target.value, end - 0.1)); setOut(null); }} className="mt-1 w-full accent-brand-600" /></div><div><label className="label">End: {fmtTime(end)} ({end.toFixed(1)}s)</label><input type="range" min={0} max={buf.duration} step={0.1} value={end} onChange={(e) => { setEnd(Math.max(+e.target.value, start + 0.1)); setOut(null); }} className="mt-1 w-full accent-brand-600" /></div></div>
          <div className="flex flex-wrap items-center gap-3"><span className="text-sm text-slate-500">Selection: {fmtTime(end - start)}</span><button className="btn" onClick={preview}>▶ Preview selection</button><div className="seg ml-auto"><button aria-pressed={fmt === "mp3"} onClick={() => setFmt("mp3")}>MP3</button><button aria-pressed={fmt === "wav"} onClick={() => setFmt("wav")}>WAV</button></div></div>
          <audio ref={audio} src={URL.createObjectURL(file)} className="hidden" />
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog !== null ? <Progress value={prog} label="Encoding…" /> : !out && <button className="btn btn-primary" onClick={run}>Cut audio</button>}
        </div>
      )}
      {err && !buf && <button className="btn" onClick={() => setFile(null)}>Try another file</button>}
      {out && file && <Result after={out.size} label={`Download .${fmt}`} onDownload={() => downloadBlob(out, `${baseName(file.name)}-cut.${fmt}`)} onReset={() => { setFile(null); setBuf(null); setOut(null); }}><audio controls src={URL.createObjectURL(out)} className="mt-4 w-full" /></Result>}
    </div>
  );
}
