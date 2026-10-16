"use client";
import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function TimestampConverter() {
  const [ts, setTs] = useState("");
  const [now, setNow] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");
  useEffect(() => { const tick = () => setNow(Math.floor(Date.now() / 1000)); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, []);

  const n = Number(ts.trim());
  const valid = ts.trim() !== "" && Number.isFinite(n);
  const isMs = valid && Math.abs(n) > 1e11;
  const date = valid ? new Date(isMs ? n : n * 1000) : null;
  const fromDate = dateInput ? Math.floor(new Date(dateInput).getTime() / 1000) : null;
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex items-center justify-between gap-4 py-2"><span className="text-sm text-slate-500">{k}</span><div className="flex items-center gap-2"><code className="font-mono text-sm">{v}</code><CopyButton text={v} label="" className="btn-ghost h-7 w-7 px-0" /></div></div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2 max-w-4xl">
      <div className="card p-4">
        <p className="text-sm text-slate-500">Current Unix time</p>
        <div className="mt-1 flex items-center gap-3"><code className="font-mono text-3xl tabular-nums">{now ?? "…"}</code><CopyButton text={now ? String(now) : ""} className="btn-ghost" /></div>
        <label className="label mt-6 block" htmlFor="ts">Timestamp → date</label>
        <input id="ts" className="field mt-1 font-mono" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000 or 1700000000000" />
        {ts && !valid && <p className="mt-2 text-sm text-red-600">Enter a number.</p>}
        {date && !isNaN(date.getTime()) && (
          <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            <Row k={`Detected as ${isMs ? "milliseconds" : "seconds"}`} v={date.toISOString()} />
            <Row k="UTC" v={date.toUTCString()} />
            <Row k="Local" v={date.toLocaleString()} />
            <Row k="Relative" v={rel(date)} />
          </div>
        )}
      </div>
      <div className="card p-4">
        <label className="label block" htmlFor="d">Date → timestamp</label>
        <input id="d" type="datetime-local" className="field mt-1" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
        {fromDate !== null && !isNaN(fromDate) && (
          <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            <Row k="Seconds" v={String(fromDate)} />
            <Row k="Milliseconds" v={String(fromDate * 1000)} />
            <Row k="ISO 8601" v={new Date(fromDate * 1000).toISOString()} />
          </div>
        )}
      </div>
    </div>
  );
}

function rel(d: Date) {
  const diff = (d.getTime() - Date.now()) / 1000, abs = Math.abs(diff);
  const u = abs < 60 ? [abs, "second"] : abs < 3600 ? [abs / 60, "minute"] : abs < 86400 ? [abs / 3600, "hour"] : abs < 2592000 ? [abs / 86400, "day"] : abs < 31536000 ? [abs / 2592000, "month"] : [abs / 31536000, "year"];
  const v = Math.round(u[0] as number);
  return `${v} ${u[1]}${v === 1 ? "" : "s"} ${diff < 0 ? "ago" : "from now"}`;
}
