import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, WifiOff } from "lucide-react";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  const popular = tools.filter((t) => t.popular);
  return (
    <main>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Free online tools that just work.</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            {tools.length} tools for PDFs, spreadsheets, calculations and code. No sign-up, no uploads, no waiting.
          </p>
          <div className="mx-auto mt-8 max-w-xl"><SearchBox autoFocus /></div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} /> Runs in your browser</li>
            <li className="flex items-center gap-1.5"><Zap size={16} /> Instant results as you type</li>
            <li className="flex items-center gap-1.5"><WifiOff size={16} /> Works offline once loaded</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <section>
          <h2 className="text-xl font-semibold">Popular tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>

        {categories.map((c) => {
          const list = tools.filter((t) => t.category === c.name);
          return (
            <section key={c.name} id={c.name.toLowerCase()} className="mt-14">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.blurb}</p>
                </div>
                <span className="text-sm text-slate-400">{list.length} tools</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => <ToolCard key={t.slug} tool={t} />)}
              </div>
            </section>
          );
        })}

        <section className="card mt-16 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Missing a tool?</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Tell us what would save you time and we&apos;ll build it.</p>
          </div>
          <Link href="/about" className="btn btn-primary">Request a tool <ArrowRight size={16} /></Link>
        </section>
      </div>
    </main>
  );
}
