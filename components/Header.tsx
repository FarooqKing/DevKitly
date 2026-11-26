import Link from "next/link";
import { Github, Wrench } from "lucide-react";
import { siteConfig } from "@/site.config";
import ThemeToggle from "./ThemeToggle";
import SearchBox from "./SearchBox";
import ToolsMenu from "./ToolsMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm shadow-slate-900/[.03] dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="mr-2 flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-600/30"><Wrench size={16} /></span>
          {siteConfig.name}
        </Link>
        <ToolsMenu />
        <Link href="/tools" className="btn btn-ghost hidden md:inline-flex">All tools</Link>
        <Link href="/about" className="btn btn-ghost hidden lg:inline-flex">About</Link>
        <div className="hidden flex-1 justify-end md:flex"><div className="w-full max-w-xs"><SearchBox compact /></div></div>
        <div className="ml-auto flex items-center gap-1 md:ml-2 md:order-none">
          <a href={siteConfig.github} className="btn-icon" aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
