"use client";
import { useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("2500");
  const [disc, setDisc] = useState("20");
  const [extra, setExtra] = useState("0");
  const [tax, setTax] = useState("0");
  const p = +price || 0;
  const afterFirst = p * (1 - (+disc || 0) / 100);
  const afterSecond = afterFirst * (1 - (+extra || 0) / 100);
  const taxed = afterSecond * (1 + (+tax || 0) / 100);
  const saved = p - afterSecond;

  return (
    <Layout
      form={<>
        <Field label="Original price" value={price} onChange={setPrice} min={0} />
        <Field label="Discount" value={disc} onChange={setDisc} suffix="%" min={0} max={100} />
        <div className="flex flex-wrap gap-1.5">{[10, 15, 20, 25, 30, 40, 50, 70].map((d) => <button key={d} className="btn h-7 px-2 text-xs" onClick={() => setDisc(String(d))}>{d}%</button>)}</div>
        <Field label="Extra discount (stacked)" value={extra} onChange={setExtra} suffix="%" min={0} max={100} />
        <Field label="Sales tax / VAT" value={tax} onChange={setTax} suffix="%" min={0} />
      </>}
      results={<Stats>
        <Stat big label="You pay" value={fmt(taxed)} copy />
        <Stat label="You save" value={fmt(saved)} />
        <Stat label="Effective discount" value={p ? `${fmt((saved / p) * 100, 1)}%` : "—"} />
        <Stat label="Price before tax" value={fmt(afterSecond)} />
        <Stat label="Tax amount" value={fmt(taxed - afterSecond)} />
      </Stats>}
    />
  );
}
