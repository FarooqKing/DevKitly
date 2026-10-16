import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, WifiOff, Globe, Code2, Heart, ArrowRight } from "lucide-react";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "About", description: `What ${siteConfig.name} is, how it works and how it handles your data.`, alternates: { canonical: "/about" } };

const values = [
  { icon: ShieldCheck, title: "Private by design", text: "Every tool runs in your browser. Files, text and numbers you enter are processed on your device and never sent to a server." },
  { icon: Zap, title: "Instant", text: "No upload queue, no processing wait, no “your file is ready” email. Results appear as you type or seconds after you drop a file." },
  { icon: WifiOff, title: "Works offline", text: "Once a tool page has loaded, it keeps working without an internet connection. Handy on flights and flaky Wi-Fi." },
  { icon: Globe, title: "Free, no account", text: "No sign-up, no trial limits, no watermarks. Supported by unobtrusive advertising so the tools stay free for everyone." },
  { icon: Code2, title: "Built on open standards", text: "Powered by well-tested open-source libraries such as pdf.js, pdf-lib and SheetJS, running on modern web APIs." },
  { icon: Heart, title: "Made for real tasks", text: "Each tool exists because someone needed it: merging a scanned contract, checking an EMI, decoding a token at 2 a.m." },
];

export default function About() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight">About {siteConfig.name}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{siteConfig.name} is a collection of {tools.length} small, focused tools for the everyday jobs that usually mean hunting for an app, signing up for a service or uploading a private file somewhere you don&apos;t trust.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <div className="grid gap-4 text-center sm:grid-cols-3">
          {[[`${tools.length}+`, "free tools"], [`${categories.length}`, "categories"], ["0", "files uploaded, ever"]].map(([n, l]) => <div key={l} className="card p-6"><p className="text-4xl font-bold text-brand-600">{n}</p><p className="mt-1 text-sm text-slate-500">{l}</p></div>)}
        </div>

        <h2 className="mt-16 text-2xl font-semibold">What we believe</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => <div key={v.title} className="card p-5"><v.icon size={22} className="text-brand-600" /><h3 className="mt-3 font-semibold">{v.title}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{v.text}</p></div>)}
        </div>

        <h2 className="mt-16 text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[["Open a tool", "Pick one from the menu or search. Pages are static and load in under a second."], ["Add your input", "Type, paste or drop a file. Everything stays in the browser tab."], ["Get the result", "Copy it or download it. Close the tab and nothing is left behind."]].map(([t, d], i) => (
            <li key={t} className="card p-5"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{d}</p></li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-semibold">Explore by category</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} className="card flex items-center gap-3 p-4 hover:border-brand-500"><Icon name={c.icon} size={20} className="text-brand-600" /><span><span className="block font-medium">{c.name}</span><span className="text-xs text-slate-500">{tools.filter((t) => t.category === c.name).length} tools</span></span></Link>)}
        </div>

        <section className="card mt-16 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-lg font-semibold">Have a question or an idea?</h2><p className="mt-1 text-slate-600 dark:text-slate-400">Request a tool, report a bug or just say hello.</p></div>
          <Link href="/contact" className="btn btn-primary">Contact us <ArrowRight size={16} /></Link>
        </section>
      </div>
    </main>
  );
}
