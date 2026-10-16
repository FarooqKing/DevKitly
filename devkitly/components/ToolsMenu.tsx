"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { tools, categories } from "@/lib/tools";
import Icon from "./Icon";
import SearchBox from "./SearchBox";

export default function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { document.body.style.overflow = open && window.innerWidth < 768 ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return (
    <div ref={ref} className="order-last md:order-none md:relative">
      {/* Desktop trigger */}
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn btn-ghost hidden md:inline-flex">
        Tools <ChevronDown size={15} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {/* Mobile trigger */}
      <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="btn-icon md:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>

      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:absolute md:inset-auto md:left-0 md:top-full md:mt-2 md:w-[52rem] md:max-h-[80vh] md:rounded-xl md:border md:p-5 md:shadow-xl">
          <div className="mb-4 md:hidden"><SearchBox compact /></div>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((c) => (
              <div key={c.name}>
                <p className="label px-2">{c.name}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {tools.filter((t) => t.category === c.name).map((t) => {
                    const active = path === `/tools/${t.slug}`;
                    return (
                      <li key={t.slug}>
                        <Link href={`/tools/${t.slug}`} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm ${active ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-600/15 dark:text-brand-500" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                          <Icon name={t.icon} size={16} className="shrink-0 text-brand-600 dark:text-brand-500" /> {t.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4 text-sm md:hidden dark:border-slate-800">
            <Link href="/" className="btn flex-1">Home</Link><Link href="/about" className="btn flex-1">About</Link>
          </div>
        </div>
      )}
    </div>
  );
}
