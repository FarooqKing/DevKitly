"use client";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { fmtSize } from "@/lib/files";

interface Props { files: File[]; onChange: (f: File[]) => void; reorder?: boolean; meta?: (f: File, i: number) => React.ReactNode }

export default function FileList({ files, onChange, reorder, meta }: Props) {
  if (!files.length) return null;
  const move = (i: number, d: number) => { const n = [...files]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <ul className="card divide-y divide-slate-200 dark:divide-slate-800">
      {files.map((f, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
          <span className="w-6 text-slate-400">{i + 1}.</span>
          <span className="min-w-0 flex-1 truncate font-medium" title={f.name}>{f.name}</span>
          <span className="text-slate-500">{meta ? meta(f, i) : fmtSize(f.size)}</span>
          {reorder && <><button className="btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button><button className="btn-icon" onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label="Move down"><ArrowDown size={14} /></button></>}
          <button className="btn-icon" onClick={() => onChange(files.filter((_, j) => j !== i))} aria-label="Remove"><X size={14} /></button>
        </li>
      ))}
    </ul>
  );
}
