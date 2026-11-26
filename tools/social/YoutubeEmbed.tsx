"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { ytId } from "./_yt";
export default function YoutubeEmbed() {
  const [url, setUrl] = useState(""); const [w, setW] = useState(560); const [responsive, setResponsive] = useState(true);
  const [o, setO] = useState({ autoplay: false, mute: false, loop: false, controls: true, start: "", privacy: true });
  const id = useMemo(() => ytId(url), [url]);
  const code = useMemo(() => { if (!id) return ""; const p = new URLSearchParams(); if (o.autoplay) p.set("autoplay", "1"); if (o.mute) p.set("mute", "1"); if (o.loop) { p.set("loop", "1"); p.set("playlist", id); } if (!o.controls) p.set("controls", "0"); if (o.start) p.set("start", String(parseInt(o.start) || 0)); const q = p.toString(); const src = `https://www.${o.privacy ? "youtube-nocookie" : "youtube"}.com/embed/${id}${q ? "?" + q : ""}`;
    const iframe = `<iframe ${responsive ? 'style="position:absolute;top:0;left:0;width:100%;height:100%"' : `width="${w}" height="${Math.round(w * 9 / 16)}"`} src="${src}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    return responsive ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">\n  ${iframe}\n</div>` : iframe; }, [id, w, responsive, o]);
  const T = ({ k, l }: { k: keyof typeof o; l: string }) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={o[k] as boolean} onChange={(e) => setO((x) => ({ ...x, [k]: e.target.checked }))} /> {l}</label>;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="y">YouTube URL</label><input id="y" className="field mt-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></div>
        <div className="seg"><button aria-pressed={responsive} onClick={() => setResponsive(true)}>Responsive</button><button aria-pressed={!responsive} onClick={() => setResponsive(false)}>Fixed size</button></div>
        {!responsive && <div><label className="label">Width: {w}px (height auto 16:9)</label><input type="range" min={200} max={1280} step={10} value={w} onChange={(e) => setW(+e.target.value)} className="mt-1 w-full accent-brand-600" /></div>}
        <div className="grid grid-cols-2 gap-2"><T k="autoplay" l="Autoplay" /><T k="mute" l="Muted" /><T k="loop" l="Loop" /><T k="controls" l="Show controls" /><T k="privacy" l="Privacy-enhanced (no-cookie)" /></div>
        <div><label className="label">Start at (seconds)</label><input className="field mt-1 w-32" value={o.start} onChange={(e) => setO((x) => ({ ...x, start: e.target.value }))} placeholder="0" /></div>
      </div>
      <div className="space-y-4">
        {id && <div className="card overflow-hidden"><div style={{ position: "relative", paddingBottom: "56.25%" }}><iframe style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} src={`https://www.youtube-nocookie.com/embed/${id}`} title="Preview" allowFullScreen /></div></div>}
        <div className="card"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Embed code</h2><CopyButton text={code} className="btn-ghost h-8 px-2" /></header><pre className="overflow-auto p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">{code || "Paste a YouTube URL to get the code."}</pre></div>
      </div>
    </div>
  );
}
