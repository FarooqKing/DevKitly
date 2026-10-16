"use client";
import { useMemo, useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "./_ui";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState("100000");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState("12");

  const r = useMemo(() => {
    const P = +principal || 0, c = +monthly || 0, n = +freq, t = +years, i = +rate / 100 / n;
    if (!t) return null;
    const rows: { y: number; bal: number; invested: number }[] = [];
    let bal = P, invested = P; const perPeriodContribution = (c * 12) / n;
    for (let p = 1; p <= n * t; p++) { bal = bal * (1 + i) + perPeriodContribution; invested += perPeriodContribution; if (p % n === 0) rows.push({ y: p / n, bal, invested }); }
    return { final: bal, invested, gain: bal - invested, rows };
  }, [principal, monthly, rate, years, freq]);
  const max = r ? r.rows[r.rows.length - 1].bal : 1;

  return (
    <Layout
      form={<>
        <Field label="Initial investment" value={principal} onChange={setPrincipal} min={0} />
        <Field label="Monthly contribution" value={monthly} onChange={setMonthly} min={0} />
        <Field label="Annual return rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
        <Field label="Time period" value={years} onChange={setYears} suffix="years" min={1} max={60} />
        <div><label className="label" htmlFor="freq">Compounding</label><select id="freq" className="field mt-1" value={freq} onChange={(e) => setFreq(e.target.value)}><option value="1">Yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></div>
      </>}
      results={r && <>
        <Stats>
          <Stat big label="Future value" value={fmt(r.final, 0)} copy />
          <Stat label="Total invested" value={fmt(r.invested, 0)} />
          <Stat label="Total gain" value={fmt(r.gain, 0)} />
          <Stat label="Growth multiple" value={`${fmt(r.final / r.invested, 2)}×`} />
          <Stat label="Gain share" value={`${fmt((r.gain / r.final) * 100, 1)}%`} />
        </Stats>
        <div className="card p-4">
          <p className="mb-3 text-sm font-medium">Growth by year</p>
          <div className="flex h-40 items-end gap-1">
            {r.rows.map((x) => <div key={x.y} className="group relative flex-1 rounded-t bg-brand-600/80 hover:bg-brand-600" style={{ height: `${(x.bal / max) * 100}%` }} title={`Year ${x.y}: ${fmt(x.bal, 0)}`}><div className="absolute bottom-0 w-full rounded-t bg-slate-400/60" style={{ height: `${(x.invested / x.bal) * 100}%` }} /></div>)}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Year 1</span><span>Year {r.rows.length}</span></div>
          <p className="mt-2 text-xs text-slate-500"><span className="inline-block h-2 w-2 rounded-sm bg-slate-400/60" /> Invested &nbsp; <span className="inline-block h-2 w-2 rounded-sm bg-brand-600" /> Returns</p>
        </div>
      </>}
    />
  );
}
