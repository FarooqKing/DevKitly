"use client";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { ytId } from "./_yt";
const sizes = [["maxresdefault", "HD 1280×720"], ["sddefault", "SD 640×480"], ["hqdefault", "HQ 480×360"], ["mqdefault", "MQ 320×180"], ["default", "Small 120×90"]];
export default function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const id = useMemo(() => ytId(url), [url]);
  return (
    <div className="max-w-4xl space-y-4">
      <div className="card p-4"><label className="label" htmlFor="y">YouTube video URL or ID</label><input id="y" className="field mt-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />{url && !id && <p className="mt-2 text-sm text-red-600">Couldn&apos;t find a video ID in that URL.</p>}</div>
      {id && <div className="grid gap-4 sm:grid-cols-2">{sizes.map(([k, l]) => { const src = `https://img.youtube.com/vi/${id}/${k}.jpg`; return <div key={k} className="card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={l} className="w-full bg-slate-100 object-cover dark:bg-slate-800" />
        <div className="flex items-center justify-between p-3"><span className="text-sm font-medium">{l}</span><a className="btn h-8" href={`/api/image-proxy?url=${encodeURIComponent(src)}`} download={`${id}-${k}.jpg`}><Download size={14} /> Download</a></div></div>; })}</div>}
      <p className="text-xs text-slate-500">HD (maxresdefault) exists only for videos uploaded in HD; if it shows a grey placeholder, use SD or HQ. Thumbnails belong to their creators.</p>
    </div>
  );
}
