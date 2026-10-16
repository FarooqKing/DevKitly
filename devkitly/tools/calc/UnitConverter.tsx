"use client";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { fmt } from "./_ui";

type Cat = { name: string; units: Record<string, number | { to: (v: number) => number; from: (v: number) => number }> };
const cats: Cat[] = [
  { name: "Length", units: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 } },
  { name: "Weight", units: { Kilogram: 1, Gram: 0.001, Milligram: 1e-6, "Metric ton": 1000, Pound: 0.45359237, Ounce: 0.028349523, Stone: 6.35029318 } },
  { name: "Temperature", units: { Celsius: { to: (v) => v, from: (v) => v }, Fahrenheit: { to: (v) => ((v - 32) * 5) / 9, from: (v) => (v * 9) / 5 + 32 }, Kelvin: { to: (v) => v - 273.15, from: (v) => v + 273.15 } } },
  { name: "Area", units: { "Square meter": 1, "Square kilometer": 1e6, "Square foot": 0.09290304, "Square yard": 0.83612736, Acre: 4046.8564224, Hectare: 10000, Marla: 25.2929, Kanal: 505.857 } },
  { name: "Volume", units: { Liter: 1, Milliliter: 0.001, "Cubic meter": 1000, "US gallon": 3.785411784, "US quart": 0.946352946, "US cup": 0.2365882365, "Fluid ounce (US)": 0.0295735296, Tablespoon: 0.0147867648, Teaspoon: 0.00492892159 } },
  { name: "Speed", units: { "km/h": 1, "m/s": 3.6, mph: 1.609344, Knot: 1.852 } },
  { name: "Data", units: { Byte: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4, Bit: 0.125 } },
  { name: "Time", units: { Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Month: 2629800, Year: 31557600 } },
];

export default function UnitConverter() {
  const [ci, setCi] = useState(0);
  const cat = cats[ci]; const names = Object.keys(cat.units);
  const [from, setFrom] = useState(names[0]); const [to, setTo] = useState(names[1]);
  const [val, setVal] = useState("1");
  const conv = (v: number, f: string, t: string) => {
    const uf = cat.units[f], ut = cat.units[t];
    if (typeof uf === "number" && typeof ut === "number") return (v * uf) / ut;
    if (typeof uf !== "number" && typeof ut !== "number") return ut.from(uf.to(v));
    return NaN;
  };
  const out = conv(+val, from, to);
  const pick = (i: number) => { setCi(i); const n = Object.keys(cats[i].units); setFrom(n[0]); setTo(n[1]); };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex flex-wrap gap-1.5">{cats.map((c, i) => <button key={c.name} className={`btn ${ci === i ? "btn-primary" : ""}`} onClick={() => pick(i)}>{c.name}</button>)}</div>
      <div className="card grid items-end gap-3 p-5 sm:grid-cols-[1fr_auto_1fr]">
        <div><label className="label" htmlFor="v">From</label><input id="v" type="number" inputMode="decimal" className="field mt-1 text-lg" value={val} onChange={(e) => setVal(e.target.value)} /><select className="field mt-2" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From unit">{names.map((n) => <option key={n}>{n}</option>)}</select></div>
        <button className="btn-icon mb-12 justify-self-center" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap"><ArrowLeftRight size={16} /></button>
        <div><p className="label">To</p><div className="field mt-1 bg-brand-50 text-lg font-semibold text-brand-700 dark:bg-brand-600/10 dark:text-brand-500">{fmt(out, 6)}</div><select className="field mt-2" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To unit">{names.map((n) => <option key={n}>{n}</option>)}</select></div>
      </div>
      <div className="card p-4"><p className="mb-2 text-sm font-medium">{val || 0} {from} equals</p>
        <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">{names.filter((n) => n !== from).map((n) => <li key={n} className="flex justify-between border-b border-slate-100 py-1 dark:border-slate-800"><span className="text-slate-500">{n}</span><span className="font-mono tabular-nums">{fmt(conv(+val, from, n), 6)}</span></li>)}</ul></div>
    </div>
  );
}
