import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, WifiOff, Lock, Sparkles, Gift, Smartphone } from "lucide-react";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import SearchBox from "@/components/SearchBox";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";
import BackToTop from "@/components/BackToTop";

const homeFaq = [
  { q: "Are these tools really free?", a: "Yes. Every tool is free with no sign-up, no usage limits and no watermarks. The site is supported by unobtrusive advertising." },
  { q: "Is it safe to use with confidential files?", a: "Yes. Almost every tool runs entirely in your browser, so files, text and numbers never leave your device. The few tools that need our server (speed test, link checker, YouTube info) are clearly labelled and store nothing." },
  { q: "Do I need to install anything?", a: "No. Everything works in a modern browser on desktop, Android and iPhone. Once a page has loaded, most tools even work offline." },
  { q: "Can you add a tool I need?", a: "Probably. Use the contact page to tell us what would save you time; the most-requested tools get built first." },
];
const features = [
  { icon: Lock, t: "Private by design", d: "Files and text are processed on your device. We never see them." },
  { icon: Zap, t: "Instant results", d: "No upload queue, no waiting room. Most tools respond as you type." },
  { icon: Gift, t: "Free, no limits", d: "No accounts, no trials, no watermarks, no daily caps." },
  { icon: Smartphone, t: "Works everywhere", d: "Desktop, Android, iPhone. Offline once loaded." },
];

export default function Home() {
  const popular = tools.filter((t) => t.popular).slice(0, 12);
  return (
    <main>
      <section className="hero relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="hero-blob -left-20 -top-20 h-96 w-96 bg-brand-400" /><div className="hero-blob -right-24 top-10 h-[28rem] w-[28rem] bg-violet-400" style={{ animationDelay: "-5s" }} /><div className="hero-blob bottom-0 left-1/3 h-72 w-72 bg-pink-300" style={{ animationDelay: "-9s" }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"><Sparkles size={13} className="text-brand-600" /> {tools.length} free tools · {categories.length} categories · no sign-up</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Free online tools that <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">just work.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">PDF, SEO, social media, video &amp; audio, calculators and developer utilities — fast, private and free. Nothing to install, nothing to upload.</p>
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-gradient-to-r from-brand-500/30 via-violet-500/30 to-pink-500/30 p-[2px] shadow-xl shadow-brand-600/10"><div className="rounded-[14px] bg-white p-1 dark:bg-slate-900"><SearchBox autoFocus /></div></div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-600" /> Runs in your browser</li>
            <li className="flex items-center gap-1.5"><Zap size={16} className="text-amber-500" /> Instant results</li>
            <li className="flex items-center gap-1.5"><WifiOff size={16} className="text-sky-500" /> Works offline once loaded</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <section>
          <div className="text-center"><span className="eyebrow">Browse</span><h2 className="section-title">Pick a category</h2></div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => { const n = tools.filter((t) => t.category === c.name).length; return <Link key={c.slug} href={`/category/${c.slug}`} className="cat-card"><span className={`grid h-12 w-12 place-items-center rounded-xl ${c.color}`}><Icon name={c.icon} size={24} /></span><span className="font-semibold">{c.name}</span><span className="text-xs text-slate-500">{n} tools</span></Link>; })}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-4"><div><span className="eyebrow">Most used</span><h2 className="section-title">Popular tools</h2></div><Link href="/tools" className="btn shrink-0">All {tools.length} tools <ArrowRight size={15} /></Link></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((f) => <div key={f.t} className="feature"><div className="ic"><f.icon size={20} /></div><h3 className="font-semibold">{f.t}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.d}</p></div>)}</section>

        {categories.map((c) => {
          const list = tools.filter((t) => t.category === c.name);
          return (
            <section key={c.slug} id={c.slug} className="mt-20 scroll-mt-20">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3"><span className={`grid h-11 w-11 place-items-center rounded-xl ${c.color}`}><Icon name={c.icon} size={22} /></span><div><h2 className="text-2xl font-bold tracking-tight">{c.name}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{c.blurb}</p></div></div>
                <Link href={`/category/${c.slug}`} className="shrink-0 text-sm font-medium text-brand-600 hover:underline">All {list.length} →</Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, 6).map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
            </section>
          );
        })}

        <section className="mt-24"><div className="text-center"><span className="eyebrow">Simple</span><h2 className="section-title">How it works</h2></div>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">{[["Pick a tool", "Search or browse by category. Pages load instantly."], ["Add your input", "Type, paste or drop a file. It stays in your browser tab."], ["Get the result", "Copy or download. Nothing is stored anywhere."]].map(([t, d], i) => <li key={t} className="feature text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-violet-600 font-bold text-white shadow-md shadow-brand-600/30">{i + 1}</span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{d}</p></li>)}</ol>
        </section>

        <section className="mx-auto mt-24 max-w-3xl"><div className="text-center"><span className="eyebrow">FAQ</span><h2 className="section-title">Frequently asked questions</h2></div><div className="mt-8"><Faq items={homeFaq} /></div></section>

        <section className="relative mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-violet-600 to-pink-500 p-8 text-white shadow-xl shadow-brand-600/20 sm:p-12">
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Missing a tool?</h2><p className="mt-1 text-white/85">Tell us what would save you time and we&apos;ll build it.</p></div><Link href="/contact" className="btn border-white bg-white text-brand-700 hover:bg-white/90">Request a tool <ArrowRight size={16} /></Link></div>
        </section>
      </div>
      <BackToTop />
    </main>
  );
}
