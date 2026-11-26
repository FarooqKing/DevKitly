"use client";
import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} return; }
    await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1500);
  }
  return <button onClick={share} className="btn shrink-0" title="Share">{done ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />} <span className="hidden sm:inline">{done ? "Link copied" : "Share"}</span></button>;
}
