"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools";
import Icon from "./Icon";

export default function SearchBox({ compact = false, autoFocus = false }: { compact?: boolean; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return tools.filter((t) => [t.name, t.short, t.category, ...t.keywords].join(" ").toLowerCase().includes(s)).slice(0, 7);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault(); ref.current?.querySelector("input")?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  function go(slug: string) { router.push(`/tools/${slug}`); setOpen(false); setQ(""); }

  return (
    <div ref={ref} className="relative">
      <Search size={compact ? 16 : 18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          if (e.key === "Enter" && results[active]) go(results[active].slug);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={compact ? "Search tools…  /" : "Search tools, e.g. merge pdf, emi, json…"}
        className={`field pl-10 ${compact ? "py-1.5" : "py-3 text-base shadow-card"}`}
        aria-label="Search tools"
      />
      {open && results.length > 0 && (
        <ul className="card absolute z-50 mt-2 w-full overflow-hidden text-left">
          {results.map((t, i) => (
            <li key={t.slug}>
              <button onMouseDown={() => go(t.slug)} onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${i === active ? "bg-brand-50 dark:bg-slate-800" : ""}`}>
                <Icon name={t.icon} size={16} className="text-brand-600 shrink-0" />
                <span className="font-medium">{t.name}</span>
                <span className="ml-auto text-xs text-slate-400">{t.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
