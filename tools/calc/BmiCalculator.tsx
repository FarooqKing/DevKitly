"use client";
import { useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

const cats = [["Underweight", 18.5, "text-sky-600"], ["Normal", 25, "text-green-600"], ["Overweight", 30, "text-amber-600"], ["Obese", Infinity, "text-red-600"]] as const;

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [h, setH] = useState("170"); const [w, setW] = useState("70");
  const [ft, setFt] = useState("5"); const [inch, setInch] = useState("7"); const [lb, setLb] = useState("154");

  const hm = unit === "metric" ? +h / 100 : ((+ft * 12 + +inch) * 2.54) / 100;
  const kg = unit === "metric" ? +w : +lb * 0.4536;
  const bmi = hm > 0 && kg > 0 ? kg / (hm * hm) : NaN;
  const cat = cats.find((c) => bmi < c[1]);
  const lo = 18.5 * hm * hm, hi = 24.9 * hm * hm;
  const pos = Math.min(100, Math.max(0, ((bmi - 12) / (40 - 12)) * 100));

  return (
    <Layout
      form={<>
        <div className="seg w-full"><button className="flex-1" aria-pressed={unit === "metric"} onClick={() => setUnit("metric")}>Metric</button><button className="flex-1" aria-pressed={unit === "imperial"} onClick={() => setUnit("imperial")}>Imperial</button></div>
        {unit === "metric" ? <><Field label="Height" value={h} onChange={setH} suffix="cm" /><Field label="Weight" value={w} onChange={setW} suffix="kg" /></>
          : <><div className="grid grid-cols-2 gap-3"><Field label="Height" value={ft} onChange={setFt} suffix="ft" /><Field label=" " id="in" value={inch} onChange={setInch} suffix="in" /></div><Field label="Weight" value={lb} onChange={setLb} suffix="lb" /></>}
      </>}
      results={<>
        <Stats>
          <Stat big label="Your BMI" value={Number.isFinite(bmi) ? fmt(bmi, 1) : "—"} />
          <Stat label="Category" value={cat?.[0] ?? "—"} />
          <Stat label="Healthy weight range" value={Number.isFinite(bmi) ? (unit === "metric" ? `${fmt(lo, 1)}–${fmt(hi, 1)} kg` : `${fmt(lo / 0.4536, 0)}–${fmt(hi / 0.4536, 0)} lb`) : "—"} />
        </Stats>
        <div className="card p-4">
          <div className="relative h-3 rounded-full bg-gradient-to-r from-sky-400 via-green-500 via-amber-400 to-red-500">{Number.isFinite(bmi) && <div className="absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-900 dark:bg-white" style={{ left: `${pos}%` }} />}</div>
          <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Under 18.5</span><span>18.5–25</span><span>25–30</span><span>30+</span></div>
          <p className="mt-3 text-xs text-slate-500">BMI is a screening measure and doesn&apos;t account for muscle mass, age or body composition. Talk to a healthcare professional for personal advice.</p>
        </div>
      </>}
    />
  );
}
