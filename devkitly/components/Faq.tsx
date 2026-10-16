export default function Faq({ items, schema = true }: { items: { q: string; a: string }[]; schema?: boolean }) {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) };
  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((i) => (
          <details key={i.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{i.q}<span className="text-slate-400 transition group-open:rotate-45">+</span></summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{i.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
