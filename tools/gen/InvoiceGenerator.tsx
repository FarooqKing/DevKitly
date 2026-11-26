"use client";
import { useMemo, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";

type Item = { desc: string; qty: number; price: number };
const fmt = (n: number, cur: string) => `${cur} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function InvoiceGenerator() {
  const [from, setFrom] = useState("Your Company\n123 Street, Karachi\nhello@company.com");
  const [to, setTo] = useState("Client Name\nClient Company\nclient@email.com");
  const [num, setNum] = useState("INV-0001"); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [due, setDue] = useState("");
  const [cur, setCur] = useState("PKR"); const [tax, setTax] = useState(0); const [discount, setDiscount] = useState(0); const [notes, setNotes] = useState("Thank you for your business. Payment due within 14 days.");
  const [items, setItems] = useState<Item[]>([{ desc: "Website design", qty: 1, price: 50000 }, { desc: "Hosting (12 months)", qty: 12, price: 1500 }]);
  const t = useMemo(() => { const sub = items.reduce((n, i) => n + i.qty * i.price, 0); const d = sub * (discount / 100); const tx = (sub - d) * (tax / 100); return { sub, d, tx, total: sub - d + tx }; }, [items, tax, discount]);
  const upd = (i: number, k: keyof Item, v: string) => setItems((a) => a.map((x, j) => (j === i ? { ...x, [k]: k === "desc" ? v : +v } : x)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="card space-y-4 p-5 print:hidden">
        <div className="grid grid-cols-2 gap-3"><div><label className="label">From</label><textarea className="field mt-1 h-20 text-sm" value={from} onChange={(e) => setFrom(e.target.value)} /></div><div><label className="label">Bill to</label><textarea className="field mt-1 h-20 text-sm" value={to} onChange={(e) => setTo(e.target.value)} /></div></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label className="label">Invoice #</label><input className="field mt-1" value={num} onChange={(e) => setNum(e.target.value)} /></div>
          <div><label className="label">Currency</label><input className="field mt-1" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
          <div><label className="label">Date</label><input type="date" className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="label">Due</label><input type="date" className="field mt-1" value={due} onChange={(e) => setDue(e.target.value)} /></div>
        </div>
        <div>
          <p className="label">Items</p>
          <div className="mt-1 space-y-2">{items.map((it, i) => <div key={i} className="flex gap-2"><input className="field flex-1" placeholder="Description" value={it.desc} onChange={(e) => upd(i, "desc", e.target.value)} /><input type="number" className="field w-16" value={it.qty} onChange={(e) => upd(i, "qty", e.target.value)} aria-label="Qty" /><input type="number" className="field w-28" value={it.price} onChange={(e) => upd(i, "price", e.target.value)} aria-label="Price" /><button className="btn-icon" onClick={() => setItems((a) => a.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={15} /></button></div>)}</div>
          <button className="btn mt-2" onClick={() => setItems((a) => [...a, { desc: "", qty: 1, price: 0 }])}><Plus size={15} /> Add item</button>
        </div>
        <div className="grid grid-cols-2 gap-3"><div><label className="label">Tax %</label><input type="number" className="field mt-1" value={tax} onChange={(e) => setTax(+e.target.value)} /></div><div><label className="label">Discount %</label><input type="number" className="field mt-1" value={discount} onChange={(e) => setDiscount(+e.target.value)} /></div></div>
        <div><label className="label">Notes / payment terms</label><textarea className="field mt-1 h-16 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={() => window.print()}><Printer size={15} /> Print / Save as PDF</button>
        <p className="text-xs text-slate-500">In the print dialog choose “Save as PDF”. Only the invoice is printed.</p>
      </div>
      <div id="invoice" style={{ background: "#ffffff", color: "#0f172a", colorScheme: "light" }} className="paper p-8 print:fixed print:inset-0 print:z-50 print:m-0 print:rounded-none print:border-0 print:shadow-none">
        <div className="flex items-start justify-between"><div><h2 className="text-3xl font-bold tracking-tight">INVOICE</h2><p className="mt-1 text-sm text-slate-500">#{num}</p></div><div className="text-right text-sm"><p>Date: {date}</p>{due && <p>Due: {due}</p>}</div></div>
        <div className="mt-8 grid grid-cols-2 gap-6 text-sm"><div><p className="label">From</p><p className="mt-1 whitespace-pre-line">{from}</p></div><div><p className="label">Bill to</p><p className="mt-1 whitespace-pre-line">{to}</p></div></div>
        <table className="mt-8 w-full text-sm"><thead><tr className="border-b-2 border-slate-900 text-left"><th className="py-2">Description</th><th className="py-2 text-right">Qty</th><th className="py-2 text-right">Price</th><th className="py-2 text-right">Amount</th></tr></thead>
          <tbody>{items.map((it, i) => <tr key={i} className="border-b border-slate-200"><td className="py-2">{it.desc || "—"}</td><td className="py-2 text-right">{it.qty}</td><td className="py-2 text-right">{fmt(it.price, cur)}</td><td className="py-2 text-right">{fmt(it.qty * it.price, cur)}</td></tr>)}</tbody></table>
        <div className="mt-4 ml-auto w-64 space-y-1 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{fmt(t.sub, cur)}</span></div>{discount > 0 && <div className="flex justify-between"><span>Discount ({discount}%)</span><span>−{fmt(t.d, cur)}</span></div>}{tax > 0 && <div className="flex justify-between"><span>Tax ({tax}%)</span><span>{fmt(t.tx, cur)}</span></div>}<div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-bold"><span>Total</span><span>{fmt(t.total, cur)}</span></div></div>
        {notes && <p className="mt-8 whitespace-pre-line text-xs text-slate-500">{notes}</p>}
      </div>
    </div>
  );
}
