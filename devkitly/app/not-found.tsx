import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">That tool doesn&apos;t exist yet.</p>
      <Link href="/" className="btn btn-primary mt-6">Browse all tools</Link>
    </main>
  );
}
