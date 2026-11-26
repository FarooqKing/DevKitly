"use client";
import { useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "../pdf/_Result";
import { downloadBlob, baseName } from "@/lib/files";
import { fmtTime } from "./_audio";

const mime = () => ["video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"].find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) ?? "video/webm";

export default function VideoTrimmer() {
  const [file, setFile] = useState<File | null>(null); const [url, setUrl] = useState(""); const [dur, setDur] = useState(0); const [start, setStart] = useState(0); const [end, setEnd] = useState(0);
  const [quality, setQuality] = useState(2); const [scale, setScale] = useState(1); const [prog, setProg] = useState<number | null>(null); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  function pick(f: File) { setFile(f); setUrl(URL.createObjectURL(f)); setOut(null); setErr(""); }
  async function run() {
    const v = video.current; if (!v) return; setProg(0); setErr("");
    try {
      const canvas = document.createElement("canvas"); canvas.width = Math.round(v.videoWidth * scale); canvas.height = Math.round(v.videoHeight * scale); const ctx = canvas.getContext("2d")!;
      const stream = canvas.captureStream(30);
      const vs = (v as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream?.(); vs?.getAudioTracks().forEach((t) => stream.addTrack(t));
      const type = mime(); const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: [1_000_000, 2_500_000, 5_000_000][quality] }); const chunks: Blob[] = []; rec.ondataavailable = (e) => chunks.push(e.data);
      v.currentTime = start; await new Promise((r) => (v.onseeked = r)); v.muted = false; await v.play(); rec.start(250);
      await new Promise<void>((res) => { const draw = () => { ctx.drawImage(v, 0, 0, canvas.width, canvas.height); setProg((v.currentTime - start) / (end - start)); if (v.currentTime >= end || v.ended) { v.pause(); rec.stop(); res(); } else requestAnimationFrame(draw); }; draw(); });
      await new Promise((r) => (rec.onstop = r));
      setOut(new Blob(chunks, { type }));
    } catch (e) { setErr((e as Error).message); }
    setProg(null);
  }
  const ext = mime().startsWith("video/mp4") ? "mp4" : "webm";
  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="video/*" label="Drop a video to trim or compress" hint="MP4, WebM, MOV · processed in your browser (plays through once while recording)" onFiles={(f) => pick(f[0])} /> : (
        <div className="card space-y-4 p-4">
          <video ref={video} src={url} controls playsInline className="w-full rounded-lg bg-black" onLoadedMetadata={(e) => { const d = e.currentTarget.duration; setDur(d); setEnd(d); }} />
          {dur > 0 && <>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Start: {fmtTime(start)}</label><input type="range" min={0} max={dur} step={0.1} value={start} onChange={(e) => { setStart(Math.min(+e.target.value, end - 0.5)); if (video.current) video.current.currentTime = +e.target.value; }} className="mt-1 w-full accent-brand-600" /></div><div><label className="label">End: {fmtTime(end)}</label><input type="range" min={0} max={dur} step={0.1} value={end} onChange={(e) => { setEnd(Math.max(+e.target.value, start + 0.5)); if (video.current) video.current.currentTime = +e.target.value; }} className="mt-1 w-full accent-brand-600" /></div></div>
            <div className="flex flex-wrap items-end gap-5"><div><p className="label">Quality</p><div className="seg mt-1.5"><button aria-pressed={quality === 0} onClick={() => setQuality(0)}>Small</button><button aria-pressed={quality === 1} onClick={() => setQuality(1)}>Medium</button><button aria-pressed={quality === 2} onClick={() => setQuality(2)}>High</button></div></div><div><p className="label">Resolution</p><div className="seg mt-1.5"><button aria-pressed={scale === 1} onClick={() => setScale(1)}>Original</button><button aria-pressed={scale === 0.75} onClick={() => setScale(0.75)}>75%</button><button aria-pressed={scale === 0.5} onClick={() => setScale(0.5)}>50%</button></div></div><span className="text-sm text-slate-500">Output: {fmtTime(end - start)} · .{ext}</span></div>
          </>}
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog !== null ? <Progress value={prog} label="Recording the selection in real time… keep this tab open" /> : !out && dur > 0 && <button className="btn btn-primary" onClick={run}>Trim & export</button>}
        </div>
      )}
      {out && file && <Result before={file.size} after={out.size} label={`Download .${ext}`} onDownload={() => downloadBlob(out, `${baseName(file.name)}-trimmed.${ext}`)} onReset={() => { setFile(null); setOut(null); }}><video controls src={URL.createObjectURL(out)} className="mt-4 w-full rounded-lg bg-black" /></Result>}
    </div>
  );
}
