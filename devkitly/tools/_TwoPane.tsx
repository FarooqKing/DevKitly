"use client";
import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Pane from "@/components/Pane";

interface Mode { key: string; label: string; run: (s: string) => string }
interface Props { modes: Mode[]; sample?: string; inputPlaceholder?: string; filename?: string; extraActions?: React.ReactNode }

export default function TwoPane({ modes, sample, inputPlaceholder, filename, extraActions }: Props) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(modes[0].key);
  const current = modes.find((m) => m.key === mode)!;

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try { return { output: current.run(input), error: "" }; }
    catch (e) { return { output: "", error: (e as Error).message }; }
  }, [input, current]);

  const canSwap = modes.length === 2 && output && !error;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="seg" role="group">
          {modes.map((m) => <button key={m.key} aria-pressed={mode === m.key} onClick={() => setMode(m.key)}>{m.label}</button>)}
        </div>
        {extraActions}
        {canSwap && (
          <button className="btn" onClick={() => { setInput(output); setMode(modes.find((m) => m.key !== mode)!.key); }}>
            <ArrowLeftRight size={15} /> Swap
          </button>
        )}
        {sample && <button className="btn btn-ghost ml-auto" onClick={() => setInput(sample)}>Load sample</button>}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Pane title="Input" value={input} onChange={setInput} placeholder={inputPlaceholder} error={error} />
        <Pane title="Output" value={output} readOnly filename={filename} placeholder="Result appears here as you type" />
      </div>
    </div>
  );
}
