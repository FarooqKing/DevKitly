import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categories, getCategory, tools } from "@/lib/tools";
import { siteConfig } from "@/site.config";
import ToolCard from "@/components/ToolCard";
import Icon from "@/components/Icon";

type Props = { params: { slug: string } };
export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }
export function generateMetadata({ params }: Props): Metadata {
  const c = getCategory(params.slug); if (!c) return {};
  return { title: `Free ${c.name} Tools Online`, description: c.description, alternates: { canonical: `/category/${c.slug}` }, openGraph: { title: `Free ${c.name} Tools — ${siteConfig.name}`, description: c.description } };
}

export default function CategoryPage({ params }: Props) {
  const c = getCategory(params.slug); if (!c) notFound();
  const list = tools.filter((t) => t.category === c.name);
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: `${c.name} Tools`, description: c.description, url: `${siteConfig.url}/category/${c.slug}`,
    mainEntity: { "@type": "ItemList", itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${siteConfig.url}/tools/${t.slug}` })) } };
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="flex items-center gap-1 text-sm text-slate-500"><Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link><ChevronRight size={14} /><Link href="/tools" className="hover:text-slate-900 dark:hover:text-white">Tools</Link><ChevronRight size={14} /><span>{c.name}</span></nav>
      <div className="mt-4 flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.color}`}><Icon name={c.icon} size={24} /></span>
        <div><h1 className="text-3xl font-bold tracking-tight">{c.name} Tools</h1><p className="mt-1 max-w-2xl text-slate-600 dark:text-slate-400">{c.description}</p></div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      <section className="mt-14">
        <h2 className="text-lg font-semibold">Other categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">{categories.filter((x) => x.slug !== c.slug).map((x) => <Link key={x.slug} href={`/category/${x.slug}`} className="btn"><Icon name={x.icon} size={15} /> {x.name}</Link>)}</div>
      </section>
    </main>
  );
}
