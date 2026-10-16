import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, WifiOff } from "lucide-react";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import SearchBox from "@/components/SearchBox";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";

const homeFaq = [
  { q: "Are these tools really free?", a: "Yes. Every tool is free with no sign-up, no usage limits and no watermarks. The site is supported by unobtrusive advertising." },
  { q: "Is it safe to use with confidential files?", a: "Yes. All processing happens in your browser. Your files, text and numbers never leave your device and are never uploaded to our servers." },
  { q: "Do I need to install anything?", a: "No. Everything works in a modern browser on desktop, Android and iPhone. Once a page has loaded, it even works offline." },
  { q: "Can you add a tool I need?", a: "Probably. Use the contact page to tell us what would save you time; the most-requested tools get built first." },
];

export default function Home() {
  const popular = tools.filter((t) => t.popular);
  return (
    <main>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Free online tools that just work.</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">{tools.length} tools for PDFs, spreadsheets, calculations and code. No sign-up, no uploads, no waiting.</p>
          <div className="mx-auto mt-8 max-w-xl"><SearchBox autoFocus /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} className="btn h-8 px-3 text-xs"><Icon name={c.icon} size={14} /> {c.name}</Link>)}
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} /> Runs in your browser</li>
            <li className="flex items-center gap-1.5"><Zap size={16} /> Instant results</li>
            <li className="flex items-center gap-1.5"><WifiOff size={16} /> Works offline once loaded</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <section>
          <h2 className="text-xl font-semibold">Popular tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>

        {categories.map((c) => {
          const list = tools.filter((t) => t.category === c.name);
          return (
            <section key={c.slug} id={c.slug} className="mt-14 scroll-mt-20">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-500"><Icon name={c.icon} size={18} /></span>
                  <div><h2 className="text-xl font-semibold">{c.name}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{c.blurb}</p></div>
                </div>
                <Link href={`/category/${c.slug}`} className="shrink-0 text-sm text-brand-600 hover:underline">All {list.length} →</Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, 6).map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
            </section>
          );
        })}

        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-center">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {[["Pick a tool", "Search or browse by category. Pages load instantly."], ["Add your input", "Type, paste or drop a file. It stays in your browser tab."], ["Get the result", "Copy or download. Nothing is stored anywhere."]].map(([t, d], i) => (
              <li key={t} className="card p-6 text-center"><span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{d}</p></li>
            ))}
          </ol>
        </section>

        <section className="mt-20 mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-center">Frequently asked questions</h2>
          <div className="mt-6"><Faq items={homeFaq} /></div>
        </section>

        <section className="card mt-16 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-lg font-semibold">Missing a tool?</h2><p className="mt-1 text-slate-600 dark:text-slate-400">Tell us what would save you time and we&apos;ll build it.</p></div>
          <Link href="/contact" className="btn btn-primary">Request a tool <ArrowRight size={16} /></Link>
        </section>
      </div>
    </main>
  );
}
