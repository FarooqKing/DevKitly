import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";
import { tools } from "@/lib/tools";
import Icon from "./Icon";
import Sidebar from "./Sidebar";
import ToolCard from "./ToolCard";

export default function ToolPage({ tool, children }: { tool: ToolMeta; children: React.ReactNode }) {
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
  return (
    <div className="mx-auto max-w-[88rem] px-4 sm:px-6 py-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
      <aside className="hidden lg:block"><div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"><Sidebar /></div></aside>

      <article className="min-w-0">
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Tools</Link>
          <ChevronRight size={14} />
          <Link href={`/#${tool.category.toLowerCase()}`} className="hover:text-slate-900 dark:hover:text-white">{tool.category}</Link>
        </nav>
        <div className="mt-3 flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-500"><Icon name={tool.icon} size={24} /></span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tool.name}</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{tool.short}</p>
          </div>
        </div>

        <div className="mt-8">{children}</div>

        {/* Ad slot: AdSense approve hone ke baad yahan unit lagao */}

        <section className="mt-14 max-w-3xl">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <div className="prose-tool mt-3">{tool.about.map((p, i) => <p key={i}>{p}</p>)}</div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold">Related tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
          </section>
        )}
      </article>
    </div>
  );
}
