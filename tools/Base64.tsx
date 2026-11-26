"use client";
import TwoPane from "./_TwoPane";

const enc = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const dec = (s: string) => {
  try { return new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, "")), (c) => c.charCodeAt(0))); }
  catch { throw new Error("Input is not valid Base64."); }
};

export default function Base64({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample="Hello, DevKitly! 👋" inputPlaceholder="Type or paste text…" modes={[
    { key: "encode", label: "Encode", run: enc },
    { key: "decode", label: "Decode", run: dec },
  ]} />;
}
