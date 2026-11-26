"use client";
import TwoPane from "../_TwoPane";
const rev = (s: string) => [...s].reverse().join("");
export default function TextReverser() {
  return <TwoPane sample="The quick brown fox jumps over the lazy dog" inputPlaceholder="Type text…" modes={[
    { key: "chars", label: "Reverse text", run: rev },
    { key: "words", label: "Reverse words", run: (s) => s.split(/(\s+)/).reverse().join("") },
    { key: "lines", label: "Reverse lines", run: (s) => s.split("\n").reverse().join("\n") },
    { key: "each", label: "Flip each word", run: (s) => s.split(/(\s+)/).map((w) => (/\s/.test(w) ? w : rev(w))).join("") },
  ]} />;
}
