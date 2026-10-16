"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools, categories } from "@/lib/tools";
import Icon from "./Icon";

export default function Sidebar() {
  const path = usePathname();
  return (
    <nav aria-label="All tools" className="space-y-6">
      {categories.map((c) => (
        <div key={c.name}>
          <Link href={`/category/${c.slug}`} className="label block px-2 hover:text-brand-600">{c.name}</Link>
          <ul className="mt-2 space-y-0.5">
            {tools.filter((t) => t.category === c.name).map((t) => {
              const active = path === `/tools/${t.slug}`;
              return (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm ${active ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-600/15 dark:text-brand-500" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}>
                    <Icon name={t.icon} size={16} className="shrink-0" /> {t.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
