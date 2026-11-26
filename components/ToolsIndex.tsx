"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { categories, tools, type Category } from "@/lib/tools";
import ToolCard from "./ToolCard";

export default function ToolsIndex() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState<Category | "All">("All");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tools.filter((t) => (cat === "All" || t.category === cat) && (!s || [t.name, t.short, ...t.keywords].join(" ").toLowerCase().includes(s)));
  }, [q, cat]);
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-sm sm:flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="Search tools…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" /></div>
        <div className="flex flex-wrap gap-1.5">
          <button className={`btn h-8 px-2.5 text-xs ${cat === "All" ? "btn-primary" : ""}`} onClick={() => setCat("All")}>All</button>
          {categories.map((c) => <button key={c.slug} className={`btn h-8 px-2.5 text-xs ${cat === c.name ? "btn-primary" : ""}`} onClick={() => setCat(c.name)}>{c.name}</button>)}
        </div>
      </div>
      {list.length === 0 ? <p className="mt-10 text-center text-slate-500">No tools match “{q}”.</p> :
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>}
    </div>
  );
}
