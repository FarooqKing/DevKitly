"use client";
import { useState } from "react";
import OgPreview from "./_OgPreview";
export default function OgPreviewTool() {
  const [title, setTitle] = useState("Free Online Tools That Just Work | DevKitly");
  const [desc, setDesc] = useState("43+ free tools for PDFs, spreadsheets, calculations and code. No sign-up, no uploads.");
  const [url, setUrl] = useState("https://devkitly.vercel.app");
  const [image, setImage] = useState("https://devkitly.vercel.app/opengraph-image");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="t">og:title</label><input id="t" className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="label" htmlFor="d">og:description</label><textarea id="d" className="field mt-1 h-20" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        <div><label className="label" htmlFor="u">og:url</label><input id="u" className="field mt-1" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
        <div><label className="label" htmlFor="i">og:image (1200×630 recommended)</label><input id="i" className="field mt-1" value={image} onChange={(e) => setImage(e.target.value)} /></div>
        <p className="text-xs text-slate-500">Tip: paste a live image URL to see exactly how the card renders. Social networks cache previews; use their debuggers to refresh.</p>
      </div>
      <OgPreview title={title} desc={desc} url={url} image={image} />
    </div>
  );
}
