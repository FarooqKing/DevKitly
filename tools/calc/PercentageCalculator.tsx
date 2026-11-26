"use client";
import { useState } from "react";
import { fmt } from "./_ui";

function Row({ children }: { children: React.ReactNode }) { return <div className="card flex flex-wrap items-center gap-2 p-4 text-sm">{children}</div>; }
function In({ v, set, w = "w-24" }: { v: string; set: (s: string) => void; w?: string }) { return <input type="number" inputMode="decimal" className={`field ${w} py-1.5`} value={v} onChange={(e) => set(e.target.value)} />; }
function Out({ v }: { v: number }) { return <strong className="ml-auto rounded-lg bg-brand-50 px-3 py-1.5 font-mono text-base text-brand-700 dark:bg-brand-600/15 dark:text-brand-500">{fmt(v, 4)}</strong>; }

export default function PercentageCalculator() {
  const [a1, setA1] = useState("15"), [b1, setB1] = useState("200");
  const [a2, setA2] = useState("30"), [b2, setB2] = useState("200");
  const [a3, setA3] = useState("200"), [b3, setB3] = useState("250");
  const [a4, setA4] = useState("500"), [b4, setB4] = useState("20");
  const [a5, setA5] = useState("500"), [b5, setB5] = useState("20");
  return (
    <div className="max-w-3xl space-y-3">
      <Row>What is <In v={a1} set={setA1} w="w-20" /> % of <In v={b1} set={setB1} />? <Out v={(+a1 / 100) * +b1} /></Row>
      <Row><In v={a2} set={setA2} /> is what percent of <In v={b2} set={setB2} />? <Out v={(+a2 / +b2) * 100} /></Row>
      <Row>Percentage change from <In v={a3} set={setA3} /> to <In v={b3} set={setB3} />: <Out v={((+b3 - +a3) / Math.abs(+a3)) * 100} /></Row>
      <Row><In v={a4} set={setA4} /> increased by <In v={b4} set={setB4} w="w-20" /> % = <Out v={+a4 * (1 + +b4 / 100)} /></Row>
      <Row><In v={a5} set={setA5} /> decreased by <In v={b5} set={setB5} w="w-20" /> % = <Out v={+a5 * (1 - +b5 / 100)} /></Row>
    </div>
  );
}
