"use client";
import TwoPane from "./_TwoPane";

export default function UrlEncoder() {
  return <TwoPane sample="https://example.com/search?q=hello world&lang=ur&x=a+b" inputPlaceholder="Paste a URL or query string…" modes={[
    { key: "encode", label: "Encode", run: (s) => encodeURIComponent(s) },
    { key: "decode", label: "Decode", run: (s) => { try { return decodeURIComponent(s); } catch { throw new Error("Malformed percent-encoding."); } } },
  ]} />;
}
