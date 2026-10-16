"use client";
import { Download, RotateCcw } from "lucide-react";
import { fmtSize } from "@/lib/files";

export default function Result({ before, after, onDownload, onReset, children, label = "Download PDF" }: { before?: number; after: number; onDownload: () => void; onReset: () => void; children?: React.ReactNode; label?: string }) {
  const pct = before ? Math.round((after / before - 1) * 100) : null;
  return (
    <div className="card mt-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <p className="font-medium">Ready</p>
          <p className="text-sm text-slate-500">{before !== undefined && <>{fmtSize(before)} → </>}{fmtSize(after)}{pct !== null && <span className={`ml-1 ${pct < 0 ? "text-green-600" : "text-amber-600"}`}>({pct > 0 ? "+" : ""}{pct}%)</span>}</p>
        </div>
        <button className="btn" onClick={onReset}><RotateCcw size={15} /> Start over</button>
        <button className="btn btn-primary" onClick={onDownload}><Download size={15} /> {label}</button>
      </div>
      {children}
    </div>
  );
}
