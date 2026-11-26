"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { Download } from "lucide-react";
import { downloadBlob } from "@/lib/files";

const bots = ["Googlebot", "Bingbot", "GPTBot", "ClaudeBot", "CCBot", "Yandex", "Baiduspider", "AhrefsBot", "SemrushBot"];
export default function RobotsGenerator() {
  const [policy, setPolicy] = useState<"allow" | "disallow">("allow");
  const [disallow, setDisallow] = useState("/admin/\n/private/\n/api/");
  const [allow, setAllow] = useState("");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [delay, setDelay] = useState("");
  const [blocked, setBlocked] = useState<string[]>(["GPTBot", "CCBot"]);
  const out = useMemo(() => {
    const l = ["User-agent: *", policy === "allow" ? "Allow: /" : "Disallow: /"];
    disallow.split("\n").filter((x) => x.trim()).forEach((x) => l.push(`Disallow: ${x.trim()}`));
    allow.split("\n").filter((x) => x.trim()).forEach((x) => l.push(`Allow: ${x.trim()}`));
    if (delay) l.push(`Crawl-delay: ${delay}`);
    blocked.forEach((b) => l.push("", `User-agent: ${b}`, "Disallow: /"));
    if (sitemap) l.push("", `Sitemap: ${sitemap}`);
    return l.join("\n");
  }, [policy, disallow, allow, sitemap, delay, blocked]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div><p className="label">Default policy for all bots</p><div className="seg mt-1.5"><button aria-pressed={policy === "allow"} onClick={() => setPolicy("allow")}>Allow everything</button><button aria-pressed={policy === "disallow"} onClick={() => setPolicy("disallow")}>Block everything</button></div></div>
        <div><label className="label" htmlFor="d">Disallow paths (one per line)</label><textarea id="d" className="field mt-1 h-24 font-mono" value={disallow} onChange={(e) => setDisallow(e.target.value)} /></div>
        <div><label className="label" htmlFor="a">Allow paths (exceptions)</label><textarea id="a" className="field mt-1 h-16 font-mono" value={allow} onChange={(e) => setAllow(e.target.value)} placeholder="/public/" /></div>
        <div><label className="label" htmlFor="s">Sitemap URL</label><input id="s" className="field mt-1" value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></div>
        <div><label className="label" htmlFor="c">Crawl delay (seconds, optional)</label><input id="c" type="number" className="field mt-1 w-32" value={delay} onChange={(e) => setDelay(e.target.value)} /></div>
        <div><p className="label">Block specific bots</p><div className="mt-2 flex flex-wrap gap-2">{bots.map((b) => <label key={b} className={`btn h-8 px-2.5 text-xs ${blocked.includes(b) ? "btn-primary" : ""}`}><input type="checkbox" className="sr-only" checked={blocked.includes(b)} onChange={() => setBlocked((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))} />{b}</label>)}</div></div>
      </div>
      <div className="card h-fit">
        <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">robots.txt</h2><div className="flex gap-1"><button className="btn-icon" onClick={() => downloadBlob(new Blob([out]), "robots.txt")} title="Download"><Download size={15} /></button><CopyButton text={out} className="btn-ghost h-8 px-2" /></div></header>
        <pre className="p-3 font-mono text-sm leading-relaxed">{out}</pre>
        <p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">Upload to the root of your site: https://yourdomain.com/robots.txt</p>
      </div>
    </div>
  );
}
