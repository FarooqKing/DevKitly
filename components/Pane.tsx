"use client";
import { Download, Eraser, Upload } from "lucide-react";
import CopyButton from "./CopyButton";

interface Props {
  title: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  actions?: React.ReactNode;
  filename?: string;      // download button ke liye
  accept?: string;        // upload button ke liye
  className?: string;
}

const bytes = (s: string) => new TextEncoder().encode(s).length;
const fmt = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

export default function Pane({ title, value, onChange, placeholder, readOnly, error, actions, filename, accept, className = "" }: Props) {
  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([value], { type: "text/plain" }));
    a.download = filename ?? "output.txt"; a.click(); URL.revokeObjectURL(a.href);
  }
  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    f.text().then((t) => onChange?.(t)); e.target.value = "";
  }
  return (
    <section className={`card flex flex-col overflow-hidden ${className}`}>
      <header className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-slate-400">{value.length.toLocaleString()} chars · {fmt(bytes(value))}</span>
        <div className="ml-auto flex items-center gap-1">
          {actions}
          {!readOnly && onChange && (
            <>
              <label className="btn-icon cursor-pointer" title="Upload file"><Upload size={15} /><input type="file" className="sr-only" accept={accept} onChange={upload} /></label>
              <button className="btn-icon" title="Clear" onClick={() => onChange("")} disabled={!value}><Eraser size={15} /></button>
            </>
          )}
          {readOnly && <button className="btn-icon" title="Download" onClick={download} disabled={!value}><Download size={15} /></button>}
          <CopyButton text={value} className="btn-ghost h-8 px-2" />
        </div>
      </header>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={`min-h-[18rem] flex-1 resize-y bg-transparent p-3 font-mono text-sm leading-relaxed outline-none placeholder:text-slate-400 ${error ? "text-red-600 dark:text-red-400" : ""}`}
      />
      {error && <p className="border-t border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">{error}</p>}
    </section>
  );
}
