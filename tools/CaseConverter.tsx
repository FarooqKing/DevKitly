"use client";
import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const words = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_\-]+/g, " ").trim().split(/\s+/).filter(Boolean);
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const cases = [
  { name: "camelCase", fn: (s: string) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join("") },
  { name: "PascalCase", fn: (s: string) => words(s).map(cap).join("") },
  { name: "snake_case", fn: (s: string) => words(s).map((w) => w.toLowerCase()).join("_") },
  { name: "SCREAMING_SNAKE", fn: (s: string) => words(s).map((w) => w.toUpperCase()).join("_") },
  { name: "kebab-case", fn: (s: string) => words(s).map((w) => w.toLowerCase()).join("-") },
  { name: "Title Case", fn: (s: string) => words(s).map(cap).join(" ") },
  { name: "Sentence case", fn: (s: string) => { const w = words(s).map((x) => x.toLowerCase()); return w.length ? [cap(w[0]), ...w.slice(1)].join(" ") : ""; } },
  { name: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { name: "lowercase", fn: (s: string) => s.toLowerCase() },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  return (
    <div className="max-w-3xl">
      <textarea className="textarea h-32" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type text, e.g. user profile settings" />
      <ul className="mt-6 divide-y divide-slate-200 card dark:divide-slate-800">
        {cases.map((c) => {
          const out = input ? c.fn(input) : "";
          return (
            <li key={c.name} className="flex items-center gap-4 px-4 py-3">
              <span className="w-36 shrink-0 text-sm text-slate-500 dark:text-slate-400">{c.name}</span>
              <code className="min-w-0 flex-1 truncate font-mono text-sm">{out || <span className="text-slate-400">—</span>}</code>
              <CopyButton text={out} className="btn-ghost h-8 px-2" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
