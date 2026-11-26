"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
const packs: Record<string, string[]> = {
  general: ["love", "instagood", "photooftheday", "fashion", "beautiful", "happy", "cute", "tbt", "like4like", "followme", "picoftheday", "follow", "me", "selfie", "summer", "art", "instadaily", "friends", "repost", "nature"],
  business: ["entrepreneur", "business", "smallbusiness", "startup", "marketing", "success", "motivation", "digitalmarketing", "branding", "socialmedia", "ecommerce", "entrepreneurlife", "businessowner", "hustle", "growth"],
  tech: ["tech", "technology", "coding", "programming", "developer", "webdev", "javascript", "python", "ai", "machinelearning", "software", "code", "startup", "innovation", "computerscience"],
  food: ["food", "foodie", "foodporn", "yummy", "delicious", "instafood", "homemade", "cooking", "dinner", "lunch", "healthyfood", "recipe", "foodphotography", "dessert", "tasty"],
  travel: ["travel", "wanderlust", "travelgram", "adventure", "explore", "vacation", "travelphotography", "trip", "instatravel", "nature", "roadtrip", "traveling", "holiday", "beach", "mountains"],
  fitness: ["fitness", "gym", "workout", "fit", "motivation", "health", "training", "bodybuilding", "healthy", "lifestyle", "fitfam", "fitnessmotivation", "strong", "cardio", "exercise"],
  pakistan: ["pakistan", "karachi", "lahore", "islamabad", "pakistani", "beautifulpakistan", "pakistanzindabad", "desi", "urdu", "lahorediaries", "karachidiaries", "pakistanistyle", "pakfashion"],
};
export default function HashtagGenerator() {
  const [caption, setCaption] = useState(""); const [niche, setNiche] = useState("general"); const [count, setCount] = useState(20);
  const tags = useMemo(() => { const fromText = caption.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3 && !/^(this|that|with|from|have|your|about|they|them|what|when|were|will|just|like|some|than|then|into|over|also|very)$/.test(w)); const set = new Set<string>([...fromText.slice(0, 10), ...packs[niche], ...packs.general]); return [...set].slice(0, count).map((t) => `#${t}`); }, [caption, niche, count]);
  return (
    <div className="max-w-3xl space-y-4">
      <div className="card space-y-3 p-4"><textarea className="textarea h-24 font-sans text-sm" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Paste your caption or describe the post (keywords become hashtags)…" /><div className="flex flex-wrap items-center gap-3"><select className="field w-auto py-1.5" value={niche} onChange={(e) => setNiche(e.target.value)} aria-label="Niche">{Object.keys(packs).map((k) => <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>)}</select><label className="text-sm">Count <input type="number" min={5} max={30} className="field ml-1 inline w-16 py-1" value={count} onChange={(e) => setCount(+e.target.value)} /></label><span className="text-xs text-slate-500">Instagram allows 30; 5–15 relevant tags usually perform best.</span></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><span className="label">{tags.length} hashtags</span><CopyButton text={tags.join(" ")} className="btn-ghost h-8 px-2" /></div><p className="mt-2 text-sm leading-relaxed text-brand-700 dark:text-brand-500">{tags.join(" ")}</p></div>
    </div>
  );
}
