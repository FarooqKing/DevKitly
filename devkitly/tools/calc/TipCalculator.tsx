"use client";
import { useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

export default function TipCalculator() {
  const [bill, setBill] = useState("1200");
  const [tip, setTip] = useState("15");
  const [people, setPeople] = useState("2");
  const [round, setRound] = useState(false);
  const b = +bill || 0, t = (b * (+tip || 0)) / 100, n = Math.max(1, +people || 1);
  let total = b + t; if (round) total = Math.ceil(total);
  const tipFinal = total - b;

  return (
    <Layout
      form={<>
        <Field label="Bill amount" value={bill} onChange={setBill} min={0} />
        <Field label="Tip" value={tip} onChange={setTip} suffix="%" min={0} />
        <div className="flex flex-wrap gap-1.5">{[5, 10, 12, 15, 18, 20, 25].map((d) => <button key={d} className="btn h-7 px-2 text-xs" onClick={() => setTip(String(d))}>{d}%</button>)}</div>
        <Field label="Split between" value={people} onChange={setPeople} suffix="people" min={1} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} /> Round total up</label>
      </>}
      results={<Stats>
        <Stat big label="Each person pays" value={fmt(total / n)} copy />
        <Stat label="Tip amount" value={fmt(tipFinal)} />
        <Stat label="Total bill" value={fmt(total)} />
        <Stat label="Tip per person" value={fmt(tipFinal / n)} />
        <Stat label="Bill per person (no tip)" value={fmt(b / n)} />
      </Stats>}
    />
  );
}
