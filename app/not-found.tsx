import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
export default function NotFound() {
  const popular = tools.filter((t) => t.popular).slice(0, 3);
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
      <p className="text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">That page doesn&apos;t exist or has moved. Try one of these popular tools instead.</p>
      <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn btn-primary">Go home</Link><Link href="/tools" className="btn">All tools</Link></div>
    </main>
  );
}
