import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";
import Icon from "./Icon";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="card group flex items-start gap-4 p-5 transition hover:border-brand-500 hover:shadow-md">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-500">
        <Icon name={tool.icon} size={20} />
      </span>
      <span>
        <span className="block font-medium group-hover:text-brand-600">{tool.name}</span>
        <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{tool.short}</span>
      </span>
    </Link>
  );
}
