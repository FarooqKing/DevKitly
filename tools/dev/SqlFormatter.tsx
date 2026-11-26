"use client";
import { useState } from "react";
import { format, type SqlLanguage } from "sql-formatter";
import TwoPane from "../_TwoPane";
const sample = `select u.id,u.name,count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 and u.created_at>'2024-01-01' group by u.id,u.name having count(o.id)>2 order by orders desc limit 10;`;
const langs: [SqlLanguage, string][] = [["sql", "Standard SQL"], ["mysql", "MySQL"], ["postgresql", "PostgreSQL"], ["sqlite", "SQLite"], ["tsql", "SQL Server"], ["plsql", "Oracle"], ["bigquery", "BigQuery"]];
export default function SqlFormatter() {
  const [lang, setLang] = useState<SqlLanguage>("sql"); const [upper, setUpper] = useState(true);
  return <TwoPane sample={sample} filename="query.sql" inputPlaceholder="Paste SQL…" modes={[
    { key: "fmt", label: "Format", run: (s) => format(s, { language: lang, keywordCase: upper ? "upper" : "preserve", tabWidth: 2 }) },
    { key: "min", label: "Minify", run: (s) => s.replace(/--.*$/gm, "").replace(/\s+/g, " ").trim() },
  ]} extraActions={<>
    <select className="field w-auto py-1.5" value={lang} onChange={(e) => setLang(e.target.value as SqlLanguage)} aria-label="Dialect">{langs.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> UPPERCASE keywords</label>
  </>} />;
}
