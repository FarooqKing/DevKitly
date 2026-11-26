"use client";
import { useMemo, useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");
  const [showTable, setShowTable] = useState(false);

  const r = useMemo(() => {
    const P = +amount, i = +rate / 100 / 12, n = +years * 12;
    if (!P || !n) return null;
    const emi = i ? (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : P / n;
    const total = emi * n;
    let bal = P; const rows: { m: number; interest: number; principal: number; bal: number }[] = [];
    for (let m = 1; m <= n; m++) { const int = bal * i; const pr = emi - int; bal = Math.max(0, bal - pr); rows.push({ m, interest: int, principal: pr, bal }); }
    return { emi, total, interest: total - P, rows, n };
  }, [amount, rate, years]);

  return (
    <Layout
      form={<>
        <Field label="Loan amount" value={amount} onChange={setAmount} min={0} />
        <Field label="Annual interest rate" value={rate} onChange={setRate} suffix="%" step={0.1} min={0} />
        <Field label="Loan term" value={years} onChange={setYears} suffix="years" min={0} step={0.5} />
        <input type="range" min={1} max={30} value={+years || 1} onChange={(e) => setYears(e.target.value)} className="w-full accent-brand-600" aria-label="Term slider" />
      </>}
      results={r && <>
        <Stats>
          <Stat big label="Monthly payment (EMI)" value={fmt(r.emi)} copy />
          <Stat label="Total interest" value={fmt(r.interest)} />
          <Stat label="Total payment" value={fmt(r.total)} />
          <Stat label="Interest share" value={`${fmt((r.interest / r.total) * 100, 1)}%`} />
          <Stat label="Payments" value={`${r.n} months`} />
        </Stats>
        <div className="card p-4">
          <div className="flex h-3 overflow-hidden rounded-full"><div className="bg-brand-600" style={{ width: `${(+amount / r.total) * 100}%` }} /><div className="flex-1 bg-amber-400" /></div>
          <p className="mt-2 text-xs text-slate-500"><span className="inline-block h-2 w-2 rounded-full bg-brand-600" /> Principal {fmt(+amount)} &nbsp; <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Interest {fmt(r.interest)}</p>
        </div>
        <button className="btn" onClick={() => setShowTable((s) => !s)}>{showTable ? "Hide" : "Show"} amortization schedule</button>
        {showTable && (
          <div className="card max-h-96 overflow-auto"><table className="w-full text-xs"><thead className="sticky top-0 bg-slate-100 dark:bg-slate-800"><tr><th className="px-3 py-2 text-left">Month</th><th className="px-3 py-2 text-right">Principal</th><th className="px-3 py-2 text-right">Interest</th><th className="px-3 py-2 text-right">Balance</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{r.rows.map((x) => <tr key={x.m}><td className="px-3 py-1.5">{x.m}</td><td className="px-3 py-1.5 text-right tabular-nums">{fmt(x.principal)}</td><td className="px-3 py-1.5 text-right tabular-nums">{fmt(x.interest)}</td><td className="px-3 py-1.5 text-right tabular-nums">{fmt(x.bal)}</td></tr>)}</tbody></table></div>
        )}
      </>}
    />
  );
}
