"use client";
import TwoPane from "./_TwoPane";

const minify = (css: string) => css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>~+])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();

const sample = `/* Buttons */
.btn {
  display: inline-flex;
  padding: 8px 16px;
  border-radius: 8px;
}

.btn:hover { background: #4f46e5; color: white; }`;

export default function CssMinifier({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample={sample} filename="style.min.css" inputPlaceholder="Paste CSS…" modes={[
    { key: "minify", label: "Minify", run: minify },
    { key: "beautify", label: "Beautify", run: (s) => minify(s).replace(/\{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/\s*\}/g, "\n}\n").replace(/\n  \n/g, "\n") },
  ]} />;
}
