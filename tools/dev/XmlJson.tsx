"use client";
import TwoPane from "../_TwoPane";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
const sample = `<?xml version="1.0"?>\n<users>\n  <user id="1"><name>Ali</name><city>Karachi</city></user>\n  <user id="2"><name>Sara</name><city>Lahore</city></user>\n</users>`;
export default function XmlJson({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample={sample} filename="converted.txt" inputPlaceholder="Paste XML or JSON…" modes={[
    { key: "x2j", label: "XML → JSON", run: (s) => { const v = XMLValidator.validate(s); if (v !== true) throw new Error(v.err.msg); return JSON.stringify(new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" }).parse(s), null, 2); } },
    { key: "j2x", label: "JSON → XML", run: (s) => new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true, indentBy: "  " }).build(JSON.parse(s)) },
  ]} />;
}
