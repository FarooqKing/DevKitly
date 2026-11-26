"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Pane from "@/components/Pane";
import { XMLValidator } from "fast-xml-parser";

type Issue = { level: "error" | "warn" | "ok"; msg: string };
function validate(xml: string): { issues: Issue[]; urls: number } {
  const issues: Issue[] = [];
  const v = XMLValidator.validate(xml); if (v !== true) return { issues: [{ level: "error", msg: `Invalid XML: ${v.err.msg} (line ${v.err.line})` }], urls: 0 };
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const isIndex = !!doc.querySelector("sitemapindex");
  const root = doc.querySelector(isIndex ? "sitemapindex" : "urlset");
  if (!root) return { issues: [{ level: "error", msg: "Root element must be <urlset> or <sitemapindex>." }], urls: 0 };
  if (root.getAttribute("xmlns") !== "http://www.sitemaps.org/schemas/sitemap/0.9") issues.push({ level: "error", msg: "Missing or wrong xmlns; expected http://www.sitemaps.org/schemas/sitemap/0.9" }); else issues.push({ level: "ok", msg: "Correct namespace" });
  const entries = Array.from(doc.querySelectorAll(isIndex ? "sitemap" : "url"));
  if (!entries.length) issues.push({ level: "error", msg: `No <${isIndex ? "sitemap" : "url"}> entries found.` });
  if (entries.length > 50000) issues.push({ level: "error", msg: `${entries.length} entries; the limit is 50,000 per file.` });
  const locs = entries.map((e) => e.querySelector("loc")?.textContent?.trim() ?? "");
  const missing = locs.filter((l) => !l).length; if (missing) issues.push({ level: "error", msg: `${missing} entries have no <loc>.` });
  const bad = locs.filter((l) => l && !/^https?:\/\//.test(l)).length; if (bad) issues.push({ level: "error", msg: `${bad} <loc> values are not absolute URLs.` });
  const dup = locs.length - new Set(locs).size; if (dup) issues.push({ level: "warn", msg: `${dup} duplicate URLs.` });
  const hosts = new Set(locs.filter(Boolean).map((l) => { try { return new URL(l).host; } catch { return "?"; } })); if (hosts.size > 1) issues.push({ level: "warn", msg: `URLs span ${hosts.size} hosts; a sitemap should cover one host.` });
  const badDates = entries.filter((e) => { const d = e.querySelector("lastmod")?.textContent?.trim(); return d && isNaN(Date.parse(d)); }).length; if (badDates) issues.push({ level: "warn", msg: `${badDates} invalid <lastmod> dates (use YYYY-MM-DD or W3C datetime).` });
  const badPrio = entries.filter((e) => { const p = e.querySelector("priority")?.textContent; return p && (isNaN(+p) || +p < 0 || +p > 1); }).length; if (badPrio) issues.push({ level: "warn", msg: `${badPrio} <priority> values outside 0.0–1.0.` });
  const badFreq = entries.filter((e) => { const f = e.querySelector("changefreq")?.textContent?.trim(); return f && !["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].includes(f); }).length; if (badFreq) issues.push({ level: "warn", msg: `${badFreq} invalid <changefreq> values.` });
  if (new Blob([xml]).size > 50 * 1024 * 1024) issues.push({ level: "error", msg: "File exceeds 50 MB." });
  if (!issues.some((i) => i.level === "error")) issues.unshift({ level: "ok", msg: `Valid ${isIndex ? "sitemap index" : "sitemap"} with ${entries.length} entries.` });
  return { issues, urls: entries.length };
}
const I = { ok: <CheckCircle2 size={16} className="text-green-600" />, warn: <AlertTriangle size={16} className="text-amber-500" />, error: <XCircle size={16} className="text-red-600" /> };
export default function SitemapValidator() {
  const [xml, setXml] = useState("");
  const r = useMemo(() => (xml.trim() ? validate(xml) : null), [xml]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Pane title="sitemap.xml" value={xml} onChange={setXml} accept=".xml" placeholder="Paste sitemap XML or upload the file…" />
      <div className="card h-fit"><header className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Validation results</header>
        {!r ? <p className="p-4 text-sm text-slate-400">Paste a sitemap to validate.</p> : <ul className="divide-y divide-slate-100 dark:divide-slate-800">{r.issues.map((i, n) => <li key={n} className="flex gap-3 px-4 py-2.5 text-sm"><span className="mt-0.5 shrink-0">{I[i.level]}</span>{i.msg}</li>)}</ul>}
      </div>
    </div>
  );
}
