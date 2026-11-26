import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";
import { getTool, tools } from "@/lib/tools";
export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG({ params }: { params: { slug: string } }) {
  const t = getTool(params.slug);
  // Satori fetches extra fonts for non-Latin glyphs (needs network at build), so keep OG text ASCII-only
  const ascii = (x: string) => x.replace(/↔/g, "to").replace(/[^\x20-\x7E]/g, "");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 700, color: "#a5b4fc" }}><div style={{ display: "flex", width: 44, height: 44, borderRadius: 12, background: "#4F46E5" }} /><span>{siteConfig.name} - {t?.category ?? "Tools"}</span></div>
      <div style={{ fontSize: 72, fontWeight: 800, marginTop: 40, lineHeight: 1.1 }}>{ascii(t?.name ?? siteConfig.name)}</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#cbd5e1" }}>{ascii(t?.short ?? siteConfig.tagline)}</div>
      <div style={{ fontSize: 26, marginTop: 50, color: "#a5b4fc" }}>Free - No sign-up - Runs in your browser</div>
    </div>, size);
}
