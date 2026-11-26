import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";
import { tools, categories, categoryOf, categoryColor, toolFaqs } from "@/lib/tools";
import { siteConfig } from "@/site.config";
import Icon from "./Icon";
import Sidebar from "./Sidebar";
import ToolCard from "./ToolCard";
import Faq from "./Faq";
import ShareButton from "./ShareButton";

export default function ToolPage({ tool, children }: { tool: ToolMeta; children: React.ReactNode }) {
  const cat = categoryOf(tool.category);
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: cat.name, item: `${siteConfig.url}/category/${cat.slug}` },
    { "@type": "ListItem", position: 3, name: tool.name, item: `${siteConfig.url}/tools/${tool.slug}` }] };

  return (
    <div className="mx-auto max-w-[88rem] px-4 sm:px-6 py-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <aside className="hidden lg:block"><div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"><Sidebar /></div></aside>

      <article className="min-w-0">
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link><ChevronRight size={14} />
          <Link href={`/category/${cat.slug}`} className="hover:text-slate-900 dark:hover:text-white">{cat.name}</Link><ChevronRight size={14} />
          <span className="truncate">{tool.name}</span>
        </nav>
        <div className="mt-3 flex items-start gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${categoryColor(tool.category)}`}><Icon name={tool.icon} size={24} /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tool.name}</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{tool.short}</p>
            {tool.server && <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">Processed via our server · nothing is stored</p>}
          </div>
          <ShareButton title={tool.name} />
        </div>

        <div className="mt-8">{children}</div>

        {/* Ad slot: AdSense approve hone ke baad yahan unit lagao */}

        <section className="mt-14 max-w-3xl">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <div className="prose-tool mt-3">{tool.about.map((p, i) => <p key={i}>{p}</p>)}</div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="mt-3"><Faq items={toolFaqs(tool)} /></div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">More {cat.name} tools</h2><Link href={`/category/${cat.slug}`} className="text-sm text-brand-600 hover:underline">View all →</Link></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
          </section>
        )}
        <div className="mt-10 lg:hidden"><p className="label mb-2">Browse categories</p><div className="flex flex-wrap gap-2">{categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} className="btn h-8 px-3 text-xs"><Icon name={c.icon} size={14} /> {c.name}</Link>)}</div></div>
      </article>
    </div>
  );
}
