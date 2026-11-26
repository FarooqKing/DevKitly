"use client";
import { Loader2, Search } from "lucide-react";
export default function UrlForm({ value, onChange, onSubmit, busy, label = "Analyze", children }: { value: string; onChange: (v: string) => void; onSubmit: () => void; busy: boolean; label?: string; children?: React.ReactNode }) {
  return (
    <form className="card flex flex-wrap items-center gap-3 p-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="relative min-w-[16rem] flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="https://example.com" value={value} onChange={(e) => onChange(e.target.value)} inputMode="url" required /></div>
      {children}
      <button className="btn btn-primary" type="submit" disabled={busy || !value}>{busy ? <Loader2 size={15} className="animate-spin" /> : null} {busy ? "Working…" : label}</button>
    </form>
  );
}
