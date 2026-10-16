"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Props { accept: string; multiple?: boolean; onFiles: (files: File[]) => void; label: string; hint?: string; compact?: boolean }

export default function FileDrop({ accept, multiple, onFiles, label, hint, compact }: Props) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handle = (list: FileList | null) => { if (!list) return; const files = Array.from(list); onFiles(multiple ? files : files.slice(0, 1)); };
  return (
    <div role="button" tabIndex={0} onClick={() => ref.current?.click()} onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      className={`card flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed text-center transition ${compact ? "p-5" : "p-10"} ${drag ? "border-brand-500 bg-brand-50 dark:bg-brand-600/10" : "hover:border-brand-400"}`}>
      <Upload size={compact ? 20 : 28} className="text-brand-600" />
      <span className="font-medium">{label}</span>
      {hint && <span className="text-sm text-slate-500">{hint}</span>}
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
