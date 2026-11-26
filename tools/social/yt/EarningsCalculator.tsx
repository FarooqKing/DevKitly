"use client";
import { useState } from "react";
import { Field, Layout, Stat, Stats, fmt } from "../../calc/_ui";
const niches: [string, number][] = [["General / Entertainment", 2], ["Gaming", 2.5], ["Vlogs / Lifestyle", 3], ["Education", 4], ["Health & Fitness", 4.5], ["Tech reviews", 6], ["Business / Marketing", 8], ["Finance / Investing", 12], ["Real estate / Insurance", 14]];
const countries: [string, number][] = [["United States", 1], ["United Kingdom", 0.85], ["Canada / Australia", 0.8], ["Germany / Western Europe", 0.7], ["UAE / Saudi Arabia", 0.55], ["Pakistan", 0.12], ["India", 0.15], ["Bangladesh / Nepal", 0.08], ["Global mix", 0.4]];
export default function EarningsCalculator() {
  const [views, setViews] = useState("100000"); const [per, setPer] = useState<"day" | "month" | "video">("month"); const [niche, setNiche] = useState(2); const [country, setCountry] = useState(8); const [custom, setCustom] = useState("");
  const rpm = custom ? +custom : +(niches[niche][1] * countries[country][1]).toFixed(2); // revenue per 1000 views (creator share)
  const v = +views || 0; const earn = (v / 1000) * rpm; const daily = per === "day" ? earn : per === "month" ? earn / 30 : NaN;
  return (
    <Layout
      form={<>
        <Field label="Views" value={views} onChange={setViews} min={0} />
        <div className="seg w-full"><button className="flex-1" aria-pressed={per === "day"} onClick={() => setPer("day")}>Per day</button><button className="flex-1" aria-pressed={per === "month"} onClick={() => setPer("month")}>Per month</button><button className="flex-1" aria-pressed={per === "video"} onClick={() => setPer("video")}>Per video</button></div>
        <div><label className="label" htmlFor="n">Niche</label><select id="n" className="field mt-1" value={niche} onChange={(e) => setNiche(+e.target.value)}>{niches.map((x, i) => <option key={x[0]} value={i}>{x[0]} (~${x[1]} RPM)</option>)}</select></div>
        <div><label className="label" htmlFor="c">Audience country</label><select id="c" className="field mt-1" value={country} onChange={(e) => setCountry(+e.target.value)}>{countries.map((x, i) => <option key={x[0]} value={i}>{x[0]}</option>)}</select></div>
        <Field label="Custom RPM (optional, overrides)" value={custom} onChange={setCustom} prefix="$" step={0.1} />
      </>}
      results={<>
        <Stats>
          <Stat big label={`Estimated earnings per ${per}`} value={`$${fmt(earn, 0)}`} copy />
          <Stat label="Effective RPM" value={`$${fmt(rpm, 2)}`} />
          <Stat label="Approx. CPM (advertiser)" value={`$${fmt(rpm / 0.55, 2)}`} />
          {per !== "video" && <><Stat label="Per day" value={`$${fmt(daily, 0)}`} /><Stat label="Per year" value={`$${fmt(daily * 365, 0)}`} /></>}
        </Stats>
        <div className="card p-4 text-xs text-slate-500"><p>RPM = what the creator earns per 1,000 views after YouTube&apos;s 45% cut. It varies hugely with niche, audience country, ad formats and season. These are rough industry averages for AdSense only; sponsorships, memberships and affiliate income are extra.</p></div>
      </>}
    />
  );
}
