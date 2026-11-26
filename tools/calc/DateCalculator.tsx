"use client";
import { useEffect, useState } from "react";
import { Field, Layout, Stat, Stats } from "./_ui";

export default function DateCalculator() {
  const [mode, setMode] = useState<"between" | "add">("between");
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [days, setDays] = useState("30"); const [dir, setDir] = useState<1 | -1>(1);
  useEffect(() => { const t = new Date().toISOString().slice(0, 10); setA(t); setB(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)); }, []);

  const da = new Date(a), db = new Date(b);
  const ok = !isNaN(da.getTime()) && !isNaN(db.getTime());
  const total = ok ? Math.round((db.getTime() - da.getTime()) / 86400000) : 0;
  const biz = ok ? (() => { let n = 0; const [s, e] = da < db ? [da, db] : [db, da]; const d = new Date(s); while (d < e) { const w = d.getDay(); if (w !== 0 && w !== 6) n++; d.setDate(d.getDate() + 1); } return n; })() : 0;
  const result = !isNaN(da.getTime()) ? new Date(da.getTime() + dir * (+days || 0) * 86400000) : null;

  return (
    <Layout
      form={<>
        <div className="seg w-full"><button className="flex-1" aria-pressed={mode === "between"} onClick={() => setMode("between")}>Days between</button><button className="flex-1" aria-pressed={mode === "add"} onClick={() => setMode("add")}>Add / subtract days</button></div>
        <Field type="date" label={mode === "between" ? "Start date" : "Start date"} value={a} onChange={setA} />
        {mode === "between" ? <Field type="date" label="End date" value={b} onChange={setB} /> : <>
          <div className="seg w-full"><button className="flex-1" aria-pressed={dir === 1} onClick={() => setDir(1)}>Add</button><button className="flex-1" aria-pressed={dir === -1} onClick={() => setDir(-1)}>Subtract</button></div>
          <Field label="Number of days" value={days} onChange={setDays} min={0} /></>}
      </>}
      results={mode === "between" ? <Stats>
        <Stat big label="Difference" value={ok ? `${Math.abs(total).toLocaleString()} days` : "—"} />
        <Stat label="Weeks" value={ok ? `${Math.floor(Math.abs(total) / 7)} wk ${Math.abs(total) % 7} d` : "—"} />
        <Stat label="Business days (Mon–Fri)" value={ok ? biz.toLocaleString() : "—"} />
        <Stat label="Weekend days" value={ok ? (Math.abs(total) - biz).toLocaleString() : "—"} />
        <Stat label="Hours" value={ok ? (Math.abs(total) * 24).toLocaleString() : "—"} />
      </Stats> : <Stats>
        <Stat big label="Result date" value={result && !isNaN(result.getTime()) ? result.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—"} copy />
        <Stat label="ISO" value={result && !isNaN(result.getTime()) ? result.toISOString().slice(0, 10) : "—"} />
        <Stat label="Weeks" value={`${Math.floor((+days || 0) / 7)} wk ${(+days || 0) % 7} d`} />
      </Stats>}
    />
  );
}
