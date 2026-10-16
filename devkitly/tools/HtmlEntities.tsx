"use client";
import TwoPane from "./_TwoPane";

const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const encode = (s: string) => s.replace(/[&<>"']/g, (c) => map[c]);
const decode = (s: string) => { const d = document.createElement("textarea"); d.innerHTML = s; return d.value; };

export default function HtmlEntities() {
  return <TwoPane sample={`<a href="/x?a=1&b=2">Tom & Jerry's "show"</a>`} inputPlaceholder="Paste HTML or text…" modes={[
    { key: "encode", label: "Encode", run: encode },
    { key: "decode", label: "Decode", run: decode },
  ]} />;
}
