"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setDone(true); setTimeout(() => setDone(false), 1500);
  }
  return (
    <button type="button" onClick={copy} disabled={!text} className={`btn ${className}`}>
      {done ? <Check size={15} className="text-green-600" /> : <Copy size={15} />} {done ? "Copied" : label}
    </button>
  );
}
