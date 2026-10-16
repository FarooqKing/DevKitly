export default function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full bg-brand-600 transition-all" style={{ width: `${Math.round(value * 100)}%` }} /></div>
      {label && <p className="mt-1 text-xs text-slate-500">{label}</p>}
    </div>
  );
}
