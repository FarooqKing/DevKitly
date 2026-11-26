import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";
import { categoryColor } from "@/lib/tools";
import Icon from "./Icon";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  const color = categoryColor(tool.category);
  return (
    <Link href={`/tools/${tool.slug}`} className="card group relative flex items-start gap-4 overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-600/10">
      <span className={`absolute inset-x-0 top-0 h-0.5 opacity-0 transition group-hover:opacity-100 ${color.split(" ").find((x) => x.startsWith("bg-"))?.replace("-50", "-500")}`} />
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition group-hover:scale-110 ${color}`}><Icon name={tool.icon} size={21} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2"><span className="font-semibold leading-snug group-hover:text-brand-600">{tool.name}</span><ArrowUpRight size={16} className="mt-0.5 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" /></span>
        <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{tool.short}</span>
      </span>
    </Link>
  );
}
