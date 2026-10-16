import type { Metadata } from "next";
import { Mail, Bug, Lightbulb, Github } from "lucide-react";
import { siteConfig } from "@/site.config";
import ContactForm from "@/components/ContactForm";
export const metadata: Metadata = { title: "Contact", description: `Request a tool, report a bug or ask a question about ${siteConfig.name}.`, alternates: { canonical: "/contact" } };
const host = siteConfig.url.replace("https://", "");

export default function Contact() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">Found a bug, want a new tool or have feedback? We read everything and reply to most messages within a couple of days.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          {[[Lightbulb, "Request a tool", "Tell us what would save you time. The most-requested tools get built first."], [Bug, "Report a bug", "Include the tool name, your browser and what you expected to happen."], [Mail, "Email", `hello@${host}`], [Github, "GitHub", "Open an issue or pull request on the repository."]].map(([I, t, d]) => {
            const Ic = I as typeof Mail;
            return <div key={t as string} className="card flex gap-3 p-4"><Ic size={20} className="mt-0.5 shrink-0 text-brand-600" /><div><p className="font-medium">{t as string}</p><p className="text-sm text-slate-600 dark:text-slate-400">{d as string}</p></div></div>;
          })}
        </div>
        <ContactForm email={`hello@${host}`} />
      </div>
    </main>
  );
}
