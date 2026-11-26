"use client";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import CopyButton from "@/components/CopyButton";

function b64url(s: string) {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(pad), (c) => c.charCodeAt(0)));
}
const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const claimNames: Record<string, string> = { iss: "Issuer", sub: "Subject", aud: "Audience", exp: "Expires", nbf: "Not before", iat: "Issued at", jti: "JWT ID" };

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const r = useMemo(() => {
    const t = token.trim(); if (!t) return null;
    const parts = t.split(".");
    if (parts.length !== 3) return { error: "A JWT has three parts separated by dots." } as const;
    try {
      const header = JSON.parse(b64url(parts[0])); const payload = JSON.parse(b64url(parts[1]));
      const exp = typeof payload.exp === "number" ? new Date(payload.exp * 1000) : null;
      return { header, payload, exp, expired: exp ? exp.getTime() < Date.now() : null, sig: parts[2] } as const;
    } catch { return { error: "Could not decode this token. Check that it is a valid JWT." } as const; }
  }, [token]);
  const pretty = (o: unknown) => JSON.stringify(o, null, 2);
  const timeClaims = ["exp", "nbf", "iat"];

  return (
    <div>
      <div className="card">
        <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
          <h2 className="text-sm font-medium">Token</h2>
          <button className="btn btn-ghost h-8 px-2" onClick={() => setToken(sample)}>Load sample</button>
        </header>
        <textarea className="h-28 w-full resize-y bg-transparent p-3 font-mono text-sm outline-none break-all" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste a JWT (eyJ…)" spellCheck={false} />
      </div>
      {r && "error" in r && <p className="mt-3 flex items-center gap-2 text-sm text-red-600"><AlertTriangle size={16} /> {r.error}</p>}
      {r && "payload" in r && (
        <>
          {r.exp && (
            <p className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${r.expired ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"}`}>
              {r.expired ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {r.expired ? "Token expired on" : "Token valid until"} {r.exp.toLocaleString()}
            </p>
          )}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="card">
              <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Header</h2><CopyButton text={pretty(r.header)} className="btn-ghost h-8 px-2" /></header>
              <pre className="overflow-auto p-3 font-mono text-sm">{pretty(r.header)}</pre>
            </section>
            <section className="card">
              <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Payload</h2><CopyButton text={pretty(r.payload)} className="btn-ghost h-8 px-2" /></header>
              <pre className="overflow-auto p-3 font-mono text-sm">{pretty(r.payload)}</pre>
            </section>
          </div>
          <section className="card mt-4">
            <header className="border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">Claims</h2></header>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {Object.entries(r.payload as Record<string, unknown>).map(([k, v]) => (
                  <tr key={k}>
                    <td className="w-40 px-3 py-2 font-mono text-slate-500">{k}{claimNames[k] ? <span className="ml-2 font-sans text-xs text-slate-400">{claimNames[k]}</span> : null}</td>
                    <td className="px-3 py-2 font-mono break-all">{String(typeof v === "object" ? JSON.stringify(v) : v)}{timeClaims.includes(k) && typeof v === "number" ? <span className="ml-2 font-sans text-xs text-slate-400">{new Date(v * 1000).toLocaleString()}</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
