"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Pane from "@/components/Pane";

type Row = { label: string; value: string; status: "ok" | "warn" | "bad"; note?: string };
function analyze(html: string): Row[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const m = (sel: string) => doc.querySelector(sel)?.getAttribute("content") ?? "";
  const title = doc.querySelector("title")?.textContent?.trim() ?? "";
  const desc = m('meta[name="description"]');
  const h1 = doc.querySelectorAll("h1"); const imgs = Array.from(doc.querySelectorAll("img")); const noAlt = imgs.filter((i) => !i.getAttribute("alt")).length;
  const rows: Row[] = [
    { label: "Title", value: title || "(missing)", status: !title ? "bad" : title.length > 60 ? "warn" : title.length < 30 ? "warn" : "ok", note: `${title.length} chars (ideal 30–60)` },
    { label: "Meta description", value: desc || "(missing)", status: !desc ? "bad" : desc.length > 160 || desc.length < 70 ? "warn" : "ok", note: `${desc.length} chars (ideal 70–160)` },
    { label: "Canonical", value: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "(missing)", status: doc.querySelector('link[rel="canonical"]') ? "ok" : "warn" },
    { label: "Viewport", value: m('meta[name="viewport"]') || "(missing)", status: m('meta[name="viewport"]') ? "ok" : "bad" },
    { label: "Robots", value: m('meta[name="robots"]') || "(default: index, follow)", status: /noindex/.test(m('meta[name="robots"]')) ? "warn" : "ok" },
    { label: "Language", value: doc.documentElement.getAttribute("lang") ?? "(missing)", status: doc.documentElement.getAttribute("lang") ? "ok" : "warn" },
    { label: "Charset", value: doc.querySelector("meta[charset]")?.getAttribute("charset") ?? "(missing)", status: doc.querySelector("meta[charset]") ? "ok" : "warn" },
    { label: "H1 headings", value: h1.length ? Array.from(h1).map((h) => h.textContent?.trim()).join(" | ") : "(none)", status: h1.length === 1 ? "ok" : h1.length === 0 ? "bad" : "warn", note: `${h1.length} found (ideal 1)` },
    { label: "og:title", value: m('meta[property="og:title"]') || "(missing)", status: m('meta[property="og:title"]') ? "ok" : "warn" },
    { label: "og:description", value: m('meta[property="og:description"]') || "(missing)", status: m('meta[property="og:description"]') ? "ok" : "warn" },
    { label: "og:image", value: m('meta[property="og:image"]') || "(missing)", status: m('meta[property="og:image"]') ? "ok" : "warn" },
    { label: "twitter:card", value: m('meta[name="twitter:card"]') || "(missing)", status: m('meta[name="twitter:card"]') ? "ok" : "warn" },
    { label: "Images without alt", value: `${noAlt} of ${imgs.length}`, status: noAlt === 0 ? "ok" : "warn" },
    { label: "Structured data (JSON-LD)", value: `${doc.querySelectorAll('script[type="application/ld+json"]').length} block(s)`, status: doc.querySelector('script[type="application/ld+json"]') ? "ok" : "warn" },
    { label: "Favicon", value: doc.querySelector('link[rel*="icon"]')?.getAttribute("href") ?? "(missing)", status: doc.querySelector('link[rel*="icon"]') ? "ok" : "warn" },
  ];
  return rows;
}
const Icon = { ok: <CheckCircle2 size={16} className="text-green-600" />, warn: <AlertTriangle size={16} className="text-amber-500" />, bad: <XCircle size={16} className="text-red-600" /> };

export default function MetaTagAnalyzer() {
  const [html, setHtml] = useState("");
  const rows = useMemo(() => (html.trim() ? analyze(html) : null), [html]);
  const score = rows ? Math.round((rows.filter((r) => r.status === "ok").length / rows.length) * 100) : 0;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <Pane title="Page HTML source" value={html} onChange={setHtml} accept=".html,.htm" placeholder="Paste the full HTML source of a page (Ctrl+U in your browser → select all → copy)…" />
        <p className="mt-2 text-xs text-slate-500">Browsers block fetching other websites from a page, so paste the source instead of a URL. Nothing is sent anywhere.</p>
      </div>
      <div className="card">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800"><h2 className="font-medium">SEO checklist</h2>{rows && <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${score >= 80 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{score}/100</span>}</header>
        {!rows ? <p className="p-4 text-sm text-slate-400">Results appear here.</p> : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map((r) => <li key={r.label} className="flex gap-3 px-4 py-2.5 text-sm"><span className="mt-0.5 shrink-0">{Icon[r.status]}</span><div className="min-w-0"><p className="font-medium">{r.label} {r.note && <span className="font-normal text-slate-400">· {r.note}</span>}</p><p className="truncate text-slate-600 dark:text-slate-400" title={r.value}>{r.value}</p></div></li>)}</ul>
        )}
      </div>
    </div>
  );
}
