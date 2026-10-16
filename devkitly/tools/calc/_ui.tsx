"use client";
import CopyButton from "@/components/CopyButton";

export const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: Number.isInteger(n) ? 0 : d }) : "—");

export function Field({ label, value, onChange, suffix, prefix, min, max, step, type = "number", id }: { label: string; value: string | number; onChange: (v: string) => void; suffix?: string; prefix?: string; min?: number; max?: number; step?: number; type?: string; id?: string }) {
  const _id = id ?? label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <label className="label" htmlFor={_id}>{label}</label>
      <div className="relative mt-1">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{prefix}</span>}
        <input id={_id} type={type} inputMode={type === "number" ? "decimal" : undefined} value={value} min={min} max={max} step={step} onChange={(e) => onChange(e.target.value)} className={`field ${prefix ? "pl-8" : ""} ${suffix ? "pr-14" : ""}`} />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

export function Stat({ label, value, big, copy }: { label: string; value: string; big?: boolean; copy?: boolean }) {
  return (
    <div className={`${big ? "col-span-2 bg-brand-50 dark:bg-brand-600/10" : "bg-white dark:bg-slate-900"} p-4`}>
      <p className="text-xs text-slate-500">{label}</p>
      <div className="flex items-center gap-2"><p className={`${big ? "text-3xl text-brand-700 dark:text-brand-500" : "text-xl"} font-semibold tabular-nums`}>{value}</p>{copy && <CopyButton text={value} label="" className="btn-ghost h-7 w-7 px-0" />}</div>
    </div>
  );
}

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className="card grid grid-cols-2 gap-px overflow-hidden bg-slate-200 dark:bg-slate-800">{children}</div>;
}

export function Layout({ form, results }: { form: React.ReactNode; results: React.ReactNode }) {
  return <div className="grid max-w-4xl gap-5 lg:grid-cols-[1fr_1.1fr]"><div className="card space-y-4 p-5 h-fit">{form}</div><div className="space-y-4">{results}</div></div>;
}
