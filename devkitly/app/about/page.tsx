import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = { title: "About", description: `What ${siteConfig.name} is and how it handles your data.` };

export default function About() {
  const host = siteConfig.url.replace("https://", "");
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold tracking-tight">About {siteConfig.name}</h1>
      <div className="prose-tool mt-6">
        <p>{siteConfig.name} is a collection of small, focused utilities for developers. Each tool solves one problem well and loads in well under a second.</p>
        <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-slate-100">Privacy</h2>
        <p>All processing happens in your browser. We do not receive, log or store anything you type, paste or drop. The site may use privacy-respecting analytics to count page views.</p>
        <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-slate-100">Request a tool or report a bug</h2>
        <p>Email <a className="text-brand-600 underline" href={`mailto:hello@${host}`}>hello@{host}</a> or open an issue on GitHub.</p>
      </div>
    </main>
  );
}
