"use client";
import { useMemo, useState } from "react";
import { marked } from "marked";
import Pane from "@/components/Pane";
import CopyButton from "@/components/CopyButton";

const sample = `# Project title

A short description with **bold**, _italic_ and \`inline code\`.

## Features
- Live preview
- Tables and lists
- [Links](https://example.com)

| Tool | Status |
|------|--------|
| JSON | ✅ |
| JWT  | ✅ |

\`\`\`js
console.log("hello");
\`\`\``;

export default function MarkdownPreview() {
  const [md, setMd] = useState(sample);
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Pane title="Markdown" value={md} onChange={setMd} placeholder="Write Markdown…" accept=".md,.txt" />
      <section className="card flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
          <div className="seg"><button aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>Preview</button><button aria-pressed={tab === "html"} onClick={() => setTab("html")}>HTML</button></div>
          <CopyButton text={html} label="Copy HTML" className="btn-ghost ml-auto h-8 px-2" />
        </header>
        {tab === "preview"
          ? <div className="md-preview min-h-[18rem] flex-1 overflow-auto p-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
          : <pre className="min-h-[18rem] flex-1 overflow-auto p-3 font-mono text-sm leading-relaxed">{html}</pre>}
      </section>
    </div>
  );
}
