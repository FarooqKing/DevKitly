"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
const presets = [["facebook", "social", "Facebook"], ["instagram", "social", "Instagram"], ["twitter", "social", "Twitter / X"], ["linkedin", "social", "LinkedIn"], ["newsletter", "email", "Newsletter"], ["google", "cpc", "Google Ads"], ["youtube", "video", "YouTube"], ["whatsapp", "messaging", "WhatsApp"]];
export default function UtmBuilder() {
  const [f, setF] = useState({ url: "https://example.com/landing", source: "facebook", medium: "social", campaign: "spring_sale", term: "", content: "" });
  const set = (k: keyof typeof f, v: string) => setF((o) => ({ ...o, [k]: v }));
  const out = useMemo(() => { try { const u = new URL(f.url); (["source", "medium", "campaign", "term", "content"] as const).forEach((k) => { if (f[k].trim()) u.searchParams.set(`utm_${k}`, f[k].trim()); }); return u.toString(); } catch { return ""; } }, [f]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><label className="label" htmlFor="u">Website URL *</label><input id="u" className="field mt-1" value={f.url} onChange={(e) => set("url", e.target.value)} /></div>
        <div><p className="label">Quick presets</p><div className="mt-1.5 flex flex-wrap gap-1.5">{presets.map(([s, m, l]) => <button key={s} className="btn h-7 px-2 text-xs" onClick={() => { set("source", s); set("medium", m); }}>{l}</button>)}</div></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Source * <span className="normal-case text-slate-400">(utm_source)</span></label><input className="field mt-1" value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="google, newsletter" /></div>
          <div><label className="label">Medium * <span className="normal-case text-slate-400">(utm_medium)</span></label><input className="field mt-1" value={f.medium} onChange={(e) => set("medium", e.target.value)} placeholder="cpc, email, social" /></div>
          <div><label className="label">Campaign * <span className="normal-case text-slate-400">(utm_campaign)</span></label><input className="field mt-1" value={f.campaign} onChange={(e) => set("campaign", e.target.value)} placeholder="spring_sale" /></div>
          <div><label className="label">Term <span className="normal-case text-slate-400">(utm_term)</span></label><input className="field mt-1" value={f.term} onChange={(e) => set("term", e.target.value)} placeholder="paid keyword" /></div>
          <div className="sm:col-span-2"><label className="label">Content <span className="normal-case text-slate-400">(utm_content)</span></label><input className="field mt-1" value={f.content} onChange={(e) => set("content", e.target.value)} placeholder="banner_top, text_link" /></div>
        </div>
        <p className="text-xs text-slate-500">Use lowercase and underscores; UTM values are case-sensitive in Google Analytics.</p>
      </div>
      <div className="card h-fit p-5"><div className="flex items-center justify-between"><span className="label">Campaign URL</span><CopyButton text={out} className="btn-ghost h-8 px-2" /></div><p className="mt-2 break-all font-mono text-sm text-brand-700 dark:text-brand-500">{out || <span className="text-red-600">Enter a valid URL</span>}</p>
        {out && <table className="mt-4 w-full text-xs"><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{[...new URL(out).searchParams.entries()].map(([k, v]) => <tr key={k}><td className="py-1.5 font-mono text-slate-500">{k}</td><td className="py-1.5 font-mono">{v}</td></tr>)}</tbody></table>}</div>
    </div>
  );
}
