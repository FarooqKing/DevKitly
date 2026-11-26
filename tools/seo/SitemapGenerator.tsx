"use client";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { downloadBlob } from "@/lib/files";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/first-post");
  const [freq, setFreq] = useState("weekly"); const [prio, setPrio] = useState("0.8"); const [date, setDate] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const r = useMemo(() => {
    const list = [...new Set(urls.split("\n").map((u) => u.trim()).filter(Boolean))];
    const bad = list.filter((u) => !/^https?:\/\//.test(u));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.filter((u) => !bad.includes(u)).map((u, i) => `  <url>\n    <loc>${u.replace(/&/g, "&amp;")}</loc>\n${date ? `    <lastmod>${today}</lastmod>\n` : ""}    <changefreq>${freq}</changefreq>\n    <priority>${i === 0 ? "1.0" : prio}</priority>\n  </url>`).join("\n")}\n</urlset>`;
    return { xml, count: list.length - bad.length, bad };
  }, [urls, freq, prio, date, today]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="u">Page URLs (one per line, first = homepage)</label><textarea id="u" className="field mt-1 h-64 font-mono" value={urls} onChange={(e) => setUrls(e.target.value)} />{r.bad.length > 0 && <p className="mt-1 text-xs text-red-600">{r.bad.length} line(s) skipped: URLs must start with http:// or https://</p>}</div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label" htmlFor="f">Change frequency</label><select id="f" className="field mt-1" value={freq} onChange={(e) => setFreq(e.target.value)}>{["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="label" htmlFor="p">Priority</label><select id="p" className="field mt-1" value={prio} onChange={(e) => setPrio(e.target.value)}>{["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.3"].map((x) => <option key={x}>{x}</option>)}</select></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={date} onChange={(e) => setDate(e.target.checked)} /> Include lastmod (today)</label>
        <p className="text-xs text-slate-500">This builds a sitemap from URLs you list. Crawling a whole site requires a server, which this browser-only tool intentionally avoids.</p>
      </div>
      <div className="card h-fit">
        <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">sitemap.xml <span className="text-slate-400">· {r.count} URLs</span></h2><div className="flex gap-1"><button className="btn-icon" onClick={() => downloadBlob(new Blob([r.xml]), "sitemap.xml")} title="Download"><Download size={15} /></button><CopyButton text={r.xml} className="btn-ghost h-8 px-2" /></div></header>
        <pre className="max-h-[32rem] overflow-auto p-3 font-mono text-xs leading-relaxed">{r.xml}</pre>
      </div>
    </div>
  );
}
