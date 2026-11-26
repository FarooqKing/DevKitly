"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Monitor, Square, Download } from "lucide-react";
import { downloadBlob } from "@/lib/files";
import { fmtTime } from "./_audio";

export default function Recorder({ mode }: { mode: "audio" | "screen" }) {
  const [rec, setRec] = useState<MediaRecorder | null>(null); const [sec, setSec] = useState(0); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState(""); const [mic, setMic] = useState(true);
  const stream = useRef<MediaStream | null>(null); const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (!rec) return; const id = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(id); }, [rec]);
  async function start() {
    setErr(""); setOut(null); setSec(0);
    try {
      let s: MediaStream;
      if (mode === "audio") s = await navigator.mediaDevices.getUserMedia({ audio: true });
      else { s = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true }); if (mic) { try { const m = await navigator.mediaDevices.getUserMedia({ audio: true }); m.getAudioTracks().forEach((t) => s.addTrack(t)); } catch {} } if (video.current) { video.current.srcObject = s; video.current.play(); } s.getVideoTracks()[0].onended = () => stop(); }
      stream.current = s; const type = mode === "audio" ? (MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm") : (MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm");
      const r = new MediaRecorder(s, { mimeType: type }); const chunks: Blob[] = []; r.ondataavailable = (e) => chunks.push(e.data); r.onstop = () => { setOut(new Blob(chunks, { type })); s.getTracks().forEach((t) => t.stop()); setRec(null); }; r.start(250); setRec(r);
    } catch (e) { setErr((e as Error).name === "NotAllowedError" ? "Permission denied. Allow access and try again." : (e as Error).message); }
  }
  function stop() { rec?.stop(); }
  const ext = mode === "audio" ? "webm" : "webm";
  return (
    <div className="max-w-2xl space-y-4">
      <div className="card p-6 text-center">
        {mode === "screen" && <video ref={video} muted playsInline className={`mb-4 w-full rounded-lg bg-black ${rec ? "" : "hidden"}`} />}
        <p className="font-mono text-4xl tabular-nums">{fmtTime(sec)}</p>
        <div className="mt-4 flex justify-center gap-2">{!rec ? <button className="btn btn-primary" onClick={start}>{mode === "audio" ? <Mic size={16} /> : <Monitor size={16} />} Start recording</button> : <button className="btn border-red-500 bg-red-600 text-white hover:bg-red-700" onClick={stop}><Square size={16} /> Stop</button>}</div>
        {mode === "screen" && !rec && <label className="mt-3 flex items-center justify-center gap-2 text-sm"><input type="checkbox" checked={mic} onChange={(e) => setMic(e.target.checked)} /> Include microphone</label>}
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <p className="mt-3 text-xs text-slate-500">{mode === "audio" ? "Recorded locally with your microphone; nothing is uploaded." : "Pick a screen, window or tab. Tab audio is captured when you share a tab in Chrome/Edge."}</p>
      </div>
      {out && <div className="card p-4">{mode === "audio" ? <audio controls src={URL.createObjectURL(out)} className="w-full" /> : <video controls src={URL.createObjectURL(out)} className="w-full rounded-lg bg-black" />}<div className="mt-3 flex items-center justify-between text-sm text-slate-500"><span>{(out.size / 1024 / 1024).toFixed(2)} MB · {fmtTime(sec)}</span><button className="btn btn-primary" onClick={() => downloadBlob(out, `recording-${Date.now()}.${ext}`)}><Download size={15} /> Download</button></div>{mode === "audio" && <p className="mt-2 text-xs text-slate-500">Need MP3? Open the file in the Audio Converter tool.</p>}</div>}
    </div>
  );
}
export const VoiceRecorder = () => <Recorder mode="audio" />;
export const ScreenRecorder = () => <Recorder mode="screen" />;
