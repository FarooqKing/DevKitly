"use client";
import TwoPane from "../_TwoPane";
import * as yaml from "js-yaml";
const sample = `name: DevKitly\ntools:\n  - json\n  - yaml\nfree: true\nmeta:\n  version: 2`;
export default function YamlJson({ defaultMode }: { defaultMode?: string } = {}) {
  return <TwoPane defaultMode={defaultMode} sample={sample} filename="converted.txt" inputPlaceholder="Paste YAML or JSON…" modes={[
    { key: "y2j", label: "YAML → JSON", run: (s) => JSON.stringify(yaml.load(s), null, 2) },
    { key: "j2y", label: "JSON → YAML", run: (s) => yaml.dump(JSON.parse(s), { lineWidth: -1 }) },
  ]} />;
}
