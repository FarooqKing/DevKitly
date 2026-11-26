"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Thin top loading bar: starts on internal link click, finishes when the route changes. */
export default function NavProgress() {
  const path = usePathname(); const [w, setW] = useState(0); const [show, setShow] = useState(false); const timer = useRef<ReturnType<typeof setInterval> | null>(null); const started = useRef("");
  const start = () => { if (timer.current) clearInterval(timer.current); setShow(true); setW(8); timer.current = setInterval(() => setW((x) => (x < 90 ? x + (90 - x) * 0.08 : x)), 120); };
  const done = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setW(100); setTimeout(() => { setShow(false); setW(0); }, 250); };
  useEffect(() => { if (started.current && started.current !== path) done(); started.current = path; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [path]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { const a = (e.target as HTMLElement).closest("a"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return; const href = a.getAttribute("href") ?? ""; if (!href.startsWith("/") || href === window.location.pathname || href.startsWith("/#") || href.endsWith(".xml")) return; start(); };
    const onNav = () => start();
    document.addEventListener("click", onClick, true); window.addEventListener("devkitly:navigate", onNav);
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("devkitly:navigate", onNav); };
  }, []);
  if (!show) return null;
  return <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"><div className="h-full bg-brand-600 shadow-[0_0_8px_rgba(79,70,229,.8)] transition-[width] duration-150" style={{ width: `${w}%` }} /></div>;
}
