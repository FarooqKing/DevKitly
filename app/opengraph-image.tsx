import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 700 }}><div style={{ display: "flex", width: 64, height: 64, borderRadius: 16, background: "#4F46E5" }} /><span>{siteConfig.name}</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 800, marginTop: 40, lineHeight: 1.1 }}><span>Free online tools</span><span>that just work.</span></div>
      <div style={{ fontSize: 30, marginTop: 30, color: "#a5b4fc" }}>PDF | Office | Calculators | Developer tools | Images</div>
    </div>, size);
}
