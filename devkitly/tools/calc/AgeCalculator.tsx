"use client";
import { useEffect, useState } from "react";
import { Field, Layout, Stat, Stats } from "./_ui";

function diff(a: Date, b: Date) {
  let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("1995-06-15");
  const [at, setAt] = useState("");
  useEffect(() => setAt(new Date().toISOString().slice(0, 10)), []);
  const a = new Date(dob), b = at ? new Date(at) : null;
  const ok = b && !isNaN(a.getTime()) && !isNaN(b.getTime()) && b >= a;
  const r = ok ? diff(a, b!) : null;
  const days = ok ? Math.floor((b!.getTime() - a.getTime()) / 86400000) : 0;
  const next = ok ? (() => { const n = new Date(b!.getFullYear(), a.getMonth(), a.getDate()); if (n < b!) n.setFullYear(n.getFullYear() + 1); return Math.ceil((n.getTime() - b!.getTime()) / 86400000); })() : 0;

  return (
    <Layout
      form={<><Field type="date" label="Date of birth" value={dob} onChange={setDob} /><Field type="date" label="Age at date" value={at} onChange={setAt} /></>}
      results={<>
        <Stats>
          <Stat big label="Age" value={r ? `${r.y} years, ${r.m} months, ${r.d} days` : "—"} />
          <Stat label="Total months" value={r ? (r.y * 12 + r.m).toLocaleString() : "—"} />
          <Stat label="Total weeks" value={ok ? Math.floor(days / 7).toLocaleString() : "—"} />
          <Stat label="Total days" value={ok ? days.toLocaleString() : "—"} />
          <Stat label="Total hours" value={ok ? (days * 24).toLocaleString() : "—"} />
          <Stat label="Next birthday in" value={ok ? `${next} days` : "—"} />
          <Stat label="Day of birth" value={ok ? a.toLocaleDateString(undefined, { weekday: "long" }) : "—"} />
        </Stats>
      </>}
    />
  );
}
