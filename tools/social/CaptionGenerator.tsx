"use client";
import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";
const moods: Record<string, string[]> = {
  Inspirational: ["Small steps every day. {k} 🌱", "Chasing dreams, one {k} at a time ✨", "Progress over perfection. {k} 💪", "Grateful for moments like this. {k} 🙏", "Your only limit is you. {k} 🚀"],
  Funny: ["Me pretending I have my life together: {k} 😅", "Not me posting {k} again 🙈", "Plot twist: it was {k} all along 😂", "{k}. That's it. That's the post.", "POV: you can't stop thinking about {k} 🤪"],
  Travel: ["Lost in {k} and loving it 🗺️", "Collect moments, not things. {k} ✈️", "{k} has my whole heart 🌍", "Wanderlust level: {k} 🏔️", "Take me back to {k} 🌅"],
  Food: ["Good food, good mood. {k} 🍽️", "Happiness is homemade {k} 😋", "Warning: {k} may cause extreme cravings 🤤", "Eat well, travel often. {k} 🍜", "First we eat, then we do everything else. {k}"],
  Business: ["Building something real with {k} 💼", "Consistency compounds. {k} 📈", "Behind every launch is 100 quiet days. {k}", "Work in progress, always. {k} 🛠️", "New week, new goals. {k} 🎯"],
  Fitness: ["Sweat now, shine later. {k} 💦", "No excuses, just {k} 🏋️", "Stronger than yesterday. {k} 🔥", "The gym is my therapy. {k} 🧠", "Results happen over time, not overnight. {k}"],
  Selfie: ["Confidence level: {k} 😎", "Just me and my {k} ☀️", "Glow up in progress. {k} ✨", "Mood: {k} 💅", "Felt cute, might post {k} later 📸"],
};
const ctas = ["Double tap if you agree ❤️", "Save this for later 📌", "Tag someone who needs to see this 👇", "What do you think? Comment below 💬", "Follow for more ✨", ""];
export default function CaptionGenerator() {
  const [k, setK] = useState("Sunday brunch"); const [mood, setMood] = useState("Inspirational"); const [seed, setSeed] = useState(0);
  const list = useMemo(() => { void seed; return moods[mood].map((t) => `${t.replace(/\{k\}/g, k)}\n\n${ctas[Math.floor(Math.random() * ctas.length)]}`.trim()); }, [k, mood, seed]);
  return (
    <div className="max-w-3xl space-y-4">
      <div className="card flex flex-wrap items-end gap-3 p-4"><div className="min-w-[14rem] flex-1"><label className="label" htmlFor="k">What's the post about?</label><input id="k" className="field mt-1" value={k} onChange={(e) => setK(e.target.value)} /></div><div><label className="label" htmlFor="m">Mood</label><select id="m" className="field mt-1" value={mood} onChange={(e) => setMood(e.target.value)}>{Object.keys(moods).map((m) => <option key={m}>{m}</option>)}</select></div><button className="btn" onClick={() => setSeed((s) => s + 1)}><RefreshCw size={14} /> Shuffle</button></div>
      <ul className="space-y-2">{list.map((c, i) => <li key={i} className="card flex items-start gap-3 p-3"><pre className="min-w-0 flex-1 whitespace-pre-wrap font-sans text-sm">{c}</pre><CopyButton text={c} className="h-8 shrink-0" /></li>)}</ul>
      <p className="text-xs text-slate-500">Add hashtags with the Hashtag Generator and fix spacing with the Caption Formatter.</p>
    </div>
  );
}
