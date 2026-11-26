"use client";
import { useState } from "react";
import CopyButton from "@/components/CopyButton";

type RGB = { r: number; g: number; b: number };
const toHex = ({ r, g, b }: RGB) => "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
const toHsl = ({ r, g, b }: RGB) => {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};
function parse(s: string): RGB | null {
  s = s.trim(); let m;
  if ((m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i))) { let h = m[1]; if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }; }
  if ((m = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i))) return { r: +m[1], g: +m[2], b: +m[3] };
  if ((m = s.match(/^hsla?\(\s*(\d+)[\s,]+(\d+)%?[\s,]+(\d+)%?/i))) { const h = +m[1] / 360, sat = +m[2] / 100, l = +m[3] / 100;
    const f = (n: number) => { const k = (n + h * 12) % 12, a = sat * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
    return { r: f(0), g: f(8), b: f(4) }; }
  return null;
}

export default function ColorConverter() {
  const [input, setInput] = useState("#4f46e5");
  const rgb = parse(input);
  const hex = rgb ? toHex(rgb) : ""; const hsl = rgb ? toHsl(rgb) : null;
  const rows = rgb ? [["HEX", hex], ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`], ["HSL", `hsl(${hsl!.h}, ${hsl!.s}%, ${hsl!.l}%)`], ["CSS vars", `${rgb.r} ${rgb.g} ${rgb.b}`]] : [];

  return (
    <div className="grid gap-4 max-w-3xl sm:grid-cols-[12rem_1fr]">
      <div className="card flex flex-col items-center gap-3 p-4">
        <div className="h-32 w-full rounded-lg border border-slate-200 dark:border-slate-700" style={{ background: hex || "transparent" }} />
        <input type="color" value={hex || "#000000"} onChange={(e) => setInput(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-slate-300 dark:border-slate-700" aria-label="Pick color" />
      </div>
      <div className="card p-4">
        <label className="label" htmlFor="c">Enter any color</label>
        <input id="c" className={`field mt-1 font-mono ${input && !rgb ? "border-red-500" : ""}`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="#4f46e5, rgb(79,70,229), hsl(243,75%,59%)" />
        {input && !rgb && <p className="mt-2 text-sm text-red-600">Unrecognised color format.</p>}
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map(([k, v]) => <div key={k} className="flex items-center justify-between py-2"><span className="text-sm text-slate-500">{k}</span><div className="flex items-center gap-2"><code className="font-mono text-sm">{v}</code><CopyButton text={v} label="" className="btn-ghost h-7 w-7 px-0" /></div></div>)}
        </div>
      </div>
    </div>
  );
}
