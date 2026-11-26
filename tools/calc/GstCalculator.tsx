"use client";
import { useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

export default function GstCalculator() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const a = +amount || 0, r = (+rate || 0) / 100;
  const net = mode === "add" ? a : a / (1 + r);
  const tax = mode === "add" ? a * r : a - net;
  const gross = net + tax;

  return (
    <Layout
      form={<>
        <div className="seg w-full"><button className="flex-1" aria-pressed={mode === "add"} onClick={() => setMode("add")}>Add tax (exclusive)</button><button className="flex-1" aria-pressed={mode === "remove"} onClick={() => setMode("remove")}>Remove tax (inclusive)</button></div>
        <Field label={mode === "add" ? "Amount before tax" : "Amount including tax"} value={amount} onChange={setAmount} min={0} />
        <Field label="Tax rate (GST / VAT / Sales tax)" value={rate} onChange={setRate} suffix="%" min={0} step={0.5} />
        <div className="flex flex-wrap gap-1.5">{[5, 7, 10, 12, 15, 17, 18, 20, 28].map((d) => <button key={d} className="btn h-7 px-2 text-xs" onClick={() => setRate(String(d))}>{d}%</button>)}</div>
      </>}
      results={<Stats>
        <Stat big label={mode === "add" ? "Total with tax" : "Net amount (before tax)"} value={fmt(mode === "add" ? gross : net)} copy />
        <Stat label="Tax amount" value={fmt(tax)} />
        <Stat label={mode === "add" ? "Net amount" : "Gross amount"} value={fmt(mode === "add" ? net : gross)} />
        <Stat label="CGST / SGST split (India)" value={`${fmt(tax / 2)} each`} />
      </Stats>}
    />
  );
}
