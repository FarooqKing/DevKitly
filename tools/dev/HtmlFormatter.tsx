"use client";
import TwoPane from "../_TwoPane";
const voids = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
function beautify(html: string) {
  const tokens = html.replace(/>\s+</g, "><").match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  let depth = 0; const out: string[] = [];
  for (const t of tokens) {
    const s = t.trim(); if (!s) continue;
    if (/^<\//.test(s)) depth = Math.max(0, depth - 1);
    out.push("  ".repeat(depth) + s);
    if (/^<\w/.test(s) && !/\/>$/.test(s)) { const tag = s.match(/^<(\w+)/)![1].toLowerCase(); if (!voids.has(tag)) depth++; }
  }
  return out.join("\n");
}
const minify = (h: string) => h.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
const sample = `<!DOCTYPE html><html><head><title>Hi</title><meta charset="utf-8"></head><body><div class="box"><h1>Hello</h1><p>World <b>bold</b></p><img src="a.png"></div></body></html>`;
export default function HtmlFormatter({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample={sample} filename="index.html" inputPlaceholder="Paste HTML…" modes={[{ key: "beautify", label: "Beautify", run: beautify }, { key: "minify", label: "Minify", run: minify }]} />;
}
