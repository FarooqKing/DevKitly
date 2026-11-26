import type { Metadata } from "next";
import { categories, tools } from "@/lib/tools";
import { Suspense } from "react";
import ToolsIndex from "@/components/ToolsIndex";

export const metadata: Metadata = { title: "All Tools", description: `Browse all ${tools.length} free online tools: PDF, Office, calculators, developer utilities and converters.`, alternates: { canonical: "/tools" } };

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">All tools</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{tools.length} tools across {categories.length} categories. Filter or search below.</p>
      <Suspense><ToolsIndex /></Suspense>
    </main>
  );
}
