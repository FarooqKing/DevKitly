import Link from "next/link";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-6">
        <div className="md:col-span-2">
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">{siteConfig.tagline}. Everything runs on your device; nothing is uploaded.</p>
        </div>
        {categories.map((c) => (
          <div key={c.name}>
            <p className="text-sm font-medium">{c.name}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {tools.filter((t) => t.category === c.name).map((t) => (
                <li key={t.slug}><Link href={`/tools/${t.slug}`} className="hover:text-slate-900 dark:hover:text-white">{t.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-slate-500">© {new Date().getFullYear()} {siteConfig.name}. Free to use.</p>
      </div>
    </footer>
  );
}
