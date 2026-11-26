import Link from "next/link";
import { Github, Twitter, Wrench, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";

const popular = tools.filter((t) => t.popular).slice(0, 8);

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="h-1 bg-gradient-to-r from-brand-600 via-violet-600 to-pink-500" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-white"><Wrench size={16} /></span>{siteConfig.name}</Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">{siteConfig.tagline}. Every tool runs on your device; nothing is uploaded.</p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"><ShieldCheck size={13} /> 100% browser-based · no uploads</p>
            <div className="mt-5 flex gap-2">
              <a href={siteConfig.github} target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub"><Github size={17} /></a>
              <a href={`https://twitter.com/${siteConfig.twitter.replace("@", "")}`} target="_blank" rel="noreferrer" className="btn-icon" aria-label="Twitter"><Twitter size={17} /></a>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Categories</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {categories.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}`} className="hover:text-slate-900 dark:hover:text-white">{c.name} <span className="text-slate-400">({tools.filter((t) => t.category === c.name).length})</span></Link></li>)}
              <li><Link href="/tools" className="font-medium text-brand-600 hover:underline">All {tools.length} tools →</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Popular</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">{popular.map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}`} className="hover:text-slate-900 dark:hover:text-white">{t.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact / Request a tool</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-slate-900 dark:hover:text-white">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Made with care · Free forever · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link></p>
        </div>
      </div>
    </footer>
  );
}
