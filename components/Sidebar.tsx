"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { tools, categories, categoryColor } from "@/lib/tools";
import Icon from "./Icon";

export default function Sidebar() {
  const path = usePathname();
  const current = tools.find((t) => path === `/tools/${t.slug}`)?.category;
  return (
    <nav aria-label="All tools" className="space-y-1">
      {categories.map((c) => {
        const list = tools.filter((t) => t.category === c.name);
        const open = c.name === current;
        return (
          <details key={c.name} open={open} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
              <ChevronRight size={14} className="transition group-open:rotate-90" /><Icon name={c.icon} size={14} /> {c.name} <span className="ml-auto font-normal text-slate-400">{list.length}</span>
            </summary>
            <ul className="mb-2 space-y-0.5 pl-2">
              {list.map((t) => {
                const active = path === `/tools/${t.slug}`;
                return <li key={t.slug}><Link href={`/tools/${t.slug}`} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm ${active ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-600/15 dark:text-brand-500" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}><Icon name={t.icon} size={15} className={`shrink-0 ${active ? "" : categoryColor(t.category).split(" ").filter((x) => x.includes("text-")).join(" ")}`} /> {t.name}</Link></li>;
              })}
              <li><Link href={`/category/${c.slug}`} className="block px-2 py-1 text-xs text-brand-600 hover:underline">Category page →</Link></li>
            </ul>
          </details>
        );
      })}
    </nav>
  );
}
