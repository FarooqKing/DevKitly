"use client";
import { useState } from "react";
import { Send } from "lucide-react";

// Pure client-side: mailto draft opens in the user's mail app. Replace with a form service (Formspree/Resend API route) later if needed.
export default function ContactForm({ email }: { email: string }) {
  const [type, setType] = useState("Tool request");
  const [name, setName] = useState(""); const [from, setFrom] = useState(""); const [msg, setMsg] = useState("");
  const href = `mailto:${email}?subject=${encodeURIComponent(`[${type}] from ${name || "a visitor"}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name}${from ? ` (${from})` : ""}`)}`;
  return (
    <form className="card space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
      <div><label className="label" htmlFor="ty">Topic</label><select id="ty" className="field mt-1" value={type} onChange={(e) => setType(e.target.value)}><option>Tool request</option><option>Bug report</option><option>Feedback</option><option>Business / advertising</option><option>Other</option></select></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="nm">Your name</label><input id="nm" className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label className="label" htmlFor="em">Your email</label><input id="em" type="email" className="field mt-1" value={from} onChange={(e) => setFrom(e.target.value)} required /></div>
      </div>
      <div><label className="label" htmlFor="ms">Message</label><textarea id="ms" className="field mt-1 h-36 resize-y" value={msg} onChange={(e) => setMsg(e.target.value)} required placeholder="Describe the tool you need or the problem you hit…" /></div>
      <button className="btn btn-primary" type="submit"><Send size={15} /> Send message</button>
      <p className="text-xs text-slate-500">This opens your email app with the message pre-filled. We don&apos;t store anything on our side.</p>
    </form>
  );
}
