"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "../pdf/_Result";
import { decode, toWav, toMp3, fmtTime } from "./_audio";
import { downloadBlob, baseName } from "@/lib/files";

export default function AudioConverter() {
  const [file, setFile] = useState<File | null>(null); const [info, setInfo] = useState(""); const [fmt, setFmt] = useState<"mp3" | "wav">("mp3"); const [kbps, setKbps] = useState(128);
  const [prog, setProg] = useState<number | null>(null); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState("");
  async function pick(f: File) { setFile(f); setOut(null); setErr(""); try { const b = await decode(f); setInfo(`${fmtTime(b.duration)} · ${b.sampleRate} Hz · ${b.numberOfChannels === 1 ? "mono" : "stereo"}`); } catch { setErr("Could not decode this file. Supported: MP3, WAV, OGG, M4A/AAC, FLAC, WebM (browser-dependent)."); } }
  async function run() { if (!file) return; setProg(0); setErr(""); try { const b = await decode(file); setOut(fmt === "wav" ? toWav(b) : await toMp3(b, kbps, setProg)); } catch (e) { setErr((e as Error).message); } setProg(null); }
  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="audio/*,video/*" label="Drop an audio file (or a video to extract its audio)" hint="MP3, WAV, OGG, M4A, FLAC, WebM, MP4 · converted in your browser" onFiles={(f) => pick(f[0])} /> : (
        <div className="card space-y-4 p-4">
          <p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{info}</span></p>
          <div className="flex flex-wrap items-end gap-5"><div><p className="label">Output format</p><div className="seg mt-1.5"><button aria-pressed={fmt === "mp3"} onClick={() => { setFmt("mp3"); setOut(null); }}>MP3</button><button aria-pressed={fmt === "wav"} onClick={() => { setFmt("wav"); setOut(null); }}>WAV</button></div></div>
            {fmt === "mp3" && <div><label className="label" htmlFor="k">Bitrate</label><select id="k" className="field mt-1" value={kbps} onChange={(e) => { setKbps(+e.target.value); setOut(null); }}>{[64, 96, 128, 192, 256, 320].map((k) => <option key={k} value={k}>{k} kbps</option>)}</select></div>}</div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {prog !== null ? <Progress value={prog} label="Encoding…" /> : !out && !err && <button className="btn btn-primary" onClick={run}>Convert to {fmt.toUpperCase()}</button>}
          {err && <button className="btn" onClick={() => setFile(null)}>Try another file</button>}
        </div>
      )}
      {out && file && <Result before={file.size} after={out.size} label={`Download .${fmt}`} onDownload={() => downloadBlob(out, `${baseName(file.name)}.${fmt}`)} onReset={() => { setFile(null); setOut(null); }}><audio controls src={URL.createObjectURL(out)} className="mt-4 w-full" /></Result>}
    </div>
  );
}
