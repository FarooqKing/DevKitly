"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import OgPreview from "./_OgPreview";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function Bar({ n, max, warn }: { n: number; max: number; warn: number }) {
  const pct = Math.min(100, (n / max) * 100); const c = n === 0 ? "bg-slate-300" : n > max ? "bg-red-500" : n < warn ? "bg-amber-400" : "bg-green-500";
  return <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-full ${c}`} style={{ width: `${pct}%` }} /></div>{n}/{max}</div>;
}

export default function MetaTagGenerator() {
  const [f, setF] = useState({ title: "Free Online PDF Tools — Merge, Split, Compress | DevKitly", desc: "Merge, split and compress PDF files online for free. No sign-up, no uploads: everything runs in your browser.", keywords: "pdf tools, merge pdf, compress pdf", url: "https://devkitly.vercel.app/category/pdf", image: "https://devkitly.vercel.app/opengraph-image", site: "DevKitly", author: "", robots: "index, follow", twitter: "@devkitly", lang: "en", type: "website" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((o) => ({ ...o, [k]: e.target.value }));
  const html = useMemo(() => [
    `<!-- Primary Meta Tags -->`, `<title>${esc(f.title)}</title>`, `<meta name="title" content="${esc(f.title)}">`, `<meta name="description" content="${esc(f.desc)}">`,
    f.keywords && `<meta name="keywords" content="${esc(f.keywords)}">`, f.author && `<meta name="author" content="${esc(f.author)}">`, `<meta name="robots" content="${esc(f.robots)}">`,
    `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<html lang="${f.lang}">`, f.url && `<link rel="canonical" href="${esc(f.url)}">`, ``,
    `<!-- Open Graph / Facebook -->`, `<meta property="og:type" content="${f.type}">`, f.url && `<meta property="og:url" content="${esc(f.url)}">`, `<meta property="og:title" content="${esc(f.title)}">`, `<meta property="og:description" content="${esc(f.desc)}">`, f.image && `<meta property="og:image" content="${esc(f.image)}">`, f.site && `<meta property="og:site_name" content="${esc(f.site)}">`, ``,
    `<!-- Twitter -->`, `<meta name="twitter:card" content="summary_large_image">`, f.twitter && `<meta name="twitter:site" content="${esc(f.twitter)}">`, f.url && `<meta name="twitter:url" content="${esc(f.url)}">`, `<meta name="twitter:title" content="${esc(f.title)}">`, `<meta name="twitter:description" content="${esc(f.desc)}">`, f.image && `<meta name="twitter:image" content="${esc(f.image)}">`,
  ].filter((l): l is string => typeof l === "string").filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"), [f]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="t">Page title</label><input id="t" className="field mt-1" value={f.title} onChange={set("title")} /><Bar n={f.title.length} max={60} warn={30} /></div>
        <div><label className="label" htmlFor="d">Meta description</label><textarea id="d" className="field mt-1 h-20" value={f.desc} onChange={set("desc")} /><Bar n={f.desc.length} max={160} warn={70} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="u">Canonical URL</label><input id="u" className="field mt-1" value={f.url} onChange={set("url")} /></div>
          <div><label className="label" htmlFor="i">Image URL (1200×630)</label><input id="i" className="field mt-1" value={f.image} onChange={set("image")} /></div>
          <div><label className="label" htmlFor="k">Keywords</label><input id="k" className="field mt-1" value={f.keywords} onChange={set("keywords")} /></div>
          <div><label className="label" htmlFor="a">Author</label><input id="a" className="field mt-1" value={f.author} onChange={set("author")} /></div>
          <div><label className="label" htmlFor="s">Site name</label><input id="s" className="field mt-1" value={f.site} onChange={set("site")} /></div>
          <div><label className="label" htmlFor="tw">Twitter handle</label><input id="tw" className="field mt-1" value={f.twitter} onChange={set("twitter")} /></div>
          <div><label className="label" htmlFor="r">Robots</label><select id="r" className="field mt-1" value={f.robots} onChange={set("robots")}><option>index, follow</option><option>noindex, follow</option><option>index, nofollow</option><option>noindex, nofollow</option></select></div>
          <div><label className="label" htmlFor="ty">OG type</label><select id="ty" className="field mt-1" value={f.type} onChange={set("type")}><option>website</option><option>article</option><option>product</option><option>profile</option></select></div>
        </div>
      </div>
      <div className="space-y-4">
        <OgPreview title={f.title} desc={f.desc} url={f.url} image={f.image} site={f.site} />
        <div className="card">
          <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Generated tags</h2><CopyButton text={html} className="btn-ghost h-8 px-2" /></header>
          <pre className="max-h-96 overflow-auto p-3 font-mono text-xs leading-relaxed">{html}</pre>
        </div>
      </div>
    </div>
  );
}
