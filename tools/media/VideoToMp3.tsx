"use client";
import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import Progress from "@/components/Progress";
import Result from "../pdf/_Result";
import { decode, toMp3, fmtTime } from "./_audio";
import { downloadBlob, baseName } from "@/lib/files";

export default function VideoToMp3() {
  const [file, setFile] = useState<File | null>(null); const [kbps, setKbps] = useState(128); const [prog, setProg] = useState<number | null>(null); const [out, setOut] = useState<Blob | null>(null); const [err, setErr] = useState(""); const [dur, setDur] = useState("");
  async function run() { if (!file) return; setProg(0); setErr(""); try { const b = await decode(file); setDur(fmtTime(b.duration)); setOut(await toMp3(b, kbps, setProg)); } catch { setErr("Could not read the audio track. MP4 (H.264/AAC), WebM and MOV usually work; some codecs aren't supported by browsers."); } setProg(null); }
  return (
    <div className="max-w-3xl space-y-4">
      {!file ? <FileDrop accept="video/*" label="Drop a video to extract its audio as MP3" hint="MP4, WebM, MOV, MKV · nothing is uploaded" onFiles={(f) => { setFile(f[0]); setOut(null); setErr(""); }} /> : (
        <div className="card space-y-4 p-4"><p className="font-medium">{file.name} <span className="ml-2 text-sm font-normal text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB {dur && `· ${dur}`}</span></p>
          <div><label className="label" htmlFor="k">MP3 bitrate</label><select id="k" className="field mt-1 w-40" value={kbps} onChange={(e) => setKbps(+e.target.value)}>{[64, 96, 128, 192, 256, 320].map((k) => <option key={k} value={k}>{k} kbps</option>)}</select></div>
          {err && <><p className="text-sm text-red-600">{err}</p><button className="btn" onClick={() => setFile(null)}>Try another file</button></>}
          {prog !== null ? <Progress value={prog} label="Decoding and encoding… large videos take a while" /> : !out && !err && <button className="btn btn-primary" onClick={run}>Extract MP3</button>}
        </div>
      )}
      {out && file && <Result after={out.size} label="Download MP3" onDownload={() => downloadBlob(out, `${baseName(file.name)}.mp3`)} onReset={() => { setFile(null); setOut(null); }}><audio controls src={URL.createObjectURL(out)} className="mt-4 w-full" /></Result>}
    </div>
  );
}
