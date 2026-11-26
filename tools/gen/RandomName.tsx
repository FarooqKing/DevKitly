"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/CopyButton";

const data = {
  pakistani: { m: ["Ahmed", "Ali", "Bilal", "Hamza", "Usman", "Faisal", "Imran", "Kamran", "Saad", "Zain", "Omar", "Hassan", "Danish", "Fahad", "Rizwan"], f: ["Ayesha", "Fatima", "Sara", "Hira", "Maryam", "Zainab", "Sana", "Amna", "Iqra", "Mahnoor", "Noor", "Laiba", "Rabia", "Sadia", "Kinza"], l: ["Khan", "Ahmed", "Malik", "Sheikh", "Hussain", "Raza", "Butt", "Chaudhry", "Siddiqui", "Qureshi", "Akhtar", "Baig", "Mirza", "Shah", "Farooq"] },
  indian: { m: ["Aarav", "Vihaan", "Rohan", "Arjun", "Karan", "Rahul", "Vikram", "Aditya", "Sanjay", "Nikhil", "Raj", "Dev", "Manish", "Suresh", "Amit"], f: ["Priya", "Ananya", "Diya", "Neha", "Pooja", "Riya", "Kavya", "Sneha", "Meera", "Isha", "Anjali", "Shreya", "Nisha", "Divya", "Aditi"], l: ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Verma", "Reddy", "Nair", "Iyer", "Mehta", "Joshi", "Desai", "Rao", "Chopra", "Kapoor"] },
  english: { m: ["James", "Oliver", "William", "Henry", "Jack", "George", "Thomas", "Charlie", "Daniel", "Samuel", "Liam", "Noah", "Ethan", "Lucas", "Mason"], f: ["Olivia", "Emma", "Amelia", "Isla", "Ava", "Grace", "Sophia", "Charlotte", "Lily", "Emily", "Mia", "Ella", "Harper", "Evelyn", "Chloe"], l: ["Smith", "Johnson", "Brown", "Taylor", "Wilson", "Davies", "Evans", "Thomas", "Roberts", "Walker", "Wright", "Clarke", "Hall", "Green", "Baker"] },
  arabic: { m: ["Mohammed", "Abdullah", "Khalid", "Yusuf", "Ibrahim", "Tariq", "Hamid", "Sami", "Rashid", "Nasser", "Faris", "Majid", "Salem", "Adel", "Jamal"], f: ["Layla", "Nour", "Huda", "Salma", "Rania", "Dina", "Mona", "Reem", "Hala", "Yasmin", "Lina", "Aisha", "Farah", "Dalia", "Maha"], l: ["Al-Sayed", "Al-Rashid", "Haddad", "Khalil", "Nasser", "Mansour", "Saleh", "Hamdan", "Aziz", "Karim", "Fahad", "Jaber", "Hassan", "Yousef", "Amin"] },
};
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
export default function RandomName() {
  const [region, setRegion] = useState<keyof typeof data>("pakistani"); const [gender, setGender] = useState<"any" | "m" | "f">("any"); const [count, setCount] = useState(10);
  const [names, setNames] = useState<string[]>([]);
  function gen() { const d = data[region]; setNames(Array.from({ length: Math.min(count, 500) }, () => { const g = gender === "any" ? (Math.random() < 0.5 ? "m" : "f") : gender; return `${pick(d[g])} ${pick(d.l)}`; })); }
  return (
    <div className="max-w-2xl">
      <div className="card flex flex-wrap items-end gap-4 p-5">
        <div><label className="label" htmlFor="r">Origin</label><select id="r" className="field mt-1" value={region} onChange={(e) => setRegion(e.target.value as keyof typeof data)}><option value="pakistani">Pakistani</option><option value="indian">Indian</option><option value="english">English</option><option value="arabic">Arabic</option></select></div>
        <div><p className="label">Gender</p><div className="seg mt-1"><button aria-pressed={gender === "any"} onClick={() => setGender("any")}>Any</button><button aria-pressed={gender === "m"} onClick={() => setGender("m")}>Male</button><button aria-pressed={gender === "f"} onClick={() => setGender("f")}>Female</button></div></div>
        <div><label className="label" htmlFor="n">Count</label><input id="n" type="number" min={1} max={500} className="field mt-1 w-24" value={count} onChange={(e) => setCount(+e.target.value)} /></div>
        <button className="btn btn-primary" onClick={gen}><RefreshCw size={15} /> Generate</button>
        {names.length > 0 && <CopyButton text={names.join("\n")} label="Copy all" />}
      </div>
      {names.length > 0 && <ul className="card mt-4 grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-3 dark:divide-slate-800">{names.map((n, i) => <li key={i} className="px-4 py-2 text-sm">{n}</li>)}</ul>}
      <p className="mt-3 text-xs text-slate-500">Names are generated from common first and last names and are not real people. Useful for test data, mockups and placeholders.</p>
    </div>
  );
}
