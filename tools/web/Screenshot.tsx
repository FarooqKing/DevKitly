"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import UrlForm from "./_UrlForm";

export default function Screenshot() {
  const [url, setUrl] = useState(""); const [device, setDevice] = useState("desktop"); const [full, setFull] = useState(false);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [img, setImg] = useState("");
  async function run() {
    setBusy(true); setErr(""); if (img) URL.revokeObjectURL(img); setImg("");
    try { const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}&device=${device}&full=${full ? 1 : 0}`); if (!res.ok) throw new Error((await res.json()).error); setImg(URL.createObjectURL(await res.blob())); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  return (
    <div className="space-y-4">
      <UrlForm value={url} onChange={setUrl} onSubmit={run} busy={busy} label="Capture">
        <div className="seg"><button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button><button type="button" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile</button></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} /> Full page</label>
      </UrlForm>
      {busy && <p className="text-sm text-slate-500">Loading the page in a headless browser, 10–30 seconds…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {img && <div className="card p-3"><div className="mb-3 flex justify-end"><a href={img} download="screenshot.png" className="btn btn-primary"><Download size={15} /> Download PNG</a></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="Website screenshot" className={`mx-auto rounded-lg border border-slate-200 dark:border-slate-700 ${device === "mobile" ? "max-w-[390px]" : "w-full"}`} /></div>}
    </div>
  );
}
